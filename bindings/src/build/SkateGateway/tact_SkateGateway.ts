import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwner(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwner(source: ChangeOwner) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function loadTupleChangeOwnerOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type Destination = {
    $$type: 'Destination';
    chain_id: bigint;
    chain_type: bigint;
    address: bigint;
}

export function storeDestination(src: Destination) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.chain_id, 256);
        b_0.storeUint(src.chain_type, 256);
        b_0.storeUint(src.address, 256);
    };
}

export function loadDestination(slice: Slice) {
    let sc_0 = slice;
    let _chain_id = sc_0.loadUintBig(256);
    let _chain_type = sc_0.loadUintBig(256);
    let _address = sc_0.loadUintBig(256);
    return { $$type: 'Destination' as const, chain_id: _chain_id, chain_type: _chain_type, address: _address };
}

function loadTupleDestination(source: TupleReader) {
    let _chain_id = source.readBigNumber();
    let _chain_type = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'Destination' as const, chain_id: _chain_id, chain_type: _chain_type, address: _address };
}

function storeTupleDestination(source: Destination) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.chain_id);
    builder.writeNumber(source.chain_type);
    builder.writeNumber(source.address);
    return builder.build();
}

function dictValueParserDestination(): DictionaryValue<Destination> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDestination(src)).endCell());
        },
        parse: (src) => {
            return loadDestination(src.loadRef().beginParse());
        }
    }
}

export type Payload = {
    $$type: 'Payload';
    destination: Cell;
    data: Cell;
}

export function storePayload(src: Payload) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.destination);
        b_0.storeRef(src.data);
    };
}

export function loadPayload(slice: Slice) {
    let sc_0 = slice;
    let _destination = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'Payload' as const, destination: _destination, data: _data };
}

function loadTuplePayload(source: TupleReader) {
    let _destination = source.readCell();
    let _data = source.readCell();
    return { $$type: 'Payload' as const, destination: _destination, data: _data };
}

function storeTuplePayload(source: Payload) {
    let builder = new TupleBuilder();
    builder.writeCell(source.destination);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserPayload(): DictionaryValue<Payload> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePayload(src)).endCell());
        },
        parse: (src) => {
            return loadPayload(src.loadRef().beginParse());
        }
    }
}

export type ExecutionInfo = {
    $$type: 'ExecutionInfo';
    value: bigint;
    expiration: bigint;
    payload: Payload;
}

export function storeExecutionInfo(src: ExecutionInfo) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.value);
        b_0.storeUint(src.expiration, 32);
        b_0.store(storePayload(src.payload));
    };
}

export function loadExecutionInfo(slice: Slice) {
    let sc_0 = slice;
    let _value = sc_0.loadCoins();
    let _expiration = sc_0.loadUintBig(32);
    let _payload = loadPayload(sc_0);
    return { $$type: 'ExecutionInfo' as const, value: _value, expiration: _expiration, payload: _payload };
}

function loadTupleExecutionInfo(source: TupleReader) {
    let _value = source.readBigNumber();
    let _expiration = source.readBigNumber();
    const _payload = loadTuplePayload(source.readTuple());
    return { $$type: 'ExecutionInfo' as const, value: _value, expiration: _expiration, payload: _payload };
}

function storeTupleExecutionInfo(source: ExecutionInfo) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.value);
    builder.writeNumber(source.expiration);
    builder.writeTuple(storeTuplePayload(source.payload));
    return builder.build();
}

function dictValueParserExecutionInfo(): DictionaryValue<ExecutionInfo> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeExecutionInfo(src)).endCell());
        },
        parse: (src) => {
            return loadExecutionInfo(src.loadRef().beginParse());
        }
    }
}

export type SkateInitiateTask = {
    $$type: 'SkateInitiateTask';
    query_id: bigint;
    user: Address;
    processing_fee: bigint;
    execution_info: ExecutionInfo;
}

export function storeSkateInitiateTask(src: SkateInitiateTask) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.user);
        b_0.storeCoins(src.processing_fee);
        b_0.store(storeExecutionInfo(src.execution_info));
    };
}

