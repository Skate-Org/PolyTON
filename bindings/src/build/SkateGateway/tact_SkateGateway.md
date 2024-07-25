# TACT Compilation Report
Contract: SkateGateway
BOC Size: 2044 bytes

# Types
Total Types: 18

## StateInit
TLB: `_ code:^cell data:^cell = StateInit`
Signature: `StateInit{code:^cell,data:^cell}`

## Context
TLB: `_ bounced:bool sender:address value:int257 raw:^slice = Context`
Signature: `Context{bounced:bool,sender:address,value:int257,raw:^slice}`

## SendParameters
TLB: `_ bounce:bool to:address value:int257 mode:int257 body:Maybe ^cell code:Maybe ^cell data:Maybe ^cell = SendParameters`
Signature: `SendParameters{bounce:bool,to:address,value:int257,mode:int257,body:Maybe ^cell,code:Maybe ^cell,data:Maybe ^cell}`

## Deploy
TLB: `deploy#946a98b6 queryId:uint64 = Deploy`
Signature: `Deploy{queryId:uint64}`

## DeployOk
TLB: `deploy_ok#aff90f57 queryId:uint64 = DeployOk`
Signature: `DeployOk{queryId:uint64}`

## FactoryDeploy
TLB: `factory_deploy#6d0ff13b queryId:uint64 cashback:address = FactoryDeploy`
Signature: `FactoryDeploy{queryId:uint64,cashback:address}`

## ChangeOwner
TLB: `change_owner#819dbe99 queryId:uint64 newOwner:address = ChangeOwner`
Signature: `ChangeOwner{queryId:uint64,newOwner:address}`

## ChangeOwnerOk
TLB: `change_owner_ok#327b2b4a queryId:uint64 newOwner:address = ChangeOwnerOk`
Signature: `ChangeOwnerOk{queryId:uint64,newOwner:address}`

## Destination
TLB: `_ chain_id:uint256 chain_type:uint256 address:uint256 = Destination`
Signature: `Destination{chain_id:uint256,chain_type:uint256,address:uint256}`

## Payload
TLB: `_ destination:^cell data:^cell = Payload`
Signature: `Payload{destination:^cell,data:^cell}`

## ExecutionInfo
TLB: `_ value:coins expiration:uint32 payload:Payload{destination:^cell,data:^cell} = ExecutionInfo`
Signature: `ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}}`

## SkateInitiateTask
TLB: `_ query_id:uint64 user:address processing_fee:coins execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} = SkateInitiateTask`
Signature: `SkateInitiateTask{query_id:uint64,user:address,processing_fee:coins,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}}}`

## SkateInitiateTaskEvent
TLB: `_ query_id:uint64 user:address skate_app:address execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} = SkateInitiateTaskEvent`
Signature: `SkateInitiateTaskEvent{query_id:uint64,user:address,skate_app:address,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}}}`

## SkateInitiateTaskNotification
TLB: `skate_initiate_task_notification#3938aff1 query_id:uint64 user:address execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} = SkateInitiateTaskNotification`
Signature: `SkateInitiateTaskNotification{query_id:uint64,user:address,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}}}`

## SkateExecuteTask
TLB: `skate_execute_task#e46c5be4 query_id:uint64 target_app:address execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} relayer_signature:^slice = SkateExecuteTask`
Signature: `SkateExecuteTask{query_id:uint64,target_app:address,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}},relayer_signature:^slice}`

## ChangeRelayer
TLB: `change_relayer#edf05063 newRelayer:int257 currentSignature:^slice newSignature:^slice = ChangeRelayer`
Signature: `ChangeRelayer{newRelayer:int257,currentSignature:^slice,newSignature:^slice}`

## SetExecutor
TLB: `set_executor#c8c28f2d executor:address = SetExecutor`
Signature: `SetExecutor{executor:address}`

## RevokeExecutor
TLB: `revoke_executor#471c2809 executor:address = RevokeExecutor`
Signature: `RevokeExecutor{executor:address}`

# Get Methods
Total Get Methods: 7

## currentNonce

## relayer

## isExecutor
Argument: addr

## executors

## changeRelayerMsg

## payload_hash
Argument: payload

## owner

# Error Codes
2: Stack underflow
3: Stack overflow
4: Integer overflow
5: Integer out of expected range
6: Invalid opcode
7: Type check error
8: Cell overflow
9: Cell underflow
10: Dictionary error
13: Out of gas error
32: Method ID not found
34: Action is invalid or not supported
37: Not enough TON
38: Not enough extra-currencies
128: Null reference exception
129: Invalid serialization prefix
130: Invalid incoming message
131: Constraints error
132: Access denied
133: Contract stopped
134: Invalid argument
135: Code of a contract was not found
136: Invalid address
137: Masterchain support is not enabled for this contract
6808: SkateGateway::SkateInitiateTaskNotification::Not enough processing fee!
10580: SkateGateway::validate_relayer_signature()::Invalid relayer signature!
45396: SkateGateway::SkateExecuteTask::Task expired!
48599: SkateGateway::set_relayer()::Not approved by new relayer!