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

export type JettonTransfer = {
    $$type: 'JettonTransfer';
    query_id: bigint;
    amount: bigint;
    destination: Address;
    response_destination: Address;
    custom_payload: Cell | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
}

export function storeJettonTransfer(src: JettonTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadJettonTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'JettonTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleJettonTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'JettonTransfer' as const, query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleJettonTransfer(source: JettonTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserJettonTransfer(): DictionaryValue<JettonTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransfer(src.loadRef().beginParse());
        }
    }
}

export type JettonTransferNotification = {
    $$type: 'JettonTransferNotification';
    query_id: bigint;
    amount: bigint;
    sender: Address;
    forward_payload: Cell;
}

export function storeJettonTransferNotification(src: JettonTransferNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadJettonTransferNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _sender = sc_0.loadAddress();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'JettonTransferNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}

function loadTupleJettonTransferNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _forward_payload = source.readCell();
    return { $$type: 'JettonTransferNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}

function storeTupleJettonTransferNotification(source: JettonTransferNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserJettonTransferNotification(): DictionaryValue<JettonTransferNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransferNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransferNotification(src.loadRef().beginParse());
        }
    }
}

export type JettonBurn = {
    $$type: 'JettonBurn';
    query_id: bigint;
    amount: bigint;
    response_destination: Address;
    custom_payload: Cell | null;
}

export function storeJettonBurn(src: JettonBurn) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
    };
}

export function loadJettonBurn(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499400124) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'JettonBurn' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}

function loadTupleJettonBurn(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    return { $$type: 'JettonBurn' as const, query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}

function storeTupleJettonBurn(source: JettonBurn) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    return builder.build();
}

function dictValueParserJettonBurn(): DictionaryValue<JettonBurn> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonBurn(src)).endCell());
        },
        parse: (src) => {
            return loadJettonBurn(src.loadRef().beginParse());
        }
    }
}

export type JettonExcesses = {
    $$type: 'JettonExcesses';
    query_id: bigint;
}

export function storeJettonExcesses(src: JettonExcesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadJettonExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'JettonExcesses' as const, query_id: _query_id };
}

function loadTupleJettonExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'JettonExcesses' as const, query_id: _query_id };
}

function storeTupleJettonExcesses(source: JettonExcesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserJettonExcesses(): DictionaryValue<JettonExcesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadJettonExcesses(src.loadRef().beginParse());
        }
    }
}

export type JettonInternalTransfer = {
    $$type: 'JettonInternalTransfer';
    query_id: bigint;
    amount: bigint;
    from: Address;
    response_address: Address | null;
    forward_ton_amount: bigint;
    forward_payload: Cell;
}

export function storeJettonInternalTransfer(src: JettonInternalTransfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(395134233, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.from);
        b_0.storeAddress(src.response_address);
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadJettonInternalTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 395134233) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _response_address = sc_0.loadMaybeAddress();
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'JettonInternalTransfer' as const, query_id: _query_id, amount: _amount, from: _from, response_address: _response_address, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function loadTupleJettonInternalTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _response_address = source.readAddressOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'JettonInternalTransfer' as const, query_id: _query_id, amount: _amount, from: _from, response_address: _response_address, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}

function storeTupleJettonInternalTransfer(source: JettonInternalTransfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.response_address);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}

function dictValueParserJettonInternalTransfer(): DictionaryValue<JettonInternalTransfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonInternalTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonInternalTransfer(src.loadRef().beginParse());
        }
    }
}

export type JettonBurnNotification = {
    $$type: 'JettonBurnNotification';
    query_id: bigint;
    amount: bigint;
    sender: Address;
    response_destination: Address;
}

export function storeJettonBurnNotification(src: JettonBurnNotification) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeAddress(src.response_destination);
    };
}

export function loadJettonBurnNotification(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _sender = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    return { $$type: 'JettonBurnNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, response_destination: _response_destination };
}

function loadTupleJettonBurnNotification(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _response_destination = source.readAddress();
    return { $$type: 'JettonBurnNotification' as const, query_id: _query_id, amount: _amount, sender: _sender, response_destination: _response_destination };
}

function storeTupleJettonBurnNotification(source: JettonBurnNotification) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeAddress(source.response_destination);
    return builder.build();
}

function dictValueParserJettonBurnNotification(): DictionaryValue<JettonBurnNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonBurnNotification(src.loadRef().beginParse());
        }
    }
}

