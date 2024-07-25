"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolyMarket = void 0;
exports.storeStateInit = storeStateInit;
exports.loadStateInit = loadStateInit;
exports.storeContext = storeContext;
exports.loadContext = loadContext;
exports.storeSendParameters = storeSendParameters;
exports.loadSendParameters = loadSendParameters;
exports.storeDeploy = storeDeploy;
exports.loadDeploy = loadDeploy;
exports.storeDeployOk = storeDeployOk;
exports.loadDeployOk = loadDeployOk;
exports.storeFactoryDeploy = storeFactoryDeploy;
exports.loadFactoryDeploy = loadFactoryDeploy;
exports.storeChangeOwner = storeChangeOwner;
exports.loadChangeOwner = loadChangeOwner;
exports.storeChangeOwnerOk = storeChangeOwnerOk;
exports.loadChangeOwnerOk = loadChangeOwnerOk;
exports.storeJettonTransfer = storeJettonTransfer;
exports.loadJettonTransfer = loadJettonTransfer;
exports.storeJettonTransferNotification = storeJettonTransferNotification;
exports.loadJettonTransferNotification = loadJettonTransferNotification;
exports.storeJettonBurn = storeJettonBurn;
exports.loadJettonBurn = loadJettonBurn;
exports.storeJettonExcesses = storeJettonExcesses;
exports.loadJettonExcesses = loadJettonExcesses;
exports.storeJettonInternalTransfer = storeJettonInternalTransfer;
exports.loadJettonInternalTransfer = loadJettonInternalTransfer;
exports.storeJettonBurnNotification = storeJettonBurnNotification;
exports.loadJettonBurnNotification = loadJettonBurnNotification;
exports.storeWalletData = storeWalletData;
exports.loadWalletData = loadWalletData;
exports.storeDestination = storeDestination;
exports.loadDestination = loadDestination;
exports.storePayload = storePayload;
exports.loadPayload = loadPayload;
exports.storeExecutionInfo = storeExecutionInfo;
exports.loadExecutionInfo = loadExecutionInfo;
exports.storeSkateInitiateTask = storeSkateInitiateTask;
exports.loadSkateInitiateTask = loadSkateInitiateTask;
exports.storeSkateInitiateTaskEvent = storeSkateInitiateTaskEvent;
exports.loadSkateInitiateTaskEvent = loadSkateInitiateTaskEvent;
exports.storeSkateInitiateTaskNotification = storeSkateInitiateTaskNotification;
exports.loadSkateInitiateTaskNotification = loadSkateInitiateTaskNotification;
exports.storeSkateExecuteTask = storeSkateExecuteTask;
exports.loadSkateExecuteTask = loadSkateExecuteTask;
exports.storeBet = storeBet;
exports.loadBet = loadBet;
exports.storeBetConfig = storeBetConfig;
exports.loadBetConfig = loadBetConfig;
exports.storeSettleBet = storeSettleBet;
exports.loadSettleBet = loadSettleBet;
exports.storeRequestSettleBet = storeRequestSettleBet;
exports.loadRequestSettleBet = loadRequestSettleBet;
exports.storeSetJettonWallet = storeSetJettonWallet;
exports.loadSetJettonWallet = loadSetJettonWallet;
const core_1 = require("@ton/core");
function storeStateInit(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}
function loadStateInit(slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function loadTupleStateInit(source) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit', code: _code, data: _data };
}
function storeTupleStateInit(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserStateInit() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    };
}
function storeContext(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}
function loadContext(slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context', bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}
function loadTupleContext(source) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context', bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}
function storeTupleContext(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}
function dictValueParserContext() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    };
}
function storeSendParameters(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) {
            b_0.storeBit(true).storeRef(src.body);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.code !== null && src.code !== undefined) {
            b_0.storeBit(true).storeRef(src.code);
        }
        else {
            b_0.storeBit(false);
        }
        if (src.data !== null && src.data !== undefined) {
            b_0.storeBit(true).storeRef(src.data);
        }
        else {
            b_0.storeBit(false);
        }
    };
}
function loadSendParameters(slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters', bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}
function loadTupleSendParameters(source) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters', bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}
function storeTupleSendParameters(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserSendParameters() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    };
}
function storeDeploy(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
function loadDeploy(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy', queryId: _queryId };
}
function loadTupleDeploy(source) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy', queryId: _queryId };
}
function storeTupleDeploy(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeploy() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    };
}
function storeDeployOk(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}
function loadDeployOk(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk', queryId: _queryId };
}
function loadTupleDeployOk(source) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk', queryId: _queryId };
}
function storeTupleDeployOk(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}
function dictValueParserDeployOk() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    };
}
function storeFactoryDeploy(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}
function loadFactoryDeploy(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy', queryId: _queryId, cashback: _cashback };
}
function loadTupleFactoryDeploy(source) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy', queryId: _queryId, cashback: _cashback };
}
function storeTupleFactoryDeploy(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}
function dictValueParserFactoryDeploy() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    };
}
function storeChangeOwner(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}
function loadChangeOwner(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner', queryId: _queryId, newOwner: _newOwner };
}
function loadTupleChangeOwner(source) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner', queryId: _queryId, newOwner: _newOwner };
}
function storeTupleChangeOwner(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}
function dictValueParserChangeOwner() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    };
}
function storeChangeOwnerOk(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}
function loadChangeOwnerOk(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) {
        throw Error('Invalid prefix');
    }
    let _queryId = sc_0.loadUintBig(64);
    let _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk', queryId: _queryId, newOwner: _newOwner };
}
function loadTupleChangeOwnerOk(source) {
    let _queryId = source.readBigNumber();
    let _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk', queryId: _queryId, newOwner: _newOwner };
}
function storeTupleChangeOwnerOk(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}
function dictValueParserChangeOwnerOk() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    };
}
function storeJettonTransfer(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(260734629, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.destination);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) {
            b_0.storeBit(true).storeRef(src.custom_payload);
        }
        else {
            b_0.storeBit(false);
        }
        b_0.storeCoins(src.forward_ton_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}
