import { Address, beginCell, toNano } from "@ton/core";
import { JettonMaster } from "../wrappers/JettonMaster";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { mockUSDTAddress, polyMarketAddress } from "./const";
import { BetConfig, storeBetConfig } from "../wrappers/PolyMarket";
import { JettonWallet } from "../wrappers/JettonWallet";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }

  const mockUSDT = provider.open(JettonMaster.createFromAddress(mockUSDTAddress));
  // NOTE: user
  // const to = address("0QBuMAzv90ZXWm2JRgMO0Hr2StP4dsy-Gb7ygeizxYBp3jmU");

  const getUSDTWallet = async (address: Address) =>
    provider.open(JettonWallet.createFromAddress(await mockUSDT.getWalletAddress(address)));
  const userUSDTWallet = await getUSDTWallet(owner);

  const betAmount = toNano("1"); // 1000 USDT, since decimal is 6
  // const betCell = beginCell().storeUint(newBet.candidate_id, 8).storeBit(newBet.direction).endCell();
  const newBet: BetConfig = {
    $$type: "BetConfig",
    candidate_id: 1n, // TRUMP
    direction: true, // YES
  };
  const betSlice = beginCell().store(storeBetConfig(newBet)).endCell().asSlice();
  await userUSDTWallet.sendTransfer(
    provider.sender(),
    toNano("0.02"), // NOTE: this consume gas on USDT wallet, Skate will rebate
    betAmount,
    polyMarketAddress,
    owner,
    null, // payload for USDT wallet, skip
    toNano("0.01"),
    betSlice,
  );
}