export type WalletData = {
    $$type: 'WalletData';
    balance: bigint;
    owner: Address;
    jetton: Address;
    jetton_wallet_code: Cell;
}

export function storeWalletData(src: WalletData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.jetton);
        b_0.storeRef(src.jetton_wallet_code);
    };
}

export function loadWalletData(slice: Slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _jetton = sc_0.loadAddress();
    let _jetton_wallet_code = sc_0.loadRef();
    return { $$type: 'WalletData' as const, balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}

function loadTupleWalletData(source: TupleReader) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton = source.readAddress();
    let _jetton_wallet_code = source.readCell();
    return { $$type: 'WalletData' as const, balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}

function storeTupleWalletData(source: WalletData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.jetton);
    builder.writeCell(source.jetton_wallet_code);
    return builder.build();
}

function dictValueParserWalletData(): DictionaryValue<WalletData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadWalletData(src.loadRef().beginParse());
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

export type RequestPlaceBet = {
    $$type: 'RequestPlaceBet';
    candidate_id: bigint;
    direction: boolean;
    usd_amount: bigint;
}

export function storeRequestPlaceBet(src: RequestPlaceBet) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(750876413, 32);
        b_0.storeUint(src.candidate_id, 8);
        b_0.storeBit(src.direction);
        b_0.storeCoins(src.usd_amount);
    };
}

export function loadRequestPlaceBet(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 750876413) { throw Error('Invalid prefix'); }
    let _candidate_id = sc_0.loadUintBig(8);
    let _direction = sc_0.loadBit();
    let _usd_amount = sc_0.loadCoins();
    return { $$type: 'RequestPlaceBet' as const, candidate_id: _candidate_id, direction: _direction, usd_amount: _usd_amount };
}

function loadTupleRequestPlaceBet(source: TupleReader) {
    let _candidate_id = source.readBigNumber();
    let _direction = source.readBoolean();
    let _usd_amount = source.readBigNumber();
    return { $$type: 'RequestPlaceBet' as const, candidate_id: _candidate_id, direction: _direction, usd_amount: _usd_amount };
}

function storeTupleRequestPlaceBet(source: RequestPlaceBet) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.candidate_id);
    builder.writeBoolean(source.direction);
    builder.writeNumber(source.usd_amount);
    return builder.build();
}

function dictValueParserRequestPlaceBet(): DictionaryValue<RequestPlaceBet> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRequestPlaceBet(src)).endCell());
        },
        parse: (src) => {
            return loadRequestPlaceBet(src.loadRef().beginParse());
        }
    }
}

export type BetConfig = {
    $$type: 'BetConfig';
    candidate_id: bigint;
    direction: boolean;
}

export function storeBetConfig(src: BetConfig) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.candidate_id, 8);
        b_0.storeBit(src.direction);
    };
}

export function loadBetConfig(slice: Slice) {
    let sc_0 = slice;
    let _candidate_id = sc_0.loadUintBig(8);
    let _direction = sc_0.loadBit();
    return { $$type: 'BetConfig' as const, candidate_id: _candidate_id, direction: _direction };
}

function loadTupleBetConfig(source: TupleReader) {
    let _candidate_id = source.readBigNumber();
    let _direction = source.readBoolean();
    return { $$type: 'BetConfig' as const, candidate_id: _candidate_id, direction: _direction };
}

function storeTupleBetConfig(source: BetConfig) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.candidate_id);
    builder.writeBoolean(source.direction);
    return builder.build();
}

function dictValueParserBetConfig(): DictionaryValue<BetConfig> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBetConfig(src)).endCell());
        },
        parse: (src) => {
            return loadBetConfig(src.loadRef().beginParse());
        }
    }
}

export type SettleBet = {
    $$type: 'SettleBet';
    settle_id: bigint;
    user: Address;
    fee_receiver: Address;
    usd_amount: bigint;
}

export function storeSettleBet(src: SettleBet) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3299040581, 32);
        b_0.storeUint(src.settle_id, 64);
        b_0.storeAddress(src.user);
        b_0.storeAddress(src.fee_receiver);
        b_0.storeCoins(src.usd_amount);
    };
}

export function loadSettleBet(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3299040581) { throw Error('Invalid prefix'); }
    let _settle_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _fee_receiver = sc_0.loadAddress();
    let _usd_amount = sc_0.loadCoins();
    return { $$type: 'SettleBet' as const, settle_id: _settle_id, user: _user, fee_receiver: _fee_receiver, usd_amount: _usd_amount };
}

