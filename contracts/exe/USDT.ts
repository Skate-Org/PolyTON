import { address, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { PolyMarket } from "../wrappers/PolyMarket";
import { GATEWAY_ADDRESS, POLYMARKET_ADDRESS, USDT_ADDRSES } from "../scripts/const";
import { JettonMaster } from "../wrappers/JettonMaster";
import { TonClient } from "@ton/ton";
import "dotenv/config"

async function main() {
  const tonClient = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: process.env.MAINNET_API_KEY,
  });

  const polyMarket = tonClient.open(PolyMarket.fromAddress(POLYMARKET_ADDRESS));

  const gateway = await polyMarket.getGateway();
  console.log(gateway.toString())

  const marketWallet = await polyMarket.getJettonWallet();
  console.log(marketWallet.toString())

  const user = address("UQBMy8HvDuAAsLRdgnCV1b80iw6815zxLpiPSlt4c9zp8UMV");

  const mockUSDT = tonClient.open(JettonMaster.createFromAddress(USDT_ADDRSES));
  const userWallet = await mockUSDT.getWalletAddress(user);
  console.log(userWallet.toString())

  // const owner = provider.sender().address;
  // if (!owner) {
  //   throw "Missing deployer address or relayer key not specified";
  // }
  // const polyMarket = provider.open(await PolyMarket.fromInit(owner, GATEWAY_ADDRESS));
  //
  // await polyMarket.send(
  //   provider.sender(),
  //   { value: toNano("0.01") },
  //   { $$type: "Deploy", queryId: 0n },
  // );
  //
  // await provider.waitForDeploy(polyMarket.address);
  // const mockUSDT = provider.open(JettonMaster.createFromAddress(USDT_ADDRSES));
  // const marketUSDTWallet = await mockUSDT.getWalletAddress(polyMarket.address);
  //
  // await polyMarket.send(
  //   provider.sender(),
  //   {
  //     value: toNano("0.005"),
  //   },
  //   {
  //     $$type: "SetJettonWallet",
  //     jetton_wallet: marketUSDTWallet,
  //   },
  // );
}

main()
