import "@stdlib/deploy";
import "@stdlib/ownable";
import "./traits/jetton/IJetton.tact";
// import "./traits/skate/ISkate.tact"; // implicit
import "./traits/skate/SkateApp.tact";

const BET_PLACED: Int = 0;
const BET_WON: Int = 1;
const BET_LOST: Int = 2;
const BET_WITHDRAWN: Int = 3;

// NOTE: we only allow to bet on Election market now.
struct Bet {
    candidate_id: Int as uint8; // Mapping on frontend, now we allow TRUMP (0) | BIDEN (1) | Harris (2) | Kanye (3)
    direction: Bool; // True = YES, False = NO
    // WARN: mind the type, coins != uint256
    usd_amount: Int as coins; // Jetton (USDT) amount => USD equivalent amount will be placed for the bet on PolyMarket
    // NOTE: stateless => no need for status
    // status: Int as uint8 = 0; // 0 = PLACED, 1 = WIN, 2 = LOSE, 3 = ABORT (withdraw)
}

struct BetConfig {
    candidate_id: Int as uint8;
    direction: Bool;
}

// EXECUTOR ACTION
message SettleBet {
    settle_id: Int as uint256; // For on-chain trace, will be included in stateproof for AVS slashing
    user: Address;
    // WARN: mind the type, coins != uint256
    usd_amount: Int as coins; // amount Jetton settled for user (0 if lose, X decided by kernel if won)
}

// USER ACTION
message RequestSettleBet {
    candidate_id: Int as uint8;
    direction: Bool;
    // WARN: mind the type, coins != uint256
    ct_amount: Int as coins; // Condition Token amount, number of bet tokens for this market(candidate/direction) on PolyMarket
}

// TODO: Contracts INTEROP
message SettleBetNotification {}
message PlaceBetNotification {}

// TODO: Protocol collect permissible USDT amount
message ProtocolCollect {}

