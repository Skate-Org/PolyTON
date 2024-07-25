import { Cell, Slice, Address, Builder, ContractProvider, Sender, Contract, ContractABI } from '@ton/core';
export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
};
export declare function storeStateInit(src: StateInit): (builder: Builder) => void;
export declare function loadStateInit(slice: Slice): {
    $$type: "StateInit";
    code: Cell;
    data: Cell;
};
export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
};
export declare function storeContext(src: Context): (builder: Builder) => void;
export declare function loadContext(slice: Slice): {
    $$type: "Context";
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
};
export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
};
export declare function storeSendParameters(src: SendParameters): (builder: Builder) => void;
export declare function loadSendParameters(slice: Slice): {
    $$type: "SendParameters";
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
};
export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
};
export declare function storeDeploy(src: Deploy): (builder: Builder) => void;
export declare function loadDeploy(slice: Slice): {
    $$type: "Deploy";
    queryId: bigint;
};
export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
};
export declare function storeDeployOk(src: DeployOk): (builder: Builder) => void;
export declare function loadDeployOk(slice: Slice): {
    $$type: "DeployOk";
    queryId: bigint;
};
export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
};
export declare function storeFactoryDeploy(src: FactoryDeploy): (builder: Builder) => void;
export declare function loadFactoryDeploy(slice: Slice): {
    $$type: "FactoryDeploy";
    queryId: bigint;
    cashback: Address;
};
export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
};
export declare function storeChangeOwner(src: ChangeOwner): (builder: Builder) => void;
export declare function loadChangeOwner(slice: Slice): {
    $$type: "ChangeOwner";
    queryId: bigint;
    newOwner: Address;
};
export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
};
export declare function storeChangeOwnerOk(src: ChangeOwnerOk): (builder: Builder) => void;
export declare function loadChangeOwnerOk(slice: Slice): {
    $$type: "ChangeOwnerOk";
    queryId: bigint;
    newOwner: Address;
};
export type JettonTransfer = {
    $$type: 'JettonTransfer';
    query_id: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
};
export declare function storeJettonTransfer(src: JettonTransfer): (builder: Builder) => void;
export declare function loadJettonTransfer(slice: Slice): {
    $$type: "JettonTransfer";
    query_id: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
};
export type JettonTransferNotification = {
    $$type: 'JettonTransferNotification';
    query_id: bigint;
    amount: bigint;
    sender: Address;
    forward_payload: Cell;
};
export declare function storeJettonTransferNotification(src: JettonTransferNotification): (builder: Builder) => void;
export declare function loadJettonTransferNotification(slice: Slice): {
    $$type: "JettonTransferNotification";
    query_id: bigint;
    amount: bigint;
    sender: Address;
    forward_payload: Cell;
};
export type JettonBurn = {
    $$type: 'JettonBurn';
    query_id: bigint;
    amount: bigint;
    response_destination: Address;
    custom_payload: Cell | null;
};
export declare function storeJettonBurn(src: JettonBurn): (builder: Builder) => void;
export declare function loadJettonBurn(slice: Slice): {
    $$type: "JettonBurn";
    query_id: bigint;
    amount: bigint;
    response_destination: Address;
    custom_payload: Cell | null;
};
export type JettonExcesses = {
    $$type: 'JettonExcesses';
    query_id: bigint;
};
export declare function storeJettonExcesses(src: JettonExcesses): (builder: Builder) => void;
export declare function loadJettonExcesses(slice: Slice): {
    $$type: "JettonExcesses";
    query_id: bigint;
};
export type JettonInternalTransfer = {
    $$type: 'JettonInternalTransfer';
    query_id: bigint;
    amount: bigint;
    from: Address;
    response_address: Address | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
};
export declare function storeJettonInternalTransfer(src: JettonInternalTransfer): (builder: Builder) => void;
export declare function loadJettonInternalTransfer(slice: Slice): {
    $$type: "JettonInternalTransfer";
    query_id: bigint;
    amount: bigint;
    from: Address;
    response_address: Address | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
};
export type JettonBurnNotification = {
    $$type: 'JettonBurnNotification';
    query_id: bigint;
    amount: bigint;
    sender: Address;
    response_destination: Address;
};
export declare function storeJettonBurnNotification(src: JettonBurnNotification): (builder: Builder) => void;
export declare function loadJettonBurnNotification(slice: Slice): {
    $$type: "JettonBurnNotification";
    query_id: bigint;
    amount: bigint;
    sender: Address;
    response_destination: Address;
};
export type WalletData = {
    $$type: 'WalletData';
    balance: bigint;
    owner: Address;
    jetton: Address;
    jetton_wallet_code: Cell;
};
export declare function storeWalletData(src: WalletData): (builder: Builder) => void;
export declare function loadWalletData(slice: Slice): {
    $$type: "WalletData";
    balance: bigint;
    owner: Address;
    jetton: Address;
    jetton_wallet_code: Cell;
};
export type Destination = {
    $$type: 'Destination';
    chain_id: bigint;
    chain_type: bigint;
    address: bigint;
};
export declare function storeDestination(src: Destination): (builder: Builder) => void;
export declare function loadDestination(slice: Slice): {
    $$type: "Destination";
    chain_id: bigint;
    chain_type: bigint;
    address: bigint;
};
export type Payload = {
    $$type: 'Payload';
    destination: Cell;
    data: Cell;
};
export declare function storePayload(src: Payload): (builder: Builder) => void;
export declare function loadPayload(slice: Slice): {
    $$type: "Payload";
    destination: Cell;
    data: Cell;
};
export type ExecutionInfo = {
    $$type: 'ExecutionInfo';
    value: bigint;
    expiration: bigint;
    payload: Payload;
};
export declare function storeExecutionInfo(src: ExecutionInfo): (builder: Builder) => void;
export declare function loadExecutionInfo(slice: Slice): {
    $$type: "ExecutionInfo";
    value: bigint;
    expiration: bigint;
    payload: {
        $$type: "Payload";
        destination: Cell;
        data: Cell;
    };
};
export type SkateInitiateTask = {
    $$type: 'SkateInitiateTask';
    query_id: bigint;
    user: Address;
    processing_fee: bigint;
    execution_info: ExecutionInfo;
};
export declare function storeSkateInitiateTask(src: SkateInitiateTask): (builder: Builder) => void;
export declare function loadSkateInitiateTask(slice: Slice): {
    $$type: "SkateInitiateTask";
    query_id: bigint;
    user: Address;
    processing_fee: bigint;
    execution_info: {
        $$type: "ExecutionInfo";
        value: bigint;
        expiration: bigint;
        payload: {
            $$type: "Payload";
            destination: Cell;
            data: Cell;
        };
    };
};
export type SkateInitiateTaskEvent = {
    $$type: 'SkateInitiateTaskEvent';
    query_id: bigint;
    user: Address;
    skate_app: Address;
    execution_info: ExecutionInfo;
};
export declare function storeSkateInitiateTaskEvent(src: SkateInitiateTaskEvent): (builder: Builder) => void;
export declare function loadSkateInitiateTaskEvent(slice: Slice): {
    $$type: "SkateInitiateTaskEvent";
    query_id: bigint;
    user: Address;
    skate_app: Address;
    execution_info: {
        $$type: "ExecutionInfo";
        value: bigint;
        expiration: bigint;
        payload: {
            $$type: "Payload";
            destination: Cell;
            data: Cell;
        };
    };
};
export type SkateInitiateTaskNotification = {
    $$type: 'SkateInitiateTaskNotification';
    query_id: bigint;
    user: Address;
    execution_info: ExecutionInfo;
};
export declare function storeSkateInitiateTaskNotification(src: SkateInitiateTaskNotification): (builder: Builder) => void;
export declare function loadSkateInitiateTaskNotification(slice: Slice): {
    $$type: "SkateInitiateTaskNotification";
    query_id: bigint;
    user: Address;
    execution_info: {
        $$type: "ExecutionInfo";
        value: bigint;
        expiration: bigint;
        payload: {
            $$type: "Payload";
            destination: Cell;
            data: Cell;
        };
    };
};
export type SkateExecuteTask = {
    $$type: 'SkateExecuteTask';
    query_id: bigint;
    target_app: Address;
    execution_info: ExecutionInfo;
    relayer_signature: Cell;
};
export declare function storeSkateExecuteTask(src: SkateExecuteTask): (builder: Builder) => void;
export declare function loadSkateExecuteTask(slice: Slice): {
    $$type: "SkateExecuteTask";
    query_id: bigint;
    target_app: Address;
    execution_info: {
        $$type: "ExecutionInfo";
        value: bigint;
        expiration: bigint;
        payload: {
            $$type: "Payload";
            destination: Cell;
            data: Cell;
        };
    };
    relayer_signature: Cell;
};
export type Bet = {
    $$type: 'Bet';
    candidate_id: bigint;
    direction: boolean;
    usd_amount: bigint;
};
export declare function storeBet(src: Bet): (builder: Builder) => void;
export declare function loadBet(slice: Slice): {
    $$type: "Bet";
    candidate_id: bigint;
    direction: boolean;
    usd_amount: bigint;
};
export type BetConfig = {
    $$type: 'BetConfig';
    candidate_id: bigint;
    direction: boolean;
};
export declare function storeBetConfig(src: BetConfig): (builder: Builder) => void;
export declare function loadBetConfig(slice: Slice): {
    $$type: "BetConfig";
    candidate_id: bigint;
    direction: boolean;
};
export type SettleBet = {
    $$type: 'SettleBet';
    settle_id: bigint;
    user: Address;
    fee_receiver: Address;
    usd_amount: bigint;
};
export declare function storeSettleBet(src: SettleBet): (builder: Builder) => void;
export declare function loadSettleBet(slice: Slice): {
    $$type: "SettleBet";
    settle_id: bigint;
    user: Address;
    fee_receiver: Address;
    usd_amount: bigint;
};
export type RequestSettleBet = {
    $$type: 'RequestSettleBet';
    candidate_id: bigint;
    direction: boolean;
    ct_amount: bigint;
};
export declare function storeRequestSettleBet(src: RequestSettleBet): (builder: Builder) => void;
export declare function loadRequestSettleBet(slice: Slice): {
    $$type: "RequestSettleBet";
    candidate_id: bigint;
    direction: boolean;
    ct_amount: bigint;
};
export type SetJettonWallet = {
    $$type: 'SetJettonWallet';
    jetton_wallet: Address;
};
export declare function storeSetJettonWallet(src: SetJettonWallet): (builder: Builder) => void;
export declare function loadSetJettonWallet(slice: Slice): {
    $$type: "SetJettonWallet";
    jetton_wallet: Address;
};
export declare class PolyMarket implements Contract {
    static init(owner: Address, skate_gateway: Address): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(owner: Address, skate_gateway: Address): Promise<PolyMarket>;
    static fromAddress(address: Address): PolyMarket;
    readonly address: Address;
    readonly init?: {
        code: Cell;
        data: Cell;
    };
    readonly abi: ContractABI;
    private constructor();
    send(provider: ContractProvider, via: Sender, args: {
        value: bigint;
        bounce?: boolean | null | undefined;
    }, message: SetJettonWallet | JettonTransferNotification | RequestSettleBet | SettleBet | Deploy): Promise<void>;
    getInitiateCount(provider: ContractProvider): Promise<bigint>;
    getSettleCount(provider: ContractProvider): Promise<bigint>;
    getGateway(provider: ContractProvider): Promise<Address>;
    getOwner(provider: ContractProvider): Promise<Address>;
}
