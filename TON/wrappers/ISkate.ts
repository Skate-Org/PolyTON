export abstract class Op {
  static initiate_task_notification = 0xe3db123b; // crc32(op::skate_initiate_task_notification)
  static execute_task = 0xe8b8b601; // crc32(op::skate_execute_task)
}

// NOTE: code generation algorithm: https://docs.tact-lang.org/ref/core-debug#require
export abstract class ExitCode {
  static SkateInitiateTaskNotification_NotEnoughProcessingFee = 6808;
  static ValidateRelayerSignature_InvalidRelayerSignature = 10580;
  static SkateExecuteTask_TaskExpired = 45396;
  static SetRelayer_NotApprovedByNewRelayer = 48599;
}
