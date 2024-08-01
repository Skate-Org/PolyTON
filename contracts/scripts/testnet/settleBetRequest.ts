import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { TESTNET_POLYMARKET_ADDRESS } from "../const";
import { PolyMarket, RequestSettleBet } from "../../wrappers/PolyMarket";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }

  const polyMarket = provider.open(PolyMarket.fromAddress(TESTNET_POLYMARKET_ADDRESS));

  const settleRequest: RequestSettleBet = {
    $$type: "RequestSettleBet",
    candidate_id: 1n, // TRUMP
    direction: true, // YES
    ct_amount: toNano("100"), // 100_000 shares, 6 decimal places to match USDT
  };

  await polyMarket.send(
    provider.sender(),
    {
      value: toNano("0.008"),
    },
    settleRequest,
  );
}
