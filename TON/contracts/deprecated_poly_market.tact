import "@stdlib/deploy";
import "./traits/jetton/JettonWallet.tact";
import "./traits/skate/SkateApp.tact";
import "./jetton_wallet.tact";

// NOTE: A stateful implementation, if instant withdrawal requirement must be ensured.
const BET_PLACED: Int = 0;
const BET_WON: Int = 1;
const BET_LOST: Int = 2;
const BET_WITHDRAWN: Int = 3;
struct Bet {
    market_id: Int as uint256; // ERC1155 tokenId of equivalent PolyMarket market.
    amount: Int as uint256; // Jetton or TON amount, USD equivalent to bet on PolyMarket
    direction: Bool; // True = BUY, False = Sell
    status: Int as uint8 = 0; // 0 = PLACED, 1 = WIN, 2 = LOSE, 3 = ABORT (withdraw)
    // TODO: how should we enforce this? Orderbook is managed by polymarket.
    // Oracle or trusted settlement?
    // priceQ64: Int as uint64 = 0; // Fixed point Q64 => MAX(uint64) = 1, linearly scaled.
    // NOTE: DISCUSSION POINT (DEPRECATED)
    // Two possible approaches for this:
    // 1. On-chain Oracle:
    //      a. Oracle, e.g. RedStone, push price into contracts by manager call -> data is stored in contract.
    //          In our case push the live market price from PolyMarket to this contract. REQUIREMENTs: frequency <= PolyMarket frequency. (cost of update = ??)
    //      b. The contract consumes this data, user can view this on the contracts.
    //  => With this, we can allow user to buy + sell token as well (still VIA executor, WITH some slippage).
    // -----
    // 2. Off-chain trusted Oracle:
    //      a. The user DO NOT specify price, but know of price.
    //      b. Fill price is monitor by Skate and reports on frontend.
    //      c. Settlement using this fill price.
    //  => Still can do as above, but less costly and less development effort (no on-chain price feeds process)
}

struct BetList {
    bets: map<Int as uint16, Bet>;
    length: Int as uint16 = 0;
}
// Extension mutation function for adding new entries to the end of the array
extends mutates fun append(self: BetList, item: Bet) {
    // WARN: https://docs.tact-lang.org/book/maps#limits-and-drawbacks
    // MAX map size ~ uint16/2 = 32000, gas is more expensive with map size
    // => user should create a new account after > 30k bets
    require(self.length + 1 <= 32000, "WHATT! You have 32000 bets placed!");
    self.bets.set(self.length, item); // set the entry (key-value pair)
    self.length += 1;                // increase the length field
}
extends mutates fun get(self: BetList, idx: Int): Bet {
    // WARN: https://docs.tact-lang.org/book/maps#limits-and-drawbacks
    // MAX map size ~ uint16/2 = 32000, gas is more expensive with map size
    // => user should create a new account after > 30k bets
    nativeThrowUnless(5, idx < self.length);
    return self.bets.get(idx)!!; // set the entry (key-value pair)
}
extends mutates fun upgradeStatus(self: BetList, idx: Int, newStatus: Int) {
    require(idx < self.length, "Index out of bounds");
    let targetBet: Bet = self.bets.get(idx)!!;
    targetBet.status = newStatus;
    self.bets.set(idx, targetBet);
}
fun emptyBetList(): BetList {
    return BetList{
        bets: emptyMap(),
        length: 0
    };
}

message SettleBet {
    user: Address;
    executor: Address;
    bet_idx: Int as uint32;
    won: Bool;
}

struct BetConfig {
    market_id: Int as uint256;
    direction: Bool;
}

message WithdrawBet {
    bet_idx: Int as uint32;
}

