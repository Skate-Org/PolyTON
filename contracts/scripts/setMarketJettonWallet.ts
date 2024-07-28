import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { PolyMarket } from "../wrappers/PolyMarket";
import { mockUSDTAddress, polyMarketAddress } from "./const";
import { JettonMaster } from "../wrappers/JettonMaster";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const polyMarket = provider.open(PolyMarket.fromAddress(polyMarketAddress));

  const mockUSDT = provider.open(JettonMaster.createFromAddress(mockUSDTAddress));

  const marketUSDTWallet = await mockUSDT.getWalletAddress(polyMarketAddress);

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
