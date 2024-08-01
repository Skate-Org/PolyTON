import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { PolyMarket } from "../wrappers/PolyMarket";
import { POLYMARKET_ADDRESS, USDT_ADDRSES } from "./const";
import { JettonMaster } from "../wrappers/JettonMaster";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const polyMarket = provider.open(PolyMarket.fromAddress(POLYMARKET_ADDRESS));
  const mockUSDT = provider.open(JettonMaster.createFromAddress(USDT_ADDRSES));
  const marketUSDTWallet = await mockUSDT.getWalletAddress(POLYMARKET_ADDRESS);

  await polyMarket.send(
    provider.sender(),
    {
      value: toNano("0.2"),
    },
    {
      $$type: "SetJettonWallet",
      jetton_wallet: marketUSDTWallet,
    },
  );
}
