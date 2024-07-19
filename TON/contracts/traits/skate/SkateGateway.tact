import "./SkateICCI.tact";

message SetExecutor {
    executor: Address;
}

message RevokeExecutor {
    executor: Address;
}

message SkateExecuteTask {
    query_id: Int;
    target_app: Address;
    execution_info: ExecutionInfo;
    relayer_signature: Slice;
}
trait SkateGatewayBase with OwnableTransferable {
    owner: Address;
    relayer: Int; // Relayer is an ED25519 public key
    executors: map<Address, Bool>; // NOTE: small mapping, won't exceeds 1k executors.
    virtual const SKATE_FEE: Int = ton("0.00"); // Gas required to process intent.

    ////////////////////// GOVERNANCE /////////////////////
    get fun relayer(): Int {
        return self.relayer;
    }

    inline fun is_executor(addr: Address): Bool {
        let executor: Bool? = self.executors.get(addr);
        return executor != null && executor!!;
    }
    get fun isExecutor(addr: Address): Bool {
        return self.is_executor(addr);
    }
    get fun executors(): map<Address, Bool> {
        return self.executors;
    }

    receive(msg: SetExecutor) {
        self.requireOwner();
        self.set_executor(msg.executor);
    }

    fun set_executor(executor: Address) {
        self.executors.set(executor, true);
        emit(SetExecutor{executor: executor}.toCell());
    }

    receive(msg: RevokeExecutor) {
        self.requireOwner();
        self.revoke_executor(msg.executor);
    }

    fun revoke_executor(executor: Address) {
        self.executors.del(executor);
        emit(RevokeExecutor{executor: executor}.toCell());
    }
    /////////////////////////////////////////////////////////

    //////////////////// Execution Layer ////////////////////
    nonce: Int; // Nonce to mitigate precomputation attack, also ensures intents is submitted in order
    get fun currentNonce(): Int {
        return self.nonce;
    }

    // NOTE: must be called from a skate app
    receive(msg: SkateInitiateTaskNotification) {
        let ctx: Context = context();
        require(ctx.value >= self.SKATE_FEE, "SkateInitiateTaskNotification::Not enough processing fee!");

        // NOTE: it's avs + relayer responibility to verify the execution,
        // therefore we don't need to whitelist app here.
        emit(SkateInitiateTaskEvent{
            query_id: msg.query_id,
            user: msg.user,
            app: ctx.sender, // TODO: MUST CHECK if any similar pattern to EVM meta-transaction -> MUST get correct app.
            execution_info: msg.execution_info,
        }.toCell());

        // TODO: DISCUSSION POINT
        // This callback enable supports for different type of use cases:
        //  a. default gateway => empty callback, for app with user = normal wallet (e.g. walletV4) uses.
        //  b. contract only gateway => send a notification with extra context to app, 
        //      for contracts with user = contracts (e.g. to acts as arbitrary middleware between user defined contracts).
        self._initiate_task_callback(ctx, msg);
    }

    virtual inline fun _initiate_task_callback(ctx: Context, msg: SkateInitiateTaskNotification) {}

    receive(msg: SkateExecuteTask) {
        self.only_executor();
        let execution_info: ExecutionInfo = msg.execution_info;
        require(now() <= execution_info.expiration, "SkateExecuteTask::Task expired!");

        // Construct the message hash = keccak256(payload || nonce) here.
        let payload_with_nonce: Slice = beginCell()
            .storeSlice(execution_info.payload.toCell().asSlice())
            .storeInt(self.nonce, 256)
            .endCell()
            .asSlice();

        let msg_hash: Int = sha256(payload_with_nonce);

        // validate signature + increase nonce
        self.validate_relayer_signature(msg_hash, msg.relayer_signature);
        self.nonce += 1;

        send(SendParameters{
            to: msg.target_app,
            value: execution_info.value,
            mode: SendRemainingValue, // msg.value - gas fee
            // NOTE: arbitrary call to destination app, ABI must be inspected off-chain
            body: execution_info.payload.toCell(),
        })
    }

    /////////////////////////////////////////////////////////
    inline fun only_executor() {
        nativeThrowUnless(132, self.is_executor(sender()))
    }

    inline fun validate_relayer_signature(hash: Int /* bytes32 */, signature: Slice) {
        let isValid: Bool = checkSignature(hash, signature, self.relayer);
        require(isValid, "Invalid Relayer Signature!");
    }
}