export function loadSkateInitiateTask(slice: Slice) {
    let sc_0 = slice;
    let _query_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _processing_fee = sc_0.loadCoins();
    let _execution_info = loadExecutionInfo(sc_0);
    return { $$type: 'SkateInitiateTask' as const, query_id: _query_id, user: _user, processing_fee: _processing_fee, execution_info: _execution_info };
}

function loadTupleSkateInitiateTask(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _user = source.readAddress();
    let _processing_fee = source.readBigNumber();
    const _execution_info = loadTupleExecutionInfo(source.readTuple());
    return { $$type: 'SkateInitiateTask' as const, query_id: _query_id, user: _user, processing_fee: _processing_fee, execution_info: _execution_info };
}

function storeTupleSkateInitiateTask(source: SkateInitiateTask) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.user);
    builder.writeNumber(source.processing_fee);
    builder.writeTuple(storeTupleExecutionInfo(source.execution_info));
    return builder.build();
}

function dictValueParserSkateInitiateTask(): DictionaryValue<SkateInitiateTask> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSkateInitiateTask(src)).endCell());
        },
        parse: (src) => {
            return loadSkateInitiateTask(src.loadRef().beginParse());
        }
    }
}

export type SkateInitiateTaskEvent = {
    $$type: 'SkateInitiateTaskEvent';
    query_id: bigint;
    user: Address;
    skate_app: Address;
    execution_info: ExecutionInfo;
}

export function storeSkateInitiateTaskEvent(src: SkateInitiateTaskEvent) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1969273797, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.user);
        b_0.storeAddress(src.skate_app);
        b_0.store(storeExecutionInfo(src.execution_info));
    };
}

export function loadSkateInitiateTaskEvent(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1969273797) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _skate_app = sc_0.loadAddress();
    let _execution_info = loadExecutionInfo(sc_0);
    return { $$type: 'SkateInitiateTaskEvent' as const, query_id: _query_id, user: _user, skate_app: _skate_app, execution_info: _execution_info };
}

function loadTupleSkateInitiateTaskEvent(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _user = source.readAddress();
    let _skate_app = source.readAddress();
    const _execution_info = loadTupleExecutionInfo(source.readTuple());
    return { $$type: 'SkateInitiateTaskEvent' as const, query_id: _query_id, user: _user, skate_app: _skate_app, execution_info: _execution_info };
}

function storeTupleSkateInitiateTaskEvent(source: SkateInitiateTaskEvent) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.user);
    builder.writeAddress(source.skate_app);
    builder.writeTuple(storeTupleExecutionInfo(source.execution_info));
    return builder.build();
}

function dictValueParserSkateInitiateTaskEvent(): DictionaryValue<SkateInitiateTaskEvent> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSkateInitiateTaskEvent(src)).endCell());
        },
        parse: (src) => {
            return loadSkateInitiateTaskEvent(src.loadRef().beginParse());
        }
    }
}

export type SkateInitiateTaskNotification = {
    $$type: 'SkateInitiateTaskNotification';
    query_id: bigint;
    user: Address;
    execution_info: ExecutionInfo;
}

export function storeSkateInitiateTaskNotification(src: SkateInitiateTaskNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(960016369, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.user);
        b_0.store(storeExecutionInfo(src.execution_info));
    };
}

export function loadSkateInitiateTaskNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 960016369) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _execution_info = loadExecutionInfo(sc_0);
    return { $$type: 'SkateInitiateTaskNotification' as const, query_id: _query_id, user: _user, execution_info: _execution_info };
}

function loadTupleSkateInitiateTaskNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _user = source.readAddress();
    const _execution_info = loadTupleExecutionInfo(source.readTuple());
    return { $$type: 'SkateInitiateTaskNotification' as const, query_id: _query_id, user: _user, execution_info: _execution_info };
}

function storeTupleSkateInitiateTaskNotification(source: SkateInitiateTaskNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.user);
    builder.writeTuple(storeTupleExecutionInfo(source.execution_info));
    return builder.build();
}

function dictValueParserSkateInitiateTaskNotification(): DictionaryValue<SkateInitiateTaskNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSkateInitiateTaskNotification(src)).endCell());
        },
        parse: (src) => {
            return loadSkateInitiateTaskNotification(src.loadRef().beginParse());
        }
    }
}

