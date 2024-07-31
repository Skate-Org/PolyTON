import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { PolyMarket } from "../wrappers/PolyMarket";
import { GATEWAY_ADDRESS, USDT_ADDRSES, TESTNET_GATEWAY_ADDRESS, TESTNET_USDT_ADDRESS } from "./const";
import { JettonMaster } from "../wrappers/JettonMaster";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const polyMarket = provider.open(await PolyMarket.fromInit(owner, GATEWAY_ADDRESS));

  await polyMarket.send(
    provider.sender(),
    { value: toNano("0.01") },
    { $$type: "Deploy", queryId: 0n },
  );

  await provider.waitForDeploy(polyMarket.address);
  const mockUSDT = provider.open(JettonMaster.createFromAddress(USDT_ADDRSES));
  const marketUSDTWallet = await mockUSDT.getWalletAddress(polyMarket.address);

  await polyMarket.send(
    provider.sender(),
    {
      value: toNano("0.005"),
    },
    {
      $$type: "SetJettonWallet",
      jetton_wallet: marketUSDTWallet,
    },
  );
}
