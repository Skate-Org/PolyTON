import { Cell, Slice, Address, Builder, Dictionary, ContractProvider, Sender, Contract, ContractABI } from '@ton/core';
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
export type ChangeRelayer = {
    $$type: 'ChangeRelayer';
    newRelayer: bigint;
    currentSignature: Cell;
    newSignature: Cell;
};
export declare function storeChangeRelayer(src: ChangeRelayer): (builder: Builder) => void;
export declare function loadChangeRelayer(slice: Slice): {
    $$type: "ChangeRelayer";
    newRelayer: bigint;
    currentSignature: Cell;
    newSignature: Cell;
};
export type SetExecutor = {
    $$type: 'SetExecutor';
    executor: Address;
};
export declare function storeSetExecutor(src: SetExecutor): (builder: Builder) => void;
export declare function loadSetExecutor(slice: Slice): {
    $$type: "SetExecutor";
    executor: Address;
};
export type RevokeExecutor = {
    $$type: 'RevokeExecutor';
    executor: Address;
};
export declare function storeRevokeExecutor(src: RevokeExecutor): (builder: Builder) => void;
export declare function loadRevokeExecutor(slice: Slice): {
    $$type: "RevokeExecutor";
    executor: Address;
};
export declare class SkateGateway implements Contract {
    static init(owner: Address, relayer: bigint): Promise<{
        code: Cell;
        data: Cell;
    }>;
    static fromInit(owner: Address, relayer: bigint): Promise<SkateGateway>;
    static fromAddress(address: Address): SkateGateway;
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
    }, message: SetExecutor | RevokeExecutor | ChangeRelayer | SkateInitiateTaskNotification | SkateExecuteTask | Deploy | ChangeOwner): Promise<void>;
    getCurrentNonce(provider: ContractProvider): Promise<bigint>;
    getRelayer(provider: ContractProvider): Promise<bigint>;
    getIsExecutor(provider: ContractProvider, addr: Address): Promise<boolean>;
    getExecutors(provider: ContractProvider): Promise<Dictionary<Address, boolean>>;
    getChangeRelayerMsg(provider: ContractProvider): Promise<string>;
    getPayloadHash(provider: ContractProvider, payload: Payload): Promise<bigint>;
    getOwner(provider: ContractProvider): Promise<Address>;
}
