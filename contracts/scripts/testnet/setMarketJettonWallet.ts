import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { PolyMarket } from "../../wrappers/PolyMarket";
import { TESTNET_USDT_ADDRESS, TESTNET_POLYMARKET_ADDRESS } from "../const";
import { JettonMaster } from "../../wrappers/JettonMaster";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const polyMarket = provider.open(PolyMarket.fromAddress(TESTNET_POLYMARKET_ADDRESS));

  const mockUSDT = provider.open(JettonMaster.createFromAddress(TESTNET_USDT_ADDRESS));

  const marketUSDTWallet = await mockUSDT.getWalletAddress(TESTNET_POLYMARKET_ADDRESS);

  await polyMarket.send(
    provider.sender(),
    {
      value: toNano("0.1"),
    },
    {
      $$type: "SetJettonWallet",
      jetton_wallet: marketUSDTWallet,
    },
  );
}