export type SkateExecuteTask = {
    $$type: 'SkateExecuteTask';
    query_id: bigint;
    target_app: Address;
    execution_info: ExecutionInfo;
    relayer_signature: Cell;
}

export function storeSkateExecuteTask(src: SkateExecuteTask) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3832306660, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.target_app);
        b_0.store(storeExecutionInfo(src.execution_info));
        b_0.storeRef(src.relayer_signature);
    };
}

export function loadSkateExecuteTask(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3832306660) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _target_app = sc_0.loadAddress();
    let _execution_info = loadExecutionInfo(sc_0);
    let _relayer_signature = sc_0.loadRef();
    return { $$type: 'SkateExecuteTask' as const, query_id: _query_id, target_app: _target_app, execution_info: _execution_info, relayer_signature: _relayer_signature };
}

function loadTupleSkateExecuteTask(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _target_app = source.readAddress();
    const _execution_info = loadTupleExecutionInfo(source.readTuple());
    let _relayer_signature = source.readCell();
    return { $$type: 'SkateExecuteTask' as const, query_id: _query_id, target_app: _target_app, execution_info: _execution_info, relayer_signature: _relayer_signature };
}

function storeTupleSkateExecuteTask(source: SkateExecuteTask) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.target_app);
    builder.writeTuple(storeTupleExecutionInfo(source.execution_info));
    builder.writeSlice(source.relayer_signature);
    return builder.build();
}

function dictValueParserSkateExecuteTask(): DictionaryValue<SkateExecuteTask> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSkateExecuteTask(src)).endCell());
        },
        parse: (src) => {
            return loadSkateExecuteTask(src.loadRef().beginParse());
        }
    }
}

export type ChangeRelayer = {
    $$type: 'ChangeRelayer';
    newRelayer: bigint;
    currentSignature: Cell;
    newSignature: Cell;
}

export function storeChangeRelayer(src: ChangeRelayer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3991949411, 32);
        b_0.storeInt(src.newRelayer, 257);
        b_0.storeRef(src.currentSignature);
        b_0.storeRef(src.newSignature);
    };
}

export function loadChangeRelayer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3991949411) { throw Error('Invalid prefix'); }
    let _newRelayer = sc_0.loadIntBig(257);
    let _currentSignature = sc_0.loadRef();
    let _newSignature = sc_0.loadRef();
    return { $$type: 'ChangeRelayer' as const, newRelayer: _newRelayer, currentSignature: _currentSignature, newSignature: _newSignature };
}

function loadTupleChangeRelayer(source: TupleReader) {
    let _newRelayer = source.readBigNumber();
    let _currentSignature = source.readCell();
    let _newSignature = source.readCell();
    return { $$type: 'ChangeRelayer' as const, newRelayer: _newRelayer, currentSignature: _currentSignature, newSignature: _newSignature };
}

function storeTupleChangeRelayer(source: ChangeRelayer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.newRelayer);
    builder.writeSlice(source.currentSignature);
    builder.writeSlice(source.newSignature);
    return builder.build();
}

function dictValueParserChangeRelayer(): DictionaryValue<ChangeRelayer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeRelayer(src)).endCell());
        },
        parse: (src) => {
            return loadChangeRelayer(src.loadRef().beginParse());
        }
    }
}

export type SetExecutor = {
    $$type: 'SetExecutor';
    executor: Address;
}

export function storeSetExecutor(src: SetExecutor) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3368193837, 32);
        b_0.storeAddress(src.executor);
    };
}

export function loadSetExecutor(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3368193837) { throw Error('Invalid prefix'); }
    let _executor = sc_0.loadAddress();
    return { $$type: 'SetExecutor' as const, executor: _executor };
}

function loadTupleSetExecutor(source: TupleReader) {
    let _executor = source.readAddress();
    return { $$type: 'SetExecutor' as const, executor: _executor };
}

function storeTupleSetExecutor(source: SetExecutor) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.executor);
    return builder.build();
}

function dictValueParserSetExecutor(): DictionaryValue<SetExecutor> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetExecutor(src)).endCell());
        },
        parse: (src) => {
            return loadSetExecutor(src.loadRef().beginParse());
        }
    }
}

export type RevokeExecutor = {
    $$type: 'RevokeExecutor';
    executor: Address;
}