//////////////
// NOTE: Set the contract USDT wallet
// Address pre-calculation is impossible since:
//  + contract address depends on initial params
//  + jetton wallet derivation consists of contract address (the jetton owner)
// -> must set then lock
message SetJettonWallet {
    jetton_wallet: Address;
}
contract PolyMarket with Deployable, SkateAppBase, Ownable {
    owner: Address;
    skate_gateway: Address;

    balance: Int = 0; // Jetton balance (USDT)
    initiate_id: Int as uint64 = 0; // task initiated by this contract
    settle_id: Int as uint64 = 0; // task initiated by this contract
    const SETTLE_OFFSET: Int = 0xffffffff; // 2^32 offset.

    total_deposit: Int = 0;
    protocol_amount: Int = 0;

    get fun initiateCount(): Int {
        return self.initiate_id;
    }
    get fun settleCount(): Int {
        return self.settle_id;
    }
    get fun gateway(): Address {
        return self.skate_gateway;
    }

    // NOTE: NOW, Skate sponsors all fees.
    // TODO: A proper estimation for fee framework before public launch.
    const PROCESS_FEE: Int = ton("0.05"); // user pay this, ensure that [PROCESS_FEE > SKATE_FEE + EXECUTOR_FEE]
    const SKATE_FEE: Int = ton("0.02"); // fund the gateway contracts.
    const EXECUTOR_FEE: Int = ton("0.00"); // executor reward, app specific but Skate will impose some minimum requirements.

    const POLYGON_CHAIN: Int = 137;
    const EVM_TYPE: Int = 0;
    const POLYMARKET_CTF: Int = 0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E;

    init(owner: Address, skate_gateway: Address) {
        self.owner = owner;
        self.skate_gateway = skate_gateway;
    }

    // Calculate jetton address and update post deployment
    jetton_wallet: Address = newAddress(0, 0x1000000000000000000000000000000000000000000000000000000000000000); // dummy address
    is_jetton_set: Bool = false;
    receive(msg: SetJettonWallet) {
        self.requireOwner();
        require(!self.is_jetton_set, "PolyMarket::SetJettonWallet::Wallet is set");
        self.jetton_wallet = msg.jetton_wallet;
        self.is_jetton_set = true;
    }
    /////////// Governance actions ////////////
    receive(msg: ProtocolCollect) {}

    //////////// For SkateGateway /////////////
    inline fun construct_initiate_params(query_id: Int, user: Address, execution_data: Cell): SkateInitiateTask {
        let initiate_params = SkateInitiateTask {
            query_id: query_id,
            user: user, // the actual jetton wallet owner.
            processing_fee: self.SKATE_FEE,
            execution_info: ExecutionInfo {
                value: 0,
                expiration: now() + 120, // 2 minutes
                payload: Payload {
                    destination: Destination {
                        chain_id: self.POLYGON_CHAIN,
                        chain_type: self.EVM_TYPE,
                        address: self.POLYMARKET_CTF,
                    }.toCell(),
                    data: execution_data,
                }
            }
        };
        return initiate_params;
    }

    //////////// User interactions ////////////
    // NOTE: There is no concept of approve USDT to spend on TON, therefore user can only place bet via transferring Jetton + specify forward_payload.
    // => EQUIVALENTLY, PLACE BET = SENT JETTON (USDT) + BET INFO.
    //
    //// 1. PLACE BET
    receive (msg: JettonTransferNotification) {
        let ctx: Context = context();
        let bet_config: BetConfig = BetConfig.fromSlice(msg.forward_payload);
        require(msg.amount > ton("0.0001"), "PolyMarket::JettonTransferNotification::Bet size too small!");
        require(bet_config.candidate_id <= 4, "PolyMarket::JettonTransferNotification::Invalid candidate id!");

        // 1. Create and save the bet struct
        let new_bet: Bet = Bet {
            candidate_id: bet_config.candidate_id,
            usd_amount: msg.amount, // Jetton USDT amount
            direction: bet_config.direction,
        };

        // 2. Notify SkateGateway to initiate a task
        self.initiate_id += 1;
        let initiate_params = self.construct_initiate_params(self.initiate_id, msg.sender, new_bet.toCell());
        self.notify_gateway(ctx, initiate_params);

        // TODO: (Contracts INTEROP)
        // 3. Notify the caller that the receiver was executed and forward remaining value back
        // self.notify("Bet placed".asComment());
    }

    // TODO: (Contracts INTEROP)
    receive(msg: PlaceBetNotification) {}

    //// 2. Settle Bet
    receive(msg: RequestSettleBet) {
        let ctx: Context = context();

        // 1. Initiate an withdrawal request
        self.settle_id += 1;
        let initiate_params = self.construct_initiate_params(self.settle_id, ctx.sender, msg.toCell());
        self.notify_gateway(ctx, initiate_params);
    }
    ///////////////////////////////////////////

    ////////// Executor interactions //////////

    // NOTE: Amount is verified by relayer, this only happens after actual execution is done on PolyMarket (Polygon)
    // Settle the bet by:
    //  1. Transfer Jetton (USDT) TO USER
    //  2. Transfer fee to executor.
    receive(msg: SettleBet) {
        self.only_gateway();
        // NOTE: This will be check at kernel level.
        // require(msg.from.chain_type == self.EVM_TYPE, "PolyMarket::SettleBet::Invalid originating chain type!");
        // require(msg.from.chain_id == self.POLYGON_CHAIN, "PolyMarket::SettleBet::Invalid originating chain id!");
        // require(msg.from.address == self.POLYGON_CHAIN, "PolyMarket::SettleBet::Invalid originating address!");

        // a. Transfer settled jetton amount to user
        dump(msg.usd_amount);
        dump(msg.user);
        let transfer_msg = JettonTransfer {
            query_id: 0,
            amount: msg.usd_amount,
            destination: msg.user,
            response_destination: myAddress(),
            custom_payload: null,
            forward_ton_amount: 0,
            forward_payload: emptySlice()
            // TODO: (Contracts INTEROP)
            // Set custom forward payload to user (contract), user needs to pay fee to executor to set gas for processing this payload.
            // forward_payload: SettleBetNotification{}.toCell().asSlice()
        };
        self.transfer_jetton(transfer_msg);
    }

    // TODO: (Contracts INTEROP)
    receive(msg: SettleBetNotification) {}

    inline fun transfer_jetton(msg: JettonTransfer) {
        send(SendParameters{
            to: self.jetton_wallet,
            // TODO: (Contracts INTEROP)
            // Set custom forward payload to user (contract)
            value: ton("0.1"),
            mode: SendPayGasSeparately, // make sure user get their amount
            body: msg.toCell()
        });
    }
}