function loadJettonTransfer(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 260734629) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _destination = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'JettonTransfer', query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}
function loadTupleJettonTransfer(source) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _destination = source.readAddress();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'JettonTransfer', query_id: _query_id, amount: _amount, destination: _destination, response_destination: _response_destination, custom_payload: _custom_payload, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}
function storeTupleJettonTransfer(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.destination);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}
function dictValueParserJettonTransfer() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeJettonTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransfer(src.loadRef().beginParse());
        }
    };
}
function storeJettonTransferNotification(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}
function loadJettonTransferNotification(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _sender = sc_0.loadAddress();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'JettonTransferNotification', query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}
function loadTupleJettonTransferNotification(source) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _forward_payload = source.readCell();
    return { $$type: 'JettonTransferNotification', query_id: _query_id, amount: _amount, sender: _sender, forward_payload: _forward_payload };
}
function storeTupleJettonTransferNotification(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}
function dictValueParserJettonTransferNotification() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeJettonTransferNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransferNotification(src.loadRef().beginParse());
        }
    };
}
function storeJettonBurn(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1499400124, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) {
            b_0.storeBit(true).storeRef(src.custom_payload);
        }
        else {
            b_0.storeBit(false);
        }
    };
}
function loadJettonBurn(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1499400124) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _response_destination = sc_0.loadAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'JettonBurn', query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}
function loadTupleJettonBurn(source) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _response_destination = source.readAddress();
    let _custom_payload = source.readCellOpt();
    return { $$type: 'JettonBurn', query_id: _query_id, amount: _amount, response_destination: _response_destination, custom_payload: _custom_payload };
}
function storeTupleJettonBurn(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    return builder.build();
}
function dictValueParserJettonBurn() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeJettonBurn(src)).endCell());
        },
        parse: (src) => {
            return loadJettonBurn(src.loadRef().beginParse());
        }
    };
}
function storeJettonExcesses(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}
function loadJettonExcesses(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'JettonExcesses', query_id: _query_id };
}
function loadTupleJettonExcesses(source) {
    let _query_id = source.readBigNumber();
    return { $$type: 'JettonExcesses', query_id: _query_id };
}
function storeTupleJettonExcesses(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}
function dictValueParserJettonExcesses() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeJettonExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadJettonExcesses(src.loadRef().beginParse());
        }
    };
}
function storeJettonInternalTransfer(src) {
    return (builder) => {
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
function loadJettonInternalTransfer(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 395134233) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _from = sc_0.loadAddress();
    let _response_address = sc_0.loadMaybeAddress();
    let _forward_ton_amount = sc_0.loadCoins();
    let _forward_payload = sc_0.asCell();
    return { $$type: 'JettonInternalTransfer', query_id: _query_id, amount: _amount, from: _from, response_address: _response_address, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}
function loadTupleJettonInternalTransfer(source) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _from = source.readAddress();
    let _response_address = source.readAddressOpt();
    let _forward_ton_amount = source.readBigNumber();
    let _forward_payload = source.readCell();
    return { $$type: 'JettonInternalTransfer', query_id: _query_id, amount: _amount, from: _from, response_address: _response_address, forward_ton_amount: _forward_ton_amount, forward_payload: _forward_payload };
}
function storeTupleJettonInternalTransfer(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.from);
    builder.writeAddress(source.response_address);
    builder.writeNumber(source.forward_ton_amount);
    builder.writeSlice(source.forward_payload);
    return builder.build();
}
function dictValueParserJettonInternalTransfer() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeJettonInternalTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadJettonInternalTransfer(src.loadRef().beginParse());
        }
    };
}
function storeJettonBurnNotification(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2078119902, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeAddress(src.response_destination);
    };
}
function loadJettonBurnNotification(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2078119902) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _amount = sc_0.loadCoins();
    let _sender = sc_0.loadAddress();
    let _response_destination = sc_0.loadAddress();
    return { $$type: 'JettonBurnNotification', query_id: _query_id, amount: _amount, sender: _sender, response_destination: _response_destination };
}
function loadTupleJettonBurnNotification(source) {
    let _query_id = source.readBigNumber();
    let _amount = source.readBigNumber();
    let _sender = source.readAddress();
    let _response_destination = source.readAddress();
    return { $$type: 'JettonBurnNotification', query_id: _query_id, amount: _amount, sender: _sender, response_destination: _response_destination };
}
function storeTupleJettonBurnNotification(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeAddress(source.response_destination);
    return builder.build();
}
function dictValueParserJettonBurnNotification() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeJettonBurnNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonBurnNotification(src.loadRef().beginParse());
        }
    };
}
function storeWalletData(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.jetton);
        b_0.storeRef(src.jetton_wallet_code);
    };
}
function loadWalletData(slice) {
    let sc_0 = slice;
    let _balance = sc_0.loadCoins();
    let _owner = sc_0.loadAddress();
    let _jetton = sc_0.loadAddress();
    let _jetton_wallet_code = sc_0.loadRef();
    return { $$type: 'WalletData', balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}
function loadTupleWalletData(source) {
    let _balance = source.readBigNumber();
    let _owner = source.readAddress();
    let _jetton = source.readAddress();
    let _jetton_wallet_code = source.readCell();
    return { $$type: 'WalletData', balance: _balance, owner: _owner, jetton: _jetton, jetton_wallet_code: _jetton_wallet_code };
}
function storeTupleWalletData(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.owner);
    builder.writeAddress(source.jetton);
    builder.writeCell(source.jetton_wallet_code);
    return builder.build();
}
function dictValueParserWalletData() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadWalletData(src.loadRef().beginParse());
        }
    };
}
function storeDestination(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(src.chain_id, 256);
        b_0.storeUint(src.chain_type, 256);
        b_0.storeUint(src.address, 256);
    };
}
function loadDestination(slice) {
    let sc_0 = slice;
    let _chain_id = sc_0.loadUintBig(256);
    let _chain_type = sc_0.loadUintBig(256);
    let _address = sc_0.loadUintBig(256);
    return { $$type: 'Destination', chain_id: _chain_id, chain_type: _chain_type, address: _address };
}
function loadTupleDestination(source) {
    let _chain_id = source.readBigNumber();
    let _chain_type = source.readBigNumber();
    let _address = source.readBigNumber();
    return { $$type: 'Destination', chain_id: _chain_id, chain_type: _chain_type, address: _address };
}
function storeTupleDestination(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.chain_id);
    builder.writeNumber(source.chain_type);
    builder.writeNumber(source.address);
    return builder.build();
}
function dictValueParserDestination() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeDestination(src)).endCell());
        },
        parse: (src) => {
            return loadDestination(src.loadRef().beginParse());
        }
    };
}
function storePayload(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeRef(src.destination);
        b_0.storeRef(src.data);
    };
}
function loadPayload(slice) {
    let sc_0 = slice;
    let _destination = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'Payload', destination: _destination, data: _data };
}
function loadTuplePayload(source) {
    let _destination = source.readCell();
    let _data = source.readCell();
    return { $$type: 'Payload', destination: _destination, data: _data };
}
function storeTuplePayload(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeCell(source.destination);
    builder.writeCell(source.data);
    return builder.build();
}
function dictValueParserPayload() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storePayload(src)).endCell());
        },
        parse: (src) => {
            return loadPayload(src.loadRef().beginParse());
        }
    };
}
function storeExecutionInfo(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeCoins(src.value);
        b_0.storeUint(src.expiration, 32);
        b_0.store(storePayload(src.payload));
    };
}
function loadExecutionInfo(slice) {
    let sc_0 = slice;
    let _value = sc_0.loadCoins();
    let _expiration = sc_0.loadUintBig(32);
    let _payload = loadPayload(sc_0);
    return { $$type: 'ExecutionInfo', value: _value, expiration: _expiration, payload: _payload };
}
function loadTupleExecutionInfo(source) {
    let _value = source.readBigNumber();
    let _expiration = source.readBigNumber();
    const _payload = loadTuplePayload(source.readTuple());
    return { $$type: 'ExecutionInfo', value: _value, expiration: _expiration, payload: _payload };
}
function storeTupleExecutionInfo(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.value);
    builder.writeNumber(source.expiration);
    builder.writeTuple(storeTuplePayload(source.payload));
    return builder.build();
}
function dictValueParserExecutionInfo() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeExecutionInfo(src)).endCell());
        },
        parse: (src) => {
            return loadExecutionInfo(src.loadRef().beginParse());
        }
    };
}
function storeSkateInitiateTask(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.user);
        b_0.storeCoins(src.processing_fee);
        b_0.store(storeExecutionInfo(src.execution_info));
    };
}
function loadSkateInitiateTask(slice) {
    let sc_0 = slice;
    let _query_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _processing_fee = sc_0.loadCoins();
    let _execution_info = loadExecutionInfo(sc_0);
    return { $$type: 'SkateInitiateTask', query_id: _query_id, user: _user, processing_fee: _processing_fee, execution_info: _execution_info };
}
function loadTupleSkateInitiateTask(source) {
    let _query_id = source.readBigNumber();
    let _user = source.readAddress();
    let _processing_fee = source.readBigNumber();
    const _execution_info = loadTupleExecutionInfo(source.readTuple());
    return { $$type: 'SkateInitiateTask', query_id: _query_id, user: _user, processing_fee: _processing_fee, execution_info: _execution_info };
}
function storeTupleSkateInitiateTask(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.user);
    builder.writeNumber(source.processing_fee);
    builder.writeTuple(storeTupleExecutionInfo(source.execution_info));
    return builder.build();
}
function dictValueParserSkateInitiateTask() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSkateInitiateTask(src)).endCell());
        },
        parse: (src) => {
            return loadSkateInitiateTask(src.loadRef().beginParse());
        }
    };
}
function storeSkateInitiateTaskEvent(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.user);
        b_0.storeAddress(src.skate_app);
        b_0.store(storeExecutionInfo(src.execution_info));
    };
}
function loadSkateInitiateTaskEvent(slice) {
    let sc_0 = slice;
    let _query_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _skate_app = sc_0.loadAddress();
    let _execution_info = loadExecutionInfo(sc_0);
    return { $$type: 'SkateInitiateTaskEvent', query_id: _query_id, user: _user, skate_app: _skate_app, execution_info: _execution_info };
}
function loadTupleSkateInitiateTaskEvent(source) {
    let _query_id = source.readBigNumber();
    let _user = source.readAddress();
    let _skate_app = source.readAddress();
    const _execution_info = loadTupleExecutionInfo(source.readTuple());
    return { $$type: 'SkateInitiateTaskEvent', query_id: _query_id, user: _user, skate_app: _skate_app, execution_info: _execution_info };
}
function storeTupleSkateInitiateTaskEvent(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.user);
    builder.writeAddress(source.skate_app);
    builder.writeTuple(storeTupleExecutionInfo(source.execution_info));
    return builder.build();
}
function dictValueParserSkateInitiateTaskEvent() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSkateInitiateTaskEvent(src)).endCell());
        },
        parse: (src) => {
            return loadSkateInitiateTaskEvent(src.loadRef().beginParse());
        }
    };
}
function storeSkateInitiateTaskNotification(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(960016369, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.user);
        b_0.store(storeExecutionInfo(src.execution_info));
    };
}
function loadSkateInitiateTaskNotification(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 960016369) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _execution_info = loadExecutionInfo(sc_0);
    return { $$type: 'SkateInitiateTaskNotification', query_id: _query_id, user: _user, execution_info: _execution_info };
}
function loadTupleSkateInitiateTaskNotification(source) {
    let _query_id = source.readBigNumber();
    let _user = source.readAddress();
    const _execution_info = loadTupleExecutionInfo(source.readTuple());
    return { $$type: 'SkateInitiateTaskNotification', query_id: _query_id, user: _user, execution_info: _execution_info };
}
function storeTupleSkateInitiateTaskNotification(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.user);
    builder.writeTuple(storeTupleExecutionInfo(source.execution_info));
    return builder.build();
}
function dictValueParserSkateInitiateTaskNotification() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSkateInitiateTaskNotification(src)).endCell());
        },
        parse: (src) => {
            return loadSkateInitiateTaskNotification(src.loadRef().beginParse());
        }
    };
}
function storeSkateExecuteTask(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3832306660, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.target_app);
        b_0.store(storeExecutionInfo(src.execution_info));
        b_0.storeRef(src.relayer_signature);
    };
}
function loadSkateExecuteTask(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3832306660) {
        throw Error('Invalid prefix');
    }
    let _query_id = sc_0.loadUintBig(64);
    let _target_app = sc_0.loadAddress();
    let _execution_info = loadExecutionInfo(sc_0);
    let _relayer_signature = sc_0.loadRef();
    return { $$type: 'SkateExecuteTask', query_id: _query_id, target_app: _target_app, execution_info: _execution_info, relayer_signature: _relayer_signature };
}
function loadTupleSkateExecuteTask(source) {
    let _query_id = source.readBigNumber();
    let _target_app = source.readAddress();
    const _execution_info = loadTupleExecutionInfo(source.readTuple());
    let _relayer_signature = source.readCell();
    return { $$type: 'SkateExecuteTask', query_id: _query_id, target_app: _target_app, execution_info: _execution_info, relayer_signature: _relayer_signature };
}
function storeTupleSkateExecuteTask(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.target_app);
    builder.writeTuple(storeTupleExecutionInfo(source.execution_info));
    builder.writeSlice(source.relayer_signature);
    return builder.build();
}
function dictValueParserSkateExecuteTask() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSkateExecuteTask(src)).endCell());
        },
        parse: (src) => {
            return loadSkateExecuteTask(src.loadRef().beginParse());
        }
    };
}
function storeBet(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(src.candidate_id, 8);
        b_0.storeBit(src.direction);
        b_0.storeCoins(src.usd_amount);
    };
}
function loadBet(slice) {
    let sc_0 = slice;
    let _candidate_id = sc_0.loadUintBig(8);
    let _direction = sc_0.loadBit();
    let _usd_amount = sc_0.loadCoins();
    return { $$type: 'Bet', candidate_id: _candidate_id, direction: _direction, usd_amount: _usd_amount };
}
function loadTupleBet(source) {
    let _candidate_id = source.readBigNumber();
    let _direction = source.readBoolean();
    let _usd_amount = source.readBigNumber();
    return { $$type: 'Bet', candidate_id: _candidate_id, direction: _direction, usd_amount: _usd_amount };
}
function storeTupleBet(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.candidate_id);
    builder.writeBoolean(source.direction);
    builder.writeNumber(source.usd_amount);
    return builder.build();
}
function dictValueParserBet() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeBet(src)).endCell());
        },
        parse: (src) => {
            return loadBet(src.loadRef().beginParse());
        }
    };
}
function storeBetConfig(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(src.candidate_id, 8);
        b_0.storeBit(src.direction);
    };
}
function loadBetConfig(slice) {
    let sc_0 = slice;
    let _candidate_id = sc_0.loadUintBig(8);
    let _direction = sc_0.loadBit();
    return { $$type: 'BetConfig', candidate_id: _candidate_id, direction: _direction };
}
function loadTupleBetConfig(source) {
    let _candidate_id = source.readBigNumber();
    let _direction = source.readBoolean();
    return { $$type: 'BetConfig', candidate_id: _candidate_id, direction: _direction };
}
function storeTupleBetConfig(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.candidate_id);
    builder.writeBoolean(source.direction);
    return builder.build();
}
function dictValueParserBetConfig() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeBetConfig(src)).endCell());
        },
        parse: (src) => {
            return loadBetConfig(src.loadRef().beginParse());
        }
    };
}
function storeSettleBet(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3299040581, 32);
        b_0.storeUint(src.settle_id, 64);
        b_0.storeAddress(src.user);
        b_0.storeAddress(src.fee_receiver);
        b_0.storeCoins(src.usd_amount);
    };
}
function loadSettleBet(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3299040581) {
        throw Error('Invalid prefix');
    }
    let _settle_id = sc_0.loadUintBig(64);
    let _user = sc_0.loadAddress();
    let _fee_receiver = sc_0.loadAddress();
    let _usd_amount = sc_0.loadCoins();
    return { $$type: 'SettleBet', settle_id: _settle_id, user: _user, fee_receiver: _fee_receiver, usd_amount: _usd_amount };
}
function loadTupleSettleBet(source) {
    let _settle_id = source.readBigNumber();
    let _user = source.readAddress();
    let _fee_receiver = source.readAddress();
    let _usd_amount = source.readBigNumber();
    return { $$type: 'SettleBet', settle_id: _settle_id, user: _user, fee_receiver: _fee_receiver, usd_amount: _usd_amount };
}
function storeTupleSettleBet(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.settle_id);
    builder.writeAddress(source.user);
    builder.writeAddress(source.fee_receiver);
    builder.writeNumber(source.usd_amount);
    return builder.build();
}
function dictValueParserSettleBet() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSettleBet(src)).endCell());
        },
        parse: (src) => {
            return loadSettleBet(src.loadRef().beginParse());
        }
    };
}
function storeRequestSettleBet(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(2268796018, 32);
        b_0.storeUint(src.candidate_id, 8);
        b_0.storeBit(src.direction);
        b_0.storeCoins(src.ct_amount);
    };
}
function loadRequestSettleBet(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2268796018) {
        throw Error('Invalid prefix');
    }
    let _candidate_id = sc_0.loadUintBig(8);
    let _direction = sc_0.loadBit();
    let _ct_amount = sc_0.loadCoins();
    return { $$type: 'RequestSettleBet', candidate_id: _candidate_id, direction: _direction, ct_amount: _ct_amount };
}
function loadTupleRequestSettleBet(source) {
    let _candidate_id = source.readBigNumber();
    let _direction = source.readBoolean();
    let _ct_amount = source.readBigNumber();
    return { $$type: 'RequestSettleBet', candidate_id: _candidate_id, direction: _direction, ct_amount: _ct_amount };
}
function storeTupleRequestSettleBet(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.candidate_id);
    builder.writeBoolean(source.direction);
    builder.writeNumber(source.ct_amount);
    return builder.build();
}
function dictValueParserRequestSettleBet() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeRequestSettleBet(src)).endCell());
        },
        parse: (src) => {
            return loadRequestSettleBet(src.loadRef().beginParse());
        }
    };
}
function storeSetJettonWallet(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1999771523, 32);
        b_0.storeAddress(src.jetton_wallet);
    };
}
function loadSetJettonWallet(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1999771523) {
        throw Error('Invalid prefix');
    }
    let _jetton_wallet = sc_0.loadAddress();
    return { $$type: 'SetJettonWallet', jetton_wallet: _jetton_wallet };
}
function loadTupleSetJettonWallet(source) {
    let _jetton_wallet = source.readAddress();
    return { $$type: 'SetJettonWallet', jetton_wallet: _jetton_wallet };
}
function storeTupleSetJettonWallet(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.jetton_wallet);
    return builder.build();
}
function dictValueParserSetJettonWallet() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSetJettonWallet(src)).endCell());
        },
        parse: (src) => {
            return loadSetJettonWallet(src.loadRef().beginParse());
        }
    };
}
function initPolyMarket_init_args(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.skate_gateway);
    };
}
async function PolyMarket_init(owner, skate_gateway) {
    const __code = core_1.Cell.fromBase64('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');
    const __system = core_1.Cell.fromBase64('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');
    let builder = (0, core_1.beginCell)();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initPolyMarket_init_args({ $$type: 'PolyMarket_init_args', owner, skate_gateway })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}