function loadTupleSettleBet(source: TupleReader) {
    let _settle_id = source.readBigNumber();
    let _user = source.readAddress();
    let _fee_receiver = source.readAddress();
    let _usd_amount = source.readBigNumber();
    return { $$type: 'SettleBet' as const, settle_id: _settle_id, user: _user, fee_receiver: _fee_receiver, usd_amount: _usd_amount };
}

function storeTupleSettleBet(source: SettleBet) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.settle_id);
    builder.writeAddress(source.user);
    builder.writeAddress(source.fee_receiver);
    builder.writeNumber(source.usd_amount);
    return builder.build();
}

function dictValueParserSettleBet(): DictionaryValue<SettleBet> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSettleBet(src)).endCell());
        },
        parse: (src) => {
            return loadSettleBet(src.loadRef().beginParse());
        }
    }
}

export type RequestSettleBet = {
    $$type: 'RequestSettleBet';
    candidate_id: bigint;
    direction: boolean;
    ct_amount: bigint;
}

export function storeRequestSettleBet(src: RequestSettleBet) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2268796018, 32);
        b_0.storeUint(src.candidate_id, 8);
        b_0.storeBit(src.direction);
        b_0.storeCoins(src.ct_amount);
    };
}

export function loadRequestSettleBet(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2268796018) { throw Error('Invalid prefix'); }
    let _candidate_id = sc_0.loadUintBig(8);
    let _direction = sc_0.loadBit();
    let _ct_amount = sc_0.loadCoins();
    return { $$type: 'RequestSettleBet' as const, candidate_id: _candidate_id, direction: _direction, ct_amount: _ct_amount };
}

function loadTupleRequestSettleBet(source: TupleReader) {
    let _candidate_id = source.readBigNumber();
    let _direction = source.readBoolean();
    let _ct_amount = source.readBigNumber();
    return { $$type: 'RequestSettleBet' as const, candidate_id: _candidate_id, direction: _direction, ct_amount: _ct_amount };
}

function storeTupleRequestSettleBet(source: RequestSettleBet) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.candidate_id);
    builder.writeBoolean(source.direction);
    builder.writeNumber(source.ct_amount);
    return builder.build();
}

function dictValueParserRequestSettleBet(): DictionaryValue<RequestSettleBet> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRequestSettleBet(src)).endCell());
        },
        parse: (src) => {
            return loadRequestSettleBet(src.loadRef().beginParse());
        }
    }
}

export type SetJettonWallet = {
    $$type: 'SetJettonWallet';
    jetton_wallet: Address;
}

export function storeSetJettonWallet(src: SetJettonWallet) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1999771523, 32);
        b_0.storeAddress(src.jetton_wallet);
    };
}

export function loadSetJettonWallet(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1999771523) { throw Error('Invalid prefix'); }
    let _jetton_wallet = sc_0.loadAddress();
    return { $$type: 'SetJettonWallet' as const, jetton_wallet: _jetton_wallet };
}

function loadTupleSetJettonWallet(source: TupleReader) {
    let _jetton_wallet = source.readAddress();
    return { $$type: 'SetJettonWallet' as const, jetton_wallet: _jetton_wallet };
}

function storeTupleSetJettonWallet(source: SetJettonWallet) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.jetton_wallet);
    return builder.build();
}

function dictValueParserSetJettonWallet(): DictionaryValue<SetJettonWallet> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetJettonWallet(src)).endCell());
        },
        parse: (src) => {
            return loadSetJettonWallet(src.loadRef().beginParse());
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

 type PolyMarket_init_args = {
    $$type: 'PolyMarket_init_args';
    owner: Address;
    skate_gateway: Address;
}

function initPolyMarket_init_args(src: PolyMarket_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.skate_gateway);
    };
}

async function PolyMarket_init(owner: Address, skate_gateway: Address) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initPolyMarket_init_args({ $$type: 'PolyMarket_init_args', owner, skate_gateway })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const PolyMarket_errors: { [key: number]: { message: string } } = {
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
    2340: { message: `PolyMarket::SetJettonWallet::Wallet is set` },
    2543: { message: `PolyMarket::JettonTransferNotification::Bet size too small!` },
    15264: { message: `PolyMarket::Not enough user fee!` },
    17637: { message: `PolyMarket::JettonTransferNotification::Invalid candidate id!` },
}

