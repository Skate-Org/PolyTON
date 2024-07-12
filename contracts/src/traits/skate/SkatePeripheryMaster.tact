import "./SkateICCI.tact";

message SetExecutor {
    executor: Address;
}

message RevokeExecutor {
    executor: Address;
}

trait SkatePeripheryMaster with OwnableTransferable {
    owner: Address;
    relayer: Int; // Relayer is an ED25519 public key
    executors: map<Address, Bool>;

    get fun relayer(): Int {
        return self.relayer;
    }

    get fun isExecutor(addr: Address): Bool {
        return self._isExecutor(addr);
    }

    fun _isExecutor(addr: Address): Bool {
        let executor: Bool? = self.executors.get(addr);
        return executor != null && executor!!;
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

    fun _validateRelayerSignature(hash: Int /* bytes32 */, signature: Slice) {
        let isValid: Bool = checkSignature(hash, signature, self.relayer);
        require(isValid, "SkateMaster::Invalid Relayer Signature!");
    }

    fun _onlyExecutor() {
        nativeThrowUnless(132, self._isExecutor(sender()))
    }
}