contract PolyMarket with Deployable, SkateAppBase, JettonWalletBase {
    owner: Address;
    jetton_master: Address; // most likely USDT contract
    skate_gateway: Address;

    balance: Int = 0; // Jetton balance (USDT)
    task_id: Int = 0; // task initiated by this contract

    // WARN: DISCUSSION POINT (DEPRECATED)
    // Discourage: https://docs.tact-lang.org/book/maps#limits-and-drawbacks
    // This design CAN'T SUPPORT MORE THAN 30K USERs.
    // Instead follow TON distributed architecture outlined in: https://docs.ton.org/learn/overviews/ton-blockchain#many-accountchains-shards
    // <=> Individual user posesses the: "PolyMarket" wallet = "Jetton + betting" wallet.
    //
    // NOTE: Alternative approaches might be much more complicated:
    //  1. Wallet manage their own bet books
    //  2. Receive handler that let only polymarket update
    //  3. Wallet must be a Jetton Wallet.
    //  => Partly different flow, user will need to fund this "PolyMarket wallet" with Jetton to bet.
    //  Consequently increase UX complexity to manage multiple wallets
    map_user_bets: map<Address, BetList>;

    get fun betBook(): map<Address, BetList> {
        return self.map_user_bets;
    }
    get fun lastTaskId(): Int {
        return self.task_id;
    }
    get fun gateway(): Address {
        return self.skate_gateway;
    }

    // WARN: THIS MUST BE HIGHER THAN THE BASE FEE DEFINED IN GATEWAY
    // A stricter estimation to be calculated.
    const PROCESS_FEE: Int = ton("0.02");
    const SKATE_FEE: Int = ton("0.01"); // SkateGateway is 0.01
    const POLYGON_CHAIN: Int = 137;
    const EVM_TYPE: Int = 0;
    const POLYMARKET_CTF: Int = 0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E;

    // WARN: from actual USDT implementations at .mocks/*.fc, this contract init must conform to jetton interface.
    // Otherwise Master getter will fails -> problem with burn (and also mint).
    init(skate_gateway: Address, jetton_master: Address) {
        self.owner = skate_gateway;
        self.jetton_master = jetton_master;
        self.skate_gateway = skate_gateway;
    }

    override inline fun calculate_jetton_wallet_init(owner: Address): StateInit {
        return initOf JettonWallet(owner, self.jetton_master);
    }

    //////////// User interactions ////////////
    // NOTE: As explained above, user can only place bet via transferring Jetton.
    // Therefore, this contract implements an extension of JettonInternalTransfer (jetton receive handler)
    // that embeds the Bet struct in forward_payload field.
    // EQUIVALENTLY, SENT BET = SENT JETTON (USDT) + PAYLOAD. OTHERWISE, JETTON WILL BE BOUNCED BACK.
    //
    //// 1. PLACE BET
    override inline fun _receive_jetton_callback(ctx: Context, msg: JettonInternalTransfer) {
        let user: Address = ctx.sender;
        let bet_config: BetConfig = BetConfig.fromSlice(msg.forward_payload);

        // 1. Create and save the bet struct
        let newBet: Bet = Bet {
            market_id: bet_config.market_id,
            amount: msg.amount, // Jetton USDT amount
            direction: bet_config.direction,
            status: BET_PLACED
        };
        let bet_list: BetList? = self.map_user_bets.get(user);
        if (bet_list == null) {
            bet_list = emptyBetList();
        }
        bet_list!!.append(newBet);
        self.map_user_bets.set(user, bet_list!!);

        // 2. Notify SkateGateway to initiate a task
        self.task_id += 1;
        let initiate_task_msg = SkateInitiateTask {
            query_id: self.task_id,
            processing_fee: self.SKATE_FEE,
            user: msg.from, // the actual jetton wallet owner.
            execution_info: ExecutionInfo {
                value: 0,
                expiration: now() + 120, // 2 minutes
                payload: Payload {
                    chain_id: self.POLYGON_CHAIN,
                    chain_type: self.EVM_TYPE,
                    app: self.POLYMARKET_CTF,
                    data: newBet.toCell().asSlice(),
                }
            }
        };
        self._notify_gateway(ctx, initiate_task_msg);

        // 3. Notify the caller that the receiver was executed and forward remaining value back
        self.notify("BetPlaced".asComment());
    }
    override inline fun _internal_transfer_validate(ctx: Context, msg: JettonInternalTransfer) {
        if (ctx.sender != self.jetton_master) {
            let init: StateInit = self.calculate_jetton_wallet_init(msg.from);
            require(ctx.sender == contractAddress(init),
                "JettonWallet: Only Jetton master or Jetton wallet can call this function"
            );
        }
        require(ctx.value >= self.PROCESS_FEE, "PlaceBet::Not enough processing fee!");
    }

    //// 2. WITHDRAW
    receive(msg: WithdrawBet) {
        let ctx: Context = context();
        let user: Address = ctx.sender;
        let bet_list: BetList? = self.map_user_bets.get(user);
        require(bet_list != null, "No bet placed!");
        let bet: Bet = bet_list!!.get(msg.bet_idx);
        require(bet.status == BET_PLACED, "Invalid bet state!");

        // 1. update bet status
        bet_list!!.upgradeStatus(msg.bet_idx, BET_WITHDRAWN);
        self.map_user_bets.set(user, bet_list!!);

        // 2. transfer ton to original user
        let transfer_msg = JettonTransfer {
            query_id: 0,
            amount: bet.amount,
            destination: user,
            response_destination: user,
            custom_payload: null,
            forward_ton_amount: 0,
            forward_payload: emptyCell().asSlice()
        };
        self._transfer_jetton(ctx, transfer_msg);
    }
    ///////////////////////////////////////////

    ////////// Executor interactions //////////
    // NOTE: To make the settle bet + transfer jetton to user atomic, the contract must:
    // 1. Transfer the user deposited Jetton to executor wallet.
    // 2. Force executor to fill with correct Jetton USDT amounts.
    // Meaning either:
    //  a) Executor must process a special Jetton Wallet that allow relayer to call transfer (BETTER)
    //  OR
    //  b) The Relayer + AVS will check that amounts is settle and executor must call this function to claim the amount on Polygon. (FASTER)
    receive(msg: SettleBet) {
        self.only_gateway();
        let ctx: Context = context();
        let bet_list = self.map_user_bets.get(msg.user);
        require(bet_list != null, "Invalid user! This user hasn't placed any bet!");
        let bet = bet_list!!.get(msg.bet_idx);

        // 1. Upgrade the user bet state.
        if (msg.won) {
            // NOTE: If won AVS + Relayer verified that this executor has transferred
            // exactly (bet.amount * 2^64 / priceQ64) USDT to user
            bet_list!!.upgradeStatus(msg.bet_idx, BET_WON);
        } else {
            bet_list!!.upgradeStatus(msg.bet_idx, BET_LOST);
        }
        self.map_user_bets.set(msg.user, bet_list);

        // 2. Transfer the betted Jetton (USDT) + fee (USDT or TON) to executor
        let transfer_msg = JettonTransfer {
            query_id: 0,
            amount: bet.amount,
            destination: msg.executor,
            response_destination: msg.executor,
            custom_payload: null,
            forward_ton_amount: 0,
            forward_payload: emptyCell().asSlice()
        };
        self._transfer_jetton(ctx, transfer_msg);
    }

    override inline fun _transfer_jetton(ctx: Context, msg: JettonTransfer) {
        let init: StateInit = self.calculate_jetton_wallet_init(msg.destination);
        let receiver: Address = contractAddress(init);
        send(SendParameters{
            to: receiver,
            value: 0,
            bounce: true,
            mode: SendRemainingValue,
            body: JettonInternalTransfer{
                query_id: msg.query_id,
                amount: msg.amount,
                response_address: msg.response_destination,
                from: myAddress(),
                forward_ton_amount: msg.forward_ton_amount,
                forward_payload: msg.forward_payload
            }.toCell(),
            code: init.code,
            data: init.data
        });
    }
}
