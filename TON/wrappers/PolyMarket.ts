export abstract class Op {
  static settle_bet = 0x6495fd23;
  static request_settle_bet = 0x873b1472;
  static set_jetton_wallet = 0x77321783;
}

// NOTE: code generation algorithm: https://docs.tact-lang.org/ref/core-debug#require
export abstract class ExitCode {
  static JettonTransferNotification_BetSizeTooSmall = 2543;
  static JettonTransferNotification_InvalidCandidateId = 17637;
  static SetJettonWallet_WalletIsSet = 2340;
  // static SettleBet_InvalidChainId = 17251;
  // static SettleBet_InvalidChainType = 53691;
  // static SettleBet_InvalidAddress = 39082;
}