const PolyMarket_errors = {
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
};
const PolyMarket_types = [
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounced", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ChangeOwner", "header": 2174598809, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ChangeOwnerOk", "header": 846932810, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "JettonTransfer", "header": 260734629, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "response_destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "custom_payload", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "forward_ton_amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "JettonTransferNotification", "header": 1935855772, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "JettonBurn", "header": 1499400124, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "response_destination", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "custom_payload", "type": { "kind": "simple", "type": "cell", "optional": true } }] },
    { "name": "JettonExcesses", "header": 3576854235, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "JettonInternalTransfer", "header": 395134233, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "from", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "response_address", "type": { "kind": "simple", "type": "address", "optional": true } }, { "name": "forward_ton_amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "forward_payload", "type": { "kind": "simple", "type": "slice", "optional": false, "format": "remainder" } }] },
    { "name": "JettonBurnNotification", "header": 2078119902, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "response_destination", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "WalletData", "header": null, "fields": [{ "name": "balance", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "owner", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "jetton", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "jetton_wallet_code", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Destination", "header": null, "fields": [{ "name": "chain_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "chain_type", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "Payload", "header": null, "fields": [{ "name": "destination", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "ExecutionInfo", "header": null, "fields": [{ "name": "value", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "expiration", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "payload", "type": { "kind": "simple", "type": "Payload", "optional": false } }] },
    { "name": "SkateInitiateTask", "header": null, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "processing_fee", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "execution_info", "type": { "kind": "simple", "type": "ExecutionInfo", "optional": false } }] },
    { "name": "SkateInitiateTaskEvent", "header": null, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "skate_app", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "execution_info", "type": { "kind": "simple", "type": "ExecutionInfo", "optional": false } }] },
    { "name": "SkateInitiateTaskNotification", "header": 960016369, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "execution_info", "type": { "kind": "simple", "type": "ExecutionInfo", "optional": false } }] },
    { "name": "SkateExecuteTask", "header": 3832306660, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "target_app", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "execution_info", "type": { "kind": "simple", "type": "ExecutionInfo", "optional": false } }, { "name": "relayer_signature", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "Bet", "header": null, "fields": [{ "name": "candidate_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "direction", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "usd_amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "BetConfig", "header": null, "fields": [{ "name": "candidate_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "direction", "type": { "kind": "simple", "type": "bool", "optional": false } }] },
    { "name": "SettleBet", "header": 3299040581, "fields": [{ "name": "settle_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "fee_receiver", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "usd_amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "RequestSettleBet", "header": 2268796018, "fields": [{ "name": "candidate_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 8 } }, { "name": "direction", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "ct_amount", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }] },
    { "name": "SetJettonWallet", "header": 1999771523, "fields": [{ "name": "jetton_wallet", "type": { "kind": "simple", "type": "address", "optional": false } }] },
];
const PolyMarket_getters = [
    { "name": "initiateCount", "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "settleCount", "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "gateway", "arguments": [], "returnType": { "kind": "simple", "type": "address", "optional": false } },
    { "name": "owner", "arguments": [], "returnType": { "kind": "simple", "type": "address", "optional": false } },
];
const PolyMarket_receivers = [
    { "receiver": "internal", "message": { "kind": "typed", "type": "SetJettonWallet" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "JettonTransferNotification" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "RequestSettleBet" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "SettleBet" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Deploy" } },
];
class PolyMarket {
    static async init(owner, skate_gateway) {
        return await PolyMarket_init(owner, skate_gateway);
    }
    static async fromInit(owner, skate_gateway) {
        const init = await PolyMarket_init(owner, skate_gateway);
        const address = (0, core_1.contractAddress)(0, init);
        return new PolyMarket(address, init);
    }
    static fromAddress(address) {
        return new PolyMarket(address);
    }
    constructor(address, init) {
        this.abi = {
            types: PolyMarket_types,
            getters: PolyMarket_getters,
            receivers: PolyMarket_receivers,
            errors: PolyMarket_errors,
        };
        this.address = address;
        this.init = init;
    }
    async send(provider, via, args, message) {
        let body = null;
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'SetJettonWallet') {
            body = (0, core_1.beginCell)().store(storeSetJettonWallet(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'JettonTransferNotification') {
            body = (0, core_1.beginCell)().store(storeJettonTransferNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'RequestSettleBet') {
            body = (0, core_1.beginCell)().store(storeRequestSettleBet(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'SettleBet') {
            body = (0, core_1.beginCell)().store(storeSettleBet(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Deploy') {
            body = (0, core_1.beginCell)().store(storeDeploy(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getInitiateCount(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('initiateCount', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    async getSettleCount(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('settleCount', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    async getGateway(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('gateway', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
    async getOwner(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
}
exports.PolyMarket = PolyMarket;
