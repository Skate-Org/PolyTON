import "./SkateICCI.tact";

message SkateExecutionRequest {
    query_id: Int;
    query_payload: ExecutionInfo;
    relayer_signature: Slice;
}

message SkateExecution {
    query_id: Int;
    query_payload: ExecutionInfo;
    relayer_signature: Slice;
}

trait SkateWallet {
    skate_master: Address;

    virtual inline fun calculate_skate_wallet_init(): StateInit;

    receive(msg: SkateExecutionRequest) {

    }

    receive(msg: SkateExecution) {

    }

    virtual inline fun _validate_execution_request(ctx: Context, msg: SkateExecutionRequest) {

    }

    abstract inline fun _execute_tasks(ctx: Context, msg: SkateExecutionRequest) {
        // NOTE: App specific logic here.
    }

}
