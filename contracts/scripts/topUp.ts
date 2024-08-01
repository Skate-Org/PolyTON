import { beginCell, SendMode, toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { GATEWAY_ADDRESS, POLYMARKET_ADDRESS, TESTNET_GATEWAY_ADDRESS, TESTNET_POLYMARKET_ADDRESS } from "./const";
import { Op as PolymarketOp } from "../wrappers/PolyMarket";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  const relayerKey = BigInt(`0x${process.env.RELAYER_PUBLIC_KEY!}`);
  if (!owner || !relayerKey) {
    throw "Missing deployer address or relayer key not specified";
  }
  const to = TESTNET_POLYMARKET_ADDRESS;

  await provider.sender().send({
    value: toNano("1"),
    to,
    sendMode: SendMode.PAY_GAS_SEPARATELY,
    body: beginCell().storeUint(PolymarketOp.top_up_TON, 32).storeUint(0, 64).endCell(),
  });
}
