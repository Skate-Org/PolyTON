"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkateGateway = void 0;
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
exports.storeChangeRelayer = storeChangeRelayer;
exports.loadChangeRelayer = loadChangeRelayer;
exports.storeSetExecutor = storeSetExecutor;
exports.loadSetExecutor = loadSetExecutor;
exports.storeRevokeExecutor = storeRevokeExecutor;
exports.loadRevokeExecutor = loadRevokeExecutor;
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
function storeChangeRelayer(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3991949411, 32);
        b_0.storeInt(src.newRelayer, 257);
        b_0.storeRef(src.currentSignature);
        b_0.storeRef(src.newSignature);
    };
}
function loadChangeRelayer(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3991949411) {
        throw Error('Invalid prefix');
    }
    let _newRelayer = sc_0.loadIntBig(257);
    let _currentSignature = sc_0.loadRef();
    let _newSignature = sc_0.loadRef();
    return { $$type: 'ChangeRelayer', newRelayer: _newRelayer, currentSignature: _currentSignature, newSignature: _newSignature };
}
function loadTupleChangeRelayer(source) {
    let _newRelayer = source.readBigNumber();
    let _currentSignature = source.readCell();
    let _newSignature = source.readCell();
    return { $$type: 'ChangeRelayer', newRelayer: _newRelayer, currentSignature: _currentSignature, newSignature: _newSignature };
}
function storeTupleChangeRelayer(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeNumber(source.newRelayer);
    builder.writeSlice(source.currentSignature);
    builder.writeSlice(source.newSignature);
    return builder.build();
}
function dictValueParserChangeRelayer() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeChangeRelayer(src)).endCell());
        },
        parse: (src) => {
            return loadChangeRelayer(src.loadRef().beginParse());
        }
    };
}
function storeSetExecutor(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(3368193837, 32);
        b_0.storeAddress(src.executor);
    };
}
function loadSetExecutor(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3368193837) {
        throw Error('Invalid prefix');
    }
    let _executor = sc_0.loadAddress();
    return { $$type: 'SetExecutor', executor: _executor };
}
function loadTupleSetExecutor(source) {
    let _executor = source.readAddress();
    return { $$type: 'SetExecutor', executor: _executor };
}
function storeTupleSetExecutor(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.executor);
    return builder.build();
}
function dictValueParserSetExecutor() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeSetExecutor(src)).endCell());
        },
        parse: (src) => {
            return loadSetExecutor(src.loadRef().beginParse());
        }
    };
}
function storeRevokeExecutor(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeUint(1193027593, 32);
        b_0.storeAddress(src.executor);
    };
}
function loadRevokeExecutor(slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1193027593) {
        throw Error('Invalid prefix');
    }
    let _executor = sc_0.loadAddress();
    return { $$type: 'RevokeExecutor', executor: _executor };
}
function loadTupleRevokeExecutor(source) {
    let _executor = source.readAddress();
    return { $$type: 'RevokeExecutor', executor: _executor };
}
function storeTupleRevokeExecutor(source) {
    let builder = new core_1.TupleBuilder();
    builder.writeAddress(source.executor);
    return builder.build();
}
function dictValueParserRevokeExecutor() {
    return {
        serialize: (src, builder) => {
            builder.storeRef((0, core_1.beginCell)().store(storeRevokeExecutor(src)).endCell());
        },
        parse: (src) => {
            return loadRevokeExecutor(src.loadRef().beginParse());
        }
    };
}
function initSkateGateway_init_args(src) {
    return (builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeInt(src.relayer, 257);
    };
}
async function SkateGateway_init(owner, relayer) {
    const __code = core_1.Cell.fromBase64('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');
    const __system = core_1.Cell.fromBase64('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');
    let builder = (0, core_1.beginCell)();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initSkateGateway_init_args({ $$type: 'SkateGateway_init_args', owner, relayer })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}
