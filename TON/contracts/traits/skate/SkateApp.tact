import "./SkateICCI.tact";

trait SkateAppBase {
    skate_gateway: Address;

    // 1. User initiated actions (e.g. deposit USDT)
    // => Initiate a task event registered on Skate Master.
    virtual inline fun _notify_gateway(ctx: Context, msg: SkateInitiateTask) {
        let payload: ExecutionInfo = msg.execution_info;
        send(SendParameters{
            to: self.skate_gateway,
            value: msg.processing_fee,
            mode: SendPayGasSeparately, // App pay gas, not Skate
            body: SkateInitiateTaskNotification {
                query_id: msg.query_id,
                user: msg.user,
                execution_info: msg.execution_info
            }.toCell()
        });
    }

    inline fun only_gateway() {
        nativeThrowUnless(132, sender() == self.skate_gateway);
    }

    // NOTE: App specific logic to be implemented by contract.
    // A more UX/DX friendly approach is to let specific app implement its own logic for gateway call with `self.only_gateway()` lock.
    // 
    // WARN: DISCUSSION POINT 1 (TBC)
    // However, Skate cant't check if the destination method actually implement it.
    // Therefore it's the responsibility of RELAYER/AVS to whitelist
    // ONLY IMPLEMENTATIONS WITH only_gateway() MODIFIER CAN BE EXECUTED VIA SKATE EXECUTION NETWORK.
    //
    // 2. Only executor can call this, message originates from Skate gateway.
    // receive(msg: Slice) {
    //     self._onlySkateGateway();
    //     let ctx: Context = context();
    //     let msg_struct = self._unpackExecutionMsg(msg);
    //     self._validateExecutionMsg(ctx, msg_struct);
    //     self._executeTasks(ctx, msg_struct);
    // }
    //
    // abstract inline fun _unpackExecutionMsg(msg: Slice): Cell;
    //
    // virtual inline fun _validateExecutionMsg(ctx: Context, msg: Cell) {
    //     // NOTE: custom logic to validate
    // }
    //
    // abstract inline fun _executeTasks(ctx: Context, msg: Cell);
    //
    // abstract inline fun calculate_skate_wallet_init(): StateInit;
}
