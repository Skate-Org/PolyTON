import "@stdlib/deploy";
import "./traits/jetton/JettonWallet.tact";
import "./traits/skate/SkateApp.tact";
import "./jetton_wallet.tact";

const BET_PLACED: Int = 0;
const BET_WON: Int = 1;
const BET_LOST: Int = 2;
const BET_WITHDRAWN: Int = 3;

// NOTE: we only allow to bet on Election market now.
struct Bet {
    candidate_id: Int as uint256; // Mapping on frontend, now we allow TRUMP (0) | BIDEN (1) | Harris (2) | Kanye (3)
    usd_amount: Int as uint256; // Jetton (USDT) amount => USD equivalent amount will be placed for the bet on PolyMarket
    direction: Bool; // True = YES, False = NO
    // NOTE: stateless => no need for status
    // status: Int as uint8 = 0; // 0 = PLACED, 1 = WIN, 2 = LOSE, 3 = ABORT (withdraw)
}

struct BetConfig {
    candidate_id: Int as uint256;
    direction: Bool;
}

// EXECUTOR ACTION
message SettleBet {
    settle_id: Int as uint256; // For on-chain trace, will be included in stateproof for AVS slashing
    user: Address;
    usd_amount: Int as uint256; // amount Jetton settled for user (0 if lose, X decided by kernel if won)
}

// USER ACTION
message RequestSettleBet {
    candidate_id: Int as uint32;
    direction: Bool;
    ct_amount: Int as uint256; // Condition Token amount, number of bet tokens for this market(candidate/direction) on PolyMarket
}

contract PolyMarket with Deployable, SkateAppBase, JettonWalletBase {
    owner: Address;
    jetton_master: Address; // most likely USDT contract
    skate_gateway: Address;

    balance: Int = 0; // Jetton balance (USDT)
    initiate_id: Int = 0; // task initiated by this contract
    settle_id: Int = 0; // task initiated by this contract
    const SETTLE_OFFSET: Int = 0xffffffffffffffffffffffffffffffff; // 2^128 offset.

    get fun lastTaskId(): Int {
        return self.initiate_id;
    }
    get fun gateway(): Address {
        return self.skate_gateway;
    }

    // NOTE: NOW, Skate sponsors all fees.
    // TODO: A proper estimation for fee framework before public launch.
    const PROCESS_FEE: Int = ton("0.00"); // user pay this, ensure that [PROCESS_FEE > SKATE_FEE + EXECUTOR_FEE]
    const SKATE_FEE: Int = ton("0.00"); // fund the gateway contracts.
    const EXECUTOR_FEE: Int = ton("0.00"); // executor reward, app specific but Skate will impose some minimum requirements.

    const POLYGON_CHAIN: Int = 137;
    const EVM_TYPE: Int = 0;
    const POLYMARKET_CTF: Int = 0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E;

    // NOTE: from actual USDT implementations at ./mocks/*.fc, this contract init must conform to jetton interface.
    // Otherwise Master getter will fails -> problem with burn (and also mint).
    init(skate_gateway: Address, jetton_master: Address) {
        self.owner = skate_gateway; // WARN: owner MUST BE SKATE GATEWAY, else settlement flows wont't work.
        self.jetton_master = jetton_master;
        self.skate_gateway = skate_gateway;
    }

    // NOTE: only to conform with jetton design, it never supposed to be called if correct settlement is ensured.
    //
    // This function will be used create new jetton wallet (before transfer to the user) if user don't have one yet,
    // though user must have a wallet and deposit to this contract in order to create a bet in the first place.
    override inline fun calculate_jetton_wallet_init(owner: Address): StateInit {
        return initOf JettonWallet(owner, self.jetton_master);
    }

    // NOTE: There is no concept of approve USDT to spend on TON, therefore user can only place bet via transferring Jetton + specify calldata.
    // Therefore, this contract implements an extension of JettonInternalTransfer (jetton receive handler)
    // that embeds the Bet struct in forward_payload field.
    // => EQUIVALENTLY, SENT BET = SENT JETTON (USDT) + BET INFO.
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

    //////////// User interactions ////////////

    //// 1. PLACE BET
    override inline fun _receive_jetton_callback(ctx: Context, msg: JettonInternalTransfer) {
        let user: Address = ctx.sender;
        let bet_config: BetConfig = BetConfig.fromSlice(msg.forward_payload);

        // 1. Create and save the bet struct
        let newBet: Bet = Bet {
            candidate_id: bet_config.candidate_id,
            usd_amount: msg.amount, // Jetton USDT amount
            direction: bet_config.direction,
        };

        // 2. Notify SkateGateway to initiate a task
        self.initiate_id += 1;
        let initiate_task_msg = SkateInitiateTask {
            query_id: self.initiate_id,
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
        // self.notify("Bet placed".asComment());
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

    //// 2. Sell or Collect winning amount
    receive(msg: RequestSettleBet) {
        let ctx: Context = context();

        // 1. Initiate an withdrawal request
        self.settle_id += 1;
        let initiate_task_msg = SkateInitiateTask {
            query_id: self.settle_id + self.SETTLE_OFFSET, // will match settle_id when this is settled
            processing_fee: self.SKATE_FEE,
            user: ctx.sender, // the actual jetton wallet owner.
            execution_info: ExecutionInfo {
                value: 0,
                expiration: now() + 120, // 2 minutes
                payload: Payload {
                    chain_id: self.POLYGON_CHAIN,
                    chain_type: self.EVM_TYPE,
                    app: self.POLYMARKET_CTF,
                    data: msg.toCell().asSlice(),
                }
            }
        };
        self._notify_gateway(ctx, initiate_task_msg);
    }
    ///////////////////////////////////////////

    ////////// Executor interactions //////////
    // NOTE: Amount is verified by relayer, this only happens after actual execution is done on PolyMarket (Polygon)
    // 1. Settle the bet by:
    //  a. Transfer Jetton (USDT) TO USER
    //  b. Transfer fee to executor.
    receive(msg: SettleBet) {
        self.only_gateway();
        let ctx: Context = context();

        // a. Transfer settled jetton amount to user
        // NOTE: Skate vault sponsored this.
        let transfer_msg = JettonTransfer {
            query_id: 0, 
            amount: msg.usd_amount,
            destination: msg.user,
            response_destination: msg.user,
            custom_payload: null,
            forward_ton_amount: 0,
            forward_payload: msg.toCell().asSlice() // in case user is a contract, inform them of the settlement context
        };
        self._transfer_jetton(ctx, transfer_msg);
    }
}