export function storeRevokeExecutor(src: RevokeExecutor) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1193027593, 32);
        b_0.storeAddress(src.executor);
    };
}

export function loadRevokeExecutor(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1193027593) { throw Error('Invalid prefix'); }
    let _executor = sc_0.loadAddress();
    return { $$type: 'RevokeExecutor' as const, executor: _executor };
}

function loadTupleRevokeExecutor(source: TupleReader) {
    let _executor = source.readAddress();
    return { $$type: 'RevokeExecutor' as const, executor: _executor };
}

function storeTupleRevokeExecutor(source: RevokeExecutor) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.executor);
    return builder.build();
}

function dictValueParserRevokeExecutor(): DictionaryValue<RevokeExecutor> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRevokeExecutor(src)).endCell());
        },
        parse: (src) => {
            return loadRevokeExecutor(src.loadRef().beginParse());
        }
    }
}

export type TopUpTON = {
    $$type: 'TopUpTON';
}

export function storeTopUpTON(src: TopUpTON) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1973872876, 32);
    };
}

export function loadTopUpTON(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1973872876) { throw Error('Invalid prefix'); }
    return { $$type: 'TopUpTON' as const };
}

function loadTupleTopUpTON(source: TupleReader) {
    return { $$type: 'TopUpTON' as const };
}

function storeTupleTopUpTON(source: TopUpTON) {
    let builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserTopUpTON(): DictionaryValue<TopUpTON> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTopUpTON(src)).endCell());
        },
        parse: (src) => {
            return loadTopUpTON(src.loadRef().beginParse());
        }
    }
}

export type WithdrawTON = {
    $$type: 'WithdrawTON';
}

export function storeWithdrawTON(src: WithdrawTON) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1149271657, 32);
    };
}

export function loadWithdrawTON(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1149271657) { throw Error('Invalid prefix'); }
    return { $$type: 'WithdrawTON' as const };
}

function loadTupleWithdrawTON(source: TupleReader) {
    return { $$type: 'WithdrawTON' as const };
}

function storeTupleWithdrawTON(source: WithdrawTON) {
    let builder = new TupleBuilder();
    return builder.build();
}

function dictValueParserWithdrawTON(): DictionaryValue<WithdrawTON> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWithdrawTON(src)).endCell());
        },
        parse: (src) => {
            return loadWithdrawTON(src.loadRef().beginParse());
        }
    }
}

 type SkateGateway_init_args = {
    $$type: 'SkateGateway_init_args';
    owner: Address;
    relayer: bigint;
    signature: Cell;
}

function initSkateGateway_init_args(src: SkateGateway_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.relayer, 257);
        b_0.storeRef(src.signature);
    };
}

async function SkateGateway_init(owner: Address, relayer: bigint, signature: Cell) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initSkateGateway_init_args({ $$type: 'SkateGateway_init_args', owner, relayer, signature })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const SkateGateway_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    6808: { message: `SkateGateway::SkateInitiateTaskNotification::Not enough processing fee!` },
    10580: { message: `SkateGateway::validate_relayer_signature()::Invalid relayer signature!` },
    12859: { message: `SkateGateway::SkateExecuteTask::Not enough processing fee!` },
    34923: { message: `SkateGateway::SkateExecuteTask::Execution value is less than the minimum requirement!` },
    45396: { message: `SkateGateway::SkateExecuteTask::Task expired!` },
    48599: { message: `SkateGateway::set_relayer()::Not approved by new relayer!` },
}

