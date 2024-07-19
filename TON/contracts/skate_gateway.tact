import "@stdlib/deploy";
import "@stdlib/ownable";
import "./traits/skate/SkateGateway.tact";

message ChangeRelayer {
    newRelayer: Int;
    currentSignature: Slice;
    newSignature: Slice;
}

message SetRelayerEvent {
    relayer: Int;
}

contract SkateGateway with Deployable, SkateGatewayBase {
    owner: Address;
    relayer: Int; // Relayer is an ED25519 public key
    executors: map<Address, Bool>;
    nonce: Int = 0;

    const CHANGE_RELAYER_MSG: String = "Skate::RELAYER_CHANGE";

    get fun changeRelayerMsg(): String {
        return self.CHANGE_RELAYER_MSG;
    }

    init(owner: Address, relayer: Int) {
        self.owner = owner;
        self.relayer = relayer;
        self.executors = emptyMap();
        emit(SetRelayerEvent{relayer: relayer}.toCell());
    }

    receive(msg: ChangeRelayer) {
        self.requireOwner();
        self.set_relayer(msg.newRelayer, msg.currentSignature, msg.newSignature);
    }

    fun set_relayer(newRelayer: Int, currentSignature: Slice, newSignature: Slice) {
        let messageHash: Int = sha256(self.CHANGE_RELAYER_MSG);
        self.validate_relayer_signature(messageHash, currentSignature);
        let isValid: Bool = checkSignature(messageHash, newSignature, newRelayer);
        require(isValid, "SkateMaster::set_relayer()::Not approved by new relayer!");
        self.relayer = newRelayer;
        emit(SetRelayerEvent{relayer: newRelayer}.toCell());
    }
}
