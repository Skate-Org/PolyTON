# TACT Compilation Report
Contract: PolyMarket
BOC Size: 2122 bytes

# Types
Total Types: 29

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

## JettonTransfer
TLB: `jetton_transfer#0f8a7ea5 query_id:uint64 amount:coins destination:address response_destination:address custom_payload:Maybe ^cell forward_ton_amount:coins forward_payload:remainder<slice> = JettonTransfer`
Signature: `JettonTransfer{query_id:uint64,amount:coins,destination:address,response_destination:address,custom_payload:Maybe ^cell,forward_ton_amount:coins,forward_payload:remainder<slice>}`

## JettonTransferNotification
TLB: `jetton_transfer_notification#7362d09c query_id:uint64 amount:coins sender:address forward_payload:remainder<slice> = JettonTransferNotification`
Signature: `JettonTransferNotification{query_id:uint64,amount:coins,sender:address,forward_payload:remainder<slice>}`

## JettonBurn
TLB: `jetton_burn#595f07bc query_id:uint64 amount:coins response_destination:address custom_payload:Maybe ^cell = JettonBurn`
Signature: `JettonBurn{query_id:uint64,amount:coins,response_destination:address,custom_payload:Maybe ^cell}`

## JettonExcesses
TLB: `jetton_excesses#d53276db query_id:uint64 = JettonExcesses`
Signature: `JettonExcesses{query_id:uint64}`

## JettonInternalTransfer
TLB: `jetton_internal_transfer#178d4519 query_id:uint64 amount:coins from:address response_address:Maybe address forward_ton_amount:coins forward_payload:remainder<slice> = JettonInternalTransfer`
Signature: `JettonInternalTransfer{query_id:uint64,amount:coins,from:address,response_address:Maybe address,forward_ton_amount:coins,forward_payload:remainder<slice>}`

## JettonBurnNotification
TLB: `jetton_burn_notification#7bdd97de query_id:uint64 amount:coins sender:address response_destination:address = JettonBurnNotification`
Signature: `JettonBurnNotification{query_id:uint64,amount:coins,sender:address,response_destination:address}`

## WalletData
TLB: `_ balance:coins owner:address jetton:address jetton_wallet_code:^cell = WalletData`
Signature: `WalletData{balance:coins,owner:address,jetton:address,jetton_wallet_code:^cell}`

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
TLB: `skate_initiate_task_event#7560bbc5 query_id:uint64 user:address skate_app:address execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} = SkateInitiateTaskEvent`
Signature: `SkateInitiateTaskEvent{query_id:uint64,user:address,skate_app:address,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}}}`

## SkateInitiateTaskNotification
TLB: `skate_initiate_task_notification#3938aff1 query_id:uint64 user:address execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} = SkateInitiateTaskNotification`
Signature: `SkateInitiateTaskNotification{query_id:uint64,user:address,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}}}`

## SkateExecuteTask
TLB: `skate_execute_task#e46c5be4 query_id:uint64 target_app:address execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} relayer_signature:^slice = SkateExecuteTask`
Signature: `SkateExecuteTask{query_id:uint64,target_app:address,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}},relayer_signature:^slice}`

## RequestPlaceBet
TLB: `request_place_bet#2cc176fd candidate_id:uint8 direction:bool usd_amount:coins = RequestPlaceBet`
Signature: `RequestPlaceBet{candidate_id:uint8,direction:bool,usd_amount:coins}`

## BetConfig
TLB: `_ candidate_id:uint8 direction:bool = BetConfig`
Signature: `BetConfig{candidate_id:uint8,direction:bool}`

## SettleBet
TLB: `settle_bet#c4a35d45 settle_id:uint64 user:address fee_receiver:address usd_amount:coins = SettleBet`
Signature: `SettleBet{settle_id:uint64,user:address,fee_receiver:address,usd_amount:coins}`

## RequestSettleBet
TLB: `request_settle_bet#873b1472 candidate_id:uint8 direction:bool ct_amount:coins = RequestSettleBet`
Signature: `RequestSettleBet{candidate_id:uint8,direction:bool,ct_amount:coins}`

## SetJettonWallet
TLB: `set_jetton_wallet#77321783 jetton_wallet:address = SetJettonWallet`
Signature: `SetJettonWallet{jetton_wallet:address}`

## TopUpTON
TLB: `top_up_ton#75a6e8ec  = TopUpTON`
Signature: `TopUpTON{}`

## WithdrawTON
TLB: `withdraw_ton#44807e69  = WithdrawTON`
Signature: `WithdrawTON{}`

# Get Methods
Total Get Methods: 4

## queryId

## gateway

## jettonWallet

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
2340: PolyMarket::SetJettonWallet::Wallet is set
2543: PolyMarket::JettonTransferNotification::Bet size too small!
15264: PolyMarket::Not enough user fee!
17637: PolyMarket::JettonTransferNotification::Invalid candidate id!