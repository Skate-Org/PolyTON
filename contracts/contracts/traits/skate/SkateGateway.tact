import "./SkateICCI.tact";

message SetExecutor {
    executor: Address;
}

message RevokeExecutor {
    executor: Address;
}

message SetRelayerEvent {
    currentRelayer: Int;
    newRelayer: Int;
}

message SkateExecuteTask {
    query_id: Int;
    target_app: Address;
    execution_payload: Cell;
    relayer_signature: Slice;
}

trait SkateGateway with OwnableTransferable {
    owner: Address;
    relayer: Int; // Relayer is an ED25519 public key
    executors: map<Address, Bool>;

    const CHANGE_RELAYER_MSG: String = "Skate::CHANGE_RELAYER";
    const MIN_PROCESSING_GAS: Int = ton("0.1");

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

    fun _setRelayer(newRelayer: Int, currentSignature: Slice, newSignature: Slice) {
        let messageHash: Int = sha256(self.CHANGE_RELAYER_MSG);
        self._validateRelayerSignature(messageHash, currentSignature);
        let isValid: Bool = checkSignature(messageHash, newSignature, newRelayer);
        require(isValid, "SkateMaster::_setRelayer()::Not approved by new relayer!");
        let oldRelayer: Int = self.relayer;
        self.relayer = newRelayer;
        emit(SetRelayerEvent{currentRelayer: oldRelayer, newRelayer: newRelayer}.toCell());
    }

    /////////////////////////////////////////////////////////

    //////////////////// Execution Layer ////////////////////
    receive(msg: SkateInitiateTaskNotification) {
        let ctx: Context = context();
        require(ctx.value > self.MIN_PROCESSING_GAS, "InitiateTask::Not enough processing fee!");
        // TODO: Check if any similar pattern to meta-transaction
        emit(SkateInitiateTaskEvent{
            query_id: msg.query_id,
            app: ctx.sender,
            execution_info: msg.execution_info,
        }.toCell());
    }

    // TODO: how to enforce arbitrary callbacks from SkateApp?
    receive(msg: SkateExecuteTask) {
        self._onlyExecutor();
        send(SendParameters{
            to: msg.target_app,
            value: 0,
            mode: SendRemainingValue, // msg.value - gas fee
            body: msg.execution_payload,
        })
    }

    /////////////////////////////////////////////////////////
    inline fun _onlyExecutor() {
        nativeThrowUnless(132, self._isExecutor(sender()))
    }

    inline fun _validateRelayerSignature(hash: Int /* bytes32 */, signature: Slice) {
        let isValid: Bool = checkSignature(hash, signature, self.relayer);
        require(isValid, "SkateMaster::Invalid Relayer Signature!");
    }
}