const PolyMarket_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonTransfer","header":260734629,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonTransferNotification","header":1935855772,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonBurn","header":1499400124,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"JettonExcesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"JettonInternalTransfer","header":395134233,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"from","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_address","type":{"kind":"simple","type":"address","optional":true}},{"name":"forward_ton_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"JettonBurnNotification","header":2078119902,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"WalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton","type":{"kind":"simple","type":"address","optional":false}},{"name":"jetton_wallet_code","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Destination","header":null,"fields":[{"name":"chain_id","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"chain_type","type":{"kind":"simple","type":"uint","optional":false,"format":256}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"Payload","header":null,"fields":[{"name":"destination","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"ExecutionInfo","header":null,"fields":[{"name":"value","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"expiration","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"payload","type":{"kind":"simple","type":"Payload","optional":false}}]},
    {"name":"SkateInitiateTask","header":null,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"processing_fee","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"execution_info","type":{"kind":"simple","type":"ExecutionInfo","optional":false}}]},
    {"name":"SkateInitiateTaskEvent","header":1969273797,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"skate_app","type":{"kind":"simple","type":"address","optional":false}},{"name":"execution_info","type":{"kind":"simple","type":"ExecutionInfo","optional":false}}]},
    {"name":"SkateInitiateTaskNotification","header":960016369,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"execution_info","type":{"kind":"simple","type":"ExecutionInfo","optional":false}}]},
    {"name":"SkateExecuteTask","header":3832306660,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"target_app","type":{"kind":"simple","type":"address","optional":false}},{"name":"execution_info","type":{"kind":"simple","type":"ExecutionInfo","optional":false}},{"name":"relayer_signature","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"RequestPlaceBet","header":750876413,"fields":[{"name":"candidate_id","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"direction","type":{"kind":"simple","type":"bool","optional":false}},{"name":"usd_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"BetConfig","header":null,"fields":[{"name":"candidate_id","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"direction","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"SettleBet","header":3299040581,"fields":[{"name":"settle_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"user","type":{"kind":"simple","type":"address","optional":false}},{"name":"fee_receiver","type":{"kind":"simple","type":"address","optional":false}},{"name":"usd_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"RequestSettleBet","header":2268796018,"fields":[{"name":"candidate_id","type":{"kind":"simple","type":"uint","optional":false,"format":8}},{"name":"direction","type":{"kind":"simple","type":"bool","optional":false}},{"name":"ct_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"SetJettonWallet","header":1999771523,"fields":[{"name":"jetton_wallet","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"TopUpTON","header":1973872876,"fields":[]},
    {"name":"WithdrawTON","header":1149271657,"fields":[]},
]

const PolyMarket_getters: ABIGetter[] = [
    {"name":"queryId","arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"gateway","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"jettonWallet","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"owner","arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

const PolyMarket_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"TopUpTON"}},
    {"receiver":"internal","message":{"kind":"typed","type":"WithdrawTON"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetJettonWallet"}},
    {"receiver":"internal","message":{"kind":"typed","type":"JettonTransferNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"RequestSettleBet"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SettleBet"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class PolyMarket implements Contract {
    
    static async init(owner: Address, skate_gateway: Address) {
        return await PolyMarket_init(owner, skate_gateway);
    }
    
    static async fromInit(owner: Address, skate_gateway: Address) {
        const init = await PolyMarket_init(owner, skate_gateway);
        const address = contractAddress(0, init);
        return new PolyMarket(address, init);
    }
    
    static fromAddress(address: Address) {
        return new PolyMarket(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  PolyMarket_types,
        getters: PolyMarket_getters,
        receivers: PolyMarket_receivers,
        errors: PolyMarket_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: TopUpTON | WithdrawTON | SetJettonWallet | JettonTransferNotification | RequestSettleBet | SettleBet | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'TopUpTON') {
            body = beginCell().store(storeTopUpTON(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'WithdrawTON') {
            body = beginCell().store(storeWithdrawTON(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetJettonWallet') {
            body = beginCell().store(storeSetJettonWallet(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JettonTransferNotification') {
            body = beginCell().store(storeJettonTransferNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'RequestSettleBet') {
            body = beginCell().store(storeRequestSettleBet(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SettleBet') {
            body = beginCell().store(storeSettleBet(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getQueryId(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('queryId', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getGateway(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('gateway', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getJettonWallet(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('jettonWallet', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    
}