const SkateGateway_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Destination","header":null,"fields":[{"name":"chain_id","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"chain_type","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"Payload","header":null,"fields":[{"name":"destination","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ExecutionInfo","header":null,"fields":[{"name":"value","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"expiration","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"payload","type":{"kind":"simple","type":"Payload","optional":false}}]},
    {"name":"SkateInitiateTask","header":null,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"processing_fee","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"execution_info","type":{"kind":"simple","type":"ExecutionInfo","optional":false}}]},
    {"name":"SkateInitiateTaskEvent","header":1969273797,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"skate_app","type":{"kind":"simple","type":"address","optional":false}},{"name":"execution_info","type":{"kind":"simple","type":"ExecutionInfo","optional":false}}]},
    {"name":"SkateInitiateTaskNotification","header":960016369,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"execution_info","type":{"kind":"simple","type":"ExecutionInfo","optional":false}}]},
    {"name":"SkateExecuteTask","header":3832306660,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"target_app","type":{"kind":"simple","type":"address","optional":false}},{"name":"execution_info","type":{"kind":"simple","type":"ExecutionInfo","optional":false}},{"name":"relayer_signature","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"ChangeRelayer","header":3991949411,"fields":[{"name":"newRelayer","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"currentSignature","type":{"kind":"simple","type":"slice","optional":false}},{"name":"newSignature","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SetExecutor","header":3368193837,"fields":[{"name":"executor","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RevokeExecutor","header":1193027593,"fields":[{"name":"executor","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TopUpTON","header":1973872876,"fields":[]},
    {"name":"WithdrawTON","header":1149271657,"fields":[]},
]

const SkateGateway_getters: ABIGetter[] = [
    {"name":"currentNonce","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"creationMsg","arguments":[],"returnType":{"kind":"simple","type":"string","optional":false}},
    {"name":"relayer","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"isExecutor","arguments":[{"name":"addr","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"executors","arguments":[],"returnType":{"kind":"dict","key":"address","value":"bool"}},
    {"name":"changeRelayerMsg","arguments":[],"returnType":{"kind":"simple","type":"string","optional":false}},
    {"name":"payload_hash","arguments":[{"name":"query_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"target","type":{"kind":"simple","type":"address","optional":false}},{"name":"payload","type":{"kind":"simple","type":"Payload","optional":false}},{"name":"expiration","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"owner","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

const SkateGateway_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"TopUpTON"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WithdrawTON"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetExecutor"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RevokeExecutor"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ChangeRelayer"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SkateInitiateTaskNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SkateExecuteTask"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ChangeOwner"}},
]

export class SkateGateway implements Contract {
    
    static async init(owner: Address, relayer: bigint, signature: Cell) {
        return await SkateGateway_init(owner, relayer, signature);
    }
    
    static async fromInit(owner: Address, relayer: bigint, signature: Cell) {
        const init = await SkateGateway_init(owner, relayer, signature);
        const address = contractAddress(0, init);
        return new SkateGateway(address, init);
    }
    
    static fromAddress(address: Address) {
        return new SkateGateway(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  SkateGateway_types,
        getters: SkateGateway_getters,
        receivers: SkateGateway_receivers,
        errors: SkateGateway_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: TopUpTON | WithdrawTON | SetExecutor | RevokeExecutor | ChangeRelayer | SkateInitiateTaskNotification | SkateExecuteTask | Deploy | ChangeOwner) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TopUpTON') {
            body = beginCell().store(storeTopUpTON(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawTON') {
            body = beginCell().store(storeWithdrawTON(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetExecutor') {
            body = beginCell().store(storeSetExecutor(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RevokeExecutor') {
            body = beginCell().store(storeRevokeExecutor(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ChangeRelayer') {
            body = beginCell().store(storeChangeRelayer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SkateInitiateTaskNotification') {
            body = beginCell().store(storeSkateInitiateTaskNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SkateExecuteTask') {
            body = beginCell().store(storeSkateExecuteTask(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ChangeOwner') {
            body = beginCell().store(storeChangeOwner(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getCurrentNonce(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('currentNonce', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getCreationMsg(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('creationMsg', builder.build())).stack;
        let result = source.readString();
        return result;
    }
    
    async getRelayer(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('relayer', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getIsExecutor(provider: ContractProvider, addr: Address) {
        let builder = new TupleBuilder();
        builder.writeAddress(addr);
        let source = (await provider.get('isExecutor', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    
    async getExecutors(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('executors', builder.build())).stack;
        let result = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Bool(), source.readCellOpt());
        return result;
    }
    
    async getChangeRelayerMsg(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('changeRelayerMsg', builder.build())).stack;
        let result = source.readString();
        return result;
    }
    
    async getPayloadHash(provider: ContractProvider, query_id: bigint, target: Address, payload: Payload, expiration: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(query_id);
        builder.writeAddress(target);
        builder.writeTuple(storeTuplePayload(payload));
        builder.writeNumber(expiration);
        let source = (await provider.get('payload_hash', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
}