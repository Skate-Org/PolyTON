/// Skate Inter Contract Communication Interfaces (ICCI)
//
// INTENDED FLOW:
// 1. SkateApp implementations takes request initiation from user.
// 2. SkateApp construct payload and request SkateMaster.
// 3. Skate Master emit Event collected by off-chain actor then:
//    a. Executor processIntent(), i.e. reserve it => emit event
//    b. Skate Kernel process.
//    c. Skate AVS process.
//    d. Executor do their jobs on destination chain, i.e. PolyMarket on Polygon
//    e. Relayer sign the confirmation
// 4. Executor with relayer signature execute on SkateMaster (which verify)
// 5. Execution dispatch to SkateApp (TON periphery)
// 6. SkateApp performs assets transfer based on verified state (STATELESS)

// NOTE: contract must be created before send
struct ExecutionInfo {
    value: Int; // nanoTONs value
    payload: Slice; // execution payload, i.e. struct type of input msg
    expiration: Int; // expiration of request
}

// SkateApp
message SkateInitiateTask {
    query_id: Int as uint64;
    processing_fee: Int as uint64; // in nanoTONs, set by Skate. default to 0 now
    execution_info: ExecutionInfo;
}

message SkateInitiateTaskEvent {
    query_id: Int as uint64;
    app: Address;
    execution_info: ExecutionInfo;
}

// Skate Master
message SkateInitiateTaskNotification {
    query_id: Int as uint64;
    execution_info: ExecutionInfo;
}

message SkateInitiateTaskConfirmation {
    query_id: Int as uint64;
}
