///// TL-B + Signature
// ## SkateInitiateTaskNotification
// TLB: `skate_initiate_task_notification#3938aff1 query_id:uint64 user:address execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} = SkateInitiateTaskNotification`
// Signature: `SkateInitiateTaskNotification{query_id:uint64,user:address,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}}}`
//
// ## SkateExecuteTask
// TLB: `skate_execute_task#e46c5be4 query_id:uint64 target_app:address execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}} relayer_signature:^slice = SkateExecuteTask`
// Signature: `SkateExecuteTask{query_id:uint64,target_app:address,execution_info:ExecutionInfo{value:coins,expiration:uint32,payload:Payload{destination:^cell,data:^cell}},relayer_signature:^slice}`
//
// ## ChangeRelayer
// TLB: `change_relayer#edf05063 newRelayer:int257 currentSignature:^slice newSignature:^slice = ChangeRelayer`
// Signature: `ChangeRelayer{newRelayer:int257,currentSignature:^slice,newSignature:^slice}`
//
// ## SetExecutor
// TLB: `set_executor#c8c28f2d executor:address = SetExecutor`
// Signature: `SetExecutor{executor:address}`
//
// ## RevokeExecutor
// TLB: `revoke_executor#471c2809 executor:address = RevokeExecutor`
// Signature: `RevokeExecutor{executor:address}`

export abstract class Op {
  static initiate_task_notification = 0x3938aff1;
  static execute_task = 0xe46c5be4;
  static change_relayer = 0xedf05063;
  static set_executor = 0xc8c28f2d;
  static revoke_executor = 0x471c2809;
  static top_up_TON = 0x75a6e8ec;
  static initiate_task_event = 0x7560bbc5;
}

// NOTE: code generation algorithm: https://docs.tact-lang.org/ref/core-debug#require
export abstract class ExitCode {
  static SkateInitiateTaskNotification_NotEnoughProcessingFee = 6808;
  static ValidateRelayerSignature_InvalidRelayerSignature = 10580;
  static SkateExecuteTask_TaskExpired = 45396;
  static SetRelayer_NotApprovedByNewRelayer = 48599;
}

export * from "./build/SkateGateway/tact_SkateGateway";
