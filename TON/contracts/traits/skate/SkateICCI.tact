/// Skate Inter Contract Communication Interface (ICCI)
//
// NOTE: DISCUSSION POINT (RESOLVED)
// INTENDED FLOW:
// 1. SkateApp implementations takes request initiation from user.
// 2. SkateApp construct payload and request Skate Gateway.
// 3. Skate Gateway emit Event collected by off-chain actor then:
//    a. Executor processIntent(), i.e. reserve it => emit event
//    b. Skate Kernel process.
//    c. Skate AVS process.
//    d. Executor do their jobs on destination chain, i.e. PolyMarket on Polygon
//    e. Relayer sign the confirmation
// 4. Executor with relayer signature:
//    a. execute on Skate Gateway (which verify)
//    b. Execution dispatch to SkateApp (TON periphery)
// 6. SkateApp performs assets transfer based on verified state (STATELESS)
// 7. Assets released on destination chains

struct Payload {
    chain_id: Int as uint256; // <- the target chain
    chain_type: Int as uint256; // <- Skate chainType convention || 0=EVM, 1=Solana, 2=TON, 3=others.
    app: Int as uint256; // <- universal address (even though TON workchain supports 512 bit address, 
    data: Slice; // <- specific execution data, intepreted by Skate kernel. Developers can write their own intepretation plugins for executor.
}

struct ExecutionInfo {
    value: Int; // nanoTONs value
    payload: Payload; // execution payload, i.e. struct type of input msg
    expiration: Int; // expiration of request
}

// SkateApp
struct SkateInitiateTask {
    query_id: Int as uint64;
    user: Address;
    processing_fee: Int as uint64; // in nanoTONs, set by Skate.
    execution_info: ExecutionInfo;
}

message SkateInitiateTaskEvent {
    query_id: Int as uint64;
    user: Address;
    app: Address;
    execution_info: ExecutionInfo;
}

// For Skate Gateway
message SkateInitiateTaskNotification {
    query_id: Int as uint64;
    user: Address;
    execution_info: ExecutionInfo;
}

