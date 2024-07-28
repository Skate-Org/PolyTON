import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { polyMarketAddress } from "./const";
import { PolyMarket, RequestSettleBet } from "../wrappers/PolyMarket";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }

  const polyMarket = provider.open(
    PolyMarket.fromAddress(
      polyMarketAddress
    ),
  );

  const settleRequest: RequestSettleBet = {
    $$type: "RequestSettleBet",
    candidate_id: 1n, // TRUMP
    direction: true, // YES
    ct_amount: toNano("1"), // 1000 ct_token, 6 decimal places to match USDT
  };

  await polyMarket.send(
    provider.sender(),
    {
      value: toNano("0.2"),
    },
    settleRequest,
  );
}
