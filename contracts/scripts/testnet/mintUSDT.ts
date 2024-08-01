import { address, toNano } from "@ton/core";
import { JettonMaster } from "../../wrappers/JettonMaster";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { TESTNET_USDT_ADDRESS, TESTNET_POLYMARKET_ADDRESS } from "../const";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }

  const mockUSDT = provider.open(JettonMaster.createFromAddress(TESTNET_USDT_ADDRESS));

  // const to = address("UQDx8RdK6nH0VfSynD7pyPXCCjWJOBoff7K0YWkzg-C68qIS");
  const to = TESTNET_POLYMARKET_ADDRESS;

  await mockUSDT.sendMint(provider.sender(), to, toNano("10000"), null, null, null, toNano("0"), toNano("0.1"));
}
