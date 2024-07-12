/// Skate Inter Contract Communication Interfaces (ICCI)

struct ExecutionInfo {
    opcode: Int; // msg opcode of the periphery contract
    execution_payload: Slice; // execution payload, i.e. struct type of input msg
    destination: Address; // destination of the periphery contract
}

// Must be called by executor
struct ExecutionRequest {
    query_id: Int;
    query_payload: ExecutionInfo;
    relayer_signature: Slice;
    // opcode: Int;
    // destionation: Address;
    // msg_execution_payload: Slice;
}
