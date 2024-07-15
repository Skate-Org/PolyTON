import "./SkateICCI.tact";

trait SkateApp {
    skate_gateway: Address;

    // 1. User initiated actions (e.g. deposit USDT)
    // => Initiate a task event registered on Skate Master.
    receive(msg: SkateInitiateTask) {
        let ctx: Context = context();
        let payload: ExecutionInfo = msg.execution_info;
        send(SendParameters{
            to: self.skate_gateway,
            value: msg.processing_fee,
            mode: SendPayGasSeparately, // App pay gas, not Skate
            body: SkateInitiateTaskNotification {
                query_id: msg.query_id,
                execution_info: msg.execution_info
            }.toCell()
        });
    }

    // 3. Only executor can call this, message originates from Skate gateway.
    receive(msg: Slice) {
        self._onlySkateGateway();
        let ctx: Context = context();
        let msg_struct = self._unpackExecutionMsg(msg);
        self._validateExecutionMsg(ctx, msg_struct);
        self._executeTasks(ctx, msg_struct);
    }


    inline fun _onlySkateGateway() {
        nativeThrowUnless(132, sender() == self.skate_gateway);
    }

    abstract inline fun _unpackExecutionMsg(msg: Slice): Cell;

    virtual inline fun _validateExecutionMsg(ctx: Context, msg: Cell) {
        // NOTE: custom logic to validate
    }

    // NOTE: App specific logic to be implemented by contract.
    // This is the entry point to ALL OTHER UNDERLYING FUNCTIONS.
    abstract inline fun _executeTasks(ctx: Context, msg: Cell);

    abstract inline fun calculate_skate_wallet_init(): StateInit;
}