const SkateGateway_errors = {
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
    45396: { message: `SkateGateway::SkateExecuteTask::Task expired!` },
    48599: { message: `SkateGateway::set_relayer()::Not approved by new relayer!` },
};
const SkateGateway_types = [
    { "name": "StateInit", "header": null, "fields": [{ "name": "code", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "Context", "header": null, "fields": [{ "name": "bounced", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "sender", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "raw", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SendParameters", "header": null, "fields": [{ "name": "bounce", "type": { "kind": "simple", "type": "bool", "optional": false } }, { "name": "to", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "value", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "mode", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "body", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "code", "type": { "kind": "simple", "type": "cell", "optional": true } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": true } }] },
    { "name": "Deploy", "header": 2490013878, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "DeployOk", "header": 2952335191, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }] },
    { "name": "FactoryDeploy", "header": 1829761339, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "cashback", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ChangeOwner", "header": 2174598809, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "ChangeOwnerOk", "header": 846932810, "fields": [{ "name": "queryId", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "newOwner", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "Destination", "header": null, "fields": [{ "name": "chain_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "chain_type", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }, { "name": "address", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 256 } }] },
    { "name": "Payload", "header": null, "fields": [{ "name": "destination", "type": { "kind": "simple", "type": "cell", "optional": false } }, { "name": "data", "type": { "kind": "simple", "type": "cell", "optional": false } }] },
    { "name": "ExecutionInfo", "header": null, "fields": [{ "name": "value", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "expiration", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 32 } }, { "name": "payload", "type": { "kind": "simple", "type": "Payload", "optional": false } }] },
    { "name": "SkateInitiateTask", "header": null, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "processing_fee", "type": { "kind": "simple", "type": "uint", "optional": false, "format": "coins" } }, { "name": "execution_info", "type": { "kind": "simple", "type": "ExecutionInfo", "optional": false } }] },
    { "name": "SkateInitiateTaskEvent", "header": null, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "skate_app", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "execution_info", "type": { "kind": "simple", "type": "ExecutionInfo", "optional": false } }] },
    { "name": "SkateInitiateTaskNotification", "header": 960016369, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "user", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "execution_info", "type": { "kind": "simple", "type": "ExecutionInfo", "optional": false } }] },
    { "name": "SkateExecuteTask", "header": 3832306660, "fields": [{ "name": "query_id", "type": { "kind": "simple", "type": "uint", "optional": false, "format": 64 } }, { "name": "target_app", "type": { "kind": "simple", "type": "address", "optional": false } }, { "name": "execution_info", "type": { "kind": "simple", "type": "ExecutionInfo", "optional": false } }, { "name": "relayer_signature", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "ChangeRelayer", "header": 3991949411, "fields": [{ "name": "newRelayer", "type": { "kind": "simple", "type": "int", "optional": false, "format": 257 } }, { "name": "currentSignature", "type": { "kind": "simple", "type": "slice", "optional": false } }, { "name": "newSignature", "type": { "kind": "simple", "type": "slice", "optional": false } }] },
    { "name": "SetExecutor", "header": 3368193837, "fields": [{ "name": "executor", "type": { "kind": "simple", "type": "address", "optional": false } }] },
    { "name": "RevokeExecutor", "header": 1193027593, "fields": [{ "name": "executor", "type": { "kind": "simple", "type": "address", "optional": false } }] },
];
const SkateGateway_getters = [
    { "name": "currentNonce", "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "relayer", "arguments": [], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "isExecutor", "arguments": [{ "name": "addr", "type": { "kind": "simple", "type": "address", "optional": false } }], "returnType": { "kind": "simple", "type": "bool", "optional": false } },
    { "name": "executors", "arguments": [], "returnType": { "kind": "dict", "key": "address", "value": "bool" } },
    { "name": "changeRelayerMsg", "arguments": [], "returnType": { "kind": "simple", "type": "string", "optional": false } },
    { "name": "payload_hash", "arguments": [{ "name": "payload", "type": { "kind": "simple", "type": "Payload", "optional": false } }], "returnType": { "kind": "simple", "type": "int", "optional": false, "format": 257 } },
    { "name": "owner", "arguments": [], "returnType": { "kind": "simple", "type": "address", "optional": false } },
];
const SkateGateway_receivers = [
    { "receiver": "internal", "message": { "kind": "typed", "type": "SetExecutor" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "RevokeExecutor" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "ChangeRelayer" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "SkateInitiateTaskNotification" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "SkateExecuteTask" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "Deploy" } },
    { "receiver": "internal", "message": { "kind": "typed", "type": "ChangeOwner" } },
];
class SkateGateway {
    static async init(owner, relayer) {
        return await SkateGateway_init(owner, relayer);
    }
    static async fromInit(owner, relayer) {
        const init = await SkateGateway_init(owner, relayer);
        const address = (0, core_1.contractAddress)(0, init);
        return new SkateGateway(address, init);
    }
    static fromAddress(address) {
        return new SkateGateway(address);
    }
    constructor(address, init) {
        this.abi = {
            types: SkateGateway_types,
            getters: SkateGateway_getters,
            receivers: SkateGateway_receivers,
            errors: SkateGateway_errors,
        };
        this.address = address;
        this.init = init;
    }
    async send(provider, via, args, message) {
        let body = null;
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'SetExecutor') {
            body = (0, core_1.beginCell)().store(storeSetExecutor(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'RevokeExecutor') {
            body = (0, core_1.beginCell)().store(storeRevokeExecutor(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'ChangeRelayer') {
            body = (0, core_1.beginCell)().store(storeChangeRelayer(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'SkateInitiateTaskNotification') {
            body = (0, core_1.beginCell)().store(storeSkateInitiateTaskNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'SkateExecuteTask') {
            body = (0, core_1.beginCell)().store(storeSkateExecuteTask(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'Deploy') {
            body = (0, core_1.beginCell)().store(storeDeploy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof core_1.Slice) && message.$$type === 'ChangeOwner') {
            body = (0, core_1.beginCell)().store(storeChangeOwner(message)).endCell();
        }
        if (body === null) {
            throw new Error('Invalid message type');
        }
        await provider.internal(via, { ...args, body: body });
    }
    async getCurrentNonce(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('currentNonce', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    async getRelayer(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('relayer', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    async getIsExecutor(provider, addr) {
        let builder = new core_1.TupleBuilder();
        builder.writeAddress(addr);
        let source = (await provider.get('isExecutor', builder.build())).stack;
        let result = source.readBoolean();
        return result;
    }
    async getExecutors(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('executors', builder.build())).stack;
        let result = core_1.Dictionary.loadDirect(core_1.Dictionary.Keys.Address(), core_1.Dictionary.Values.Bool(), source.readCellOpt());
        return result;
    }
    async getChangeRelayerMsg(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('changeRelayerMsg', builder.build())).stack;
        let result = source.readString();
        return result;
    }
    async getPayloadHash(provider, payload) {
        let builder = new core_1.TupleBuilder();
        builder.writeTuple(storeTuplePayload(payload));
        let source = (await provider.get('payload_hash', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    async getOwner(provider) {
        let builder = new core_1.TupleBuilder();
        let source = (await provider.get('owner', builder.build())).stack;
        let result = source.readAddress();
        return result;
    }
}
exports.SkateGateway = SkateGateway;
