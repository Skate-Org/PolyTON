export abstract class Op {
  static settle_bet = 0xf85a5fcd; // crc32(op::skate_initiate_task_notification)
  static request_settle_bet = 0x8059bac7; // crc32(op::skate_execute_task)
}
