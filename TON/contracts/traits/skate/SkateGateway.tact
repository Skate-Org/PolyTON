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
    executors: map<Address, Bool>;
    virtual const minFee: Int = ton("0.02");

    ////////////////////// GOVERNANCE /////////////////////
    get fun relayer(): Int {
        return self.relayer;
    }

    inline fun _isExecutor(addr: Address): Bool {
        let executor: Bool? = self.executors.get(addr);
        return executor != null && executor!!;
    }
    get fun isExecutor(addr: Address): Bool {
        return self._isExecutor(addr);
    }
    get fun executors(): map<Address, Bool> {
        return self.executors;
    }

    receive(msg: SetExecutor) {
        self.requireOwner();
        self._setExecutor(msg.executor);
    }

    fun _setExecutor(executor: Address) {
        self.executors.set(executor, true);
        emit(SetExecutor{executor: executor}.toCell());
    }

    receive(msg: RevokeExecutor) {
        self.requireOwner();
        self._revokeExecutor(msg.executor);
    }

    fun _revokeExecutor(executor: Address) {
        self.executors.del(executor);
        emit(RevokeExecutor{executor: executor}.toCell());
    }
    /////////////////////////////////////////////////////////

    //////////////////// Execution Layer ////////////////////
    receive(msg: SkateInitiateTaskNotification) {
        let ctx: Context = context();
        require(ctx.value > self.minFee, "SkateInitiateTaskNotification::Not enough processing fee!");

        // NOTE: it's avs + relayer responibility to verify the execution,
        // therefore we don't need to whitelist app here.
        emit(SkateInitiateTaskEvent{
            query_id: msg.query_id,
            // TODO: MUST CHECK if any similar pattern to EVM meta-transaction -> MUST get correct sender.
            app: ctx.sender,
            execution_info: msg.execution_info,
        }.toCell());
    }

    receive(msg: SkateExecuteTask) {
        self._onlyExecutor();
        let execution_info: ExecutionInfo = msg.execution_info;
        require(now() <= execution_info.expiration, "SkateExecuteTask::Task expired!");

        send(SendParameters{
            to: msg.target_app,
            value: execution_info.value,
            mode: SendRemainingValue, // msg.value - gas fee
            // NOTE: arbitrary call to destination app, ABI must be inspected off-chain
            body: execution_info.payload.asCell(),
        })
    }

    /////////////////////////////////////////////////////////
    inline fun _onlyExecutor() {
        nativeThrowUnless(132, self._isExecutor(sender()))
    }

    inline fun _validateRelayerSignature(hash: Int /* bytes32 */, signature: Slice) {
        let isValid: Bool = checkSignature(hash, signature, self.relayer);
        require(isValid, "Invalid Relayer Signature!");
    }
}

