import { Address, beginCell, toNano } from "@ton/core";
import { JettonMaster } from "../wrappers/JettonMaster";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { POLYMARKET_ADDRESS, USDT_ADDRSES } from "./const";
import { BetConfig, storeBetConfig } from "../wrappers/PolyMarket";
import { JettonWallet } from "../wrappers/JettonWallet";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }

  const mockUSDT = provider.open(JettonMaster.createFromAddress(USDT_ADDRSES));
  // NOTE: user
  // const to = address("0QBuMAzv90ZXWm2JRgMO0Hr2StP4dsy-Gb7ygeizxYBp3jmU");

  const getUSDTWallet = async (address: Address) =>
    provider.open(JettonWallet.createFromAddress(await mockUSDT.getWalletAddress(address)));
  const userUSDTWallet = await getUSDTWallet(owner);

  const betAmount = toNano("0.0001"); // 0.1 USDT, since decimal is 6
  // const betCell = beginCell().storeUint(newBet.candidate_id, 8).storeBit(newBet.direction).endCell();
  const newBet: BetConfig = {
    $$type: "BetConfig",
    candidate_id: 1n, // TRUMP
    direction: true, // YES
  };
  const betSlice = beginCell().store(storeBetConfig(newBet)).endCell().asSlice();
  await userUSDTWallet.sendTransfer(
    provider.sender(),
    toNano("0.018"),
    betAmount,
    POLYMARKET_ADDRESS,
    owner,
    null, // payload for USDT wallet, skip
    toNano("0.008"),
    betSlice,
  );
}
