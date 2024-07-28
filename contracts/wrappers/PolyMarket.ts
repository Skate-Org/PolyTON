///// TL-B + Signature
// ## SettleBet
// TLB: `settle_bet#c4a35d45 settle_id:uint64 user:address fee_receiver:address usd_amount:coins = SettleBet`
// Signature: `SettleBet{settle_id:uint64,user:address,fee_receiver:address,usd_amount:coins}`
//
// ## RequestSettleBet
// TLB: `request_settle_bet#873b1472 candidate_id:uint8 direction:bool ct_amount:coins = RequestSettleBet`
// Signature: `RequestSettleBet{candidate_id:uint8,direction:bool,ct_amount:coins}`
//
// ## SetJettonWallet
// TLB: `set_jetton_wallet#77321783 jetton_wallet:address = SetJettonWallet`
// Signature: `SetJettonWallet{jetton_wallet:address}`

export abstract class Op {
  static request_place_bet = 0x2cc176fd;
  static request_settle_bet = 0x873b1472;
  static settle_bet = 0xc4a35d45;
  static set_jetton_wallet = 0x77321783;
  static top_up_TON = 0x75a6e8ec;
}

// NOTE: code generation algorithm: https://docs.tact-lang.org/ref/core-debug#require
export abstract class ExitCode {
  static JettonTransferNotification_BetSizeTooSmall = 2543;
  static JettonTransferNotification_InvalidCandidateId = 17637;
  static SetJettonWallet_WalletIsSet = 2340;
  static NotEnoughUserFee = 15264;
}

export * from "../build/PolyMarket/tact_PolyMarket";
