import "dotenv/config";
import { PolyMarket } from "../wrappers/PolyMarket";
import { GATEWAY_ADDRESS, POLYMARKET_ADDRESS, TESTNET_POLYMARKET_ADDRESS } from "../scripts/const";
import { TonClient } from "@ton/ton";
import "dotenv/config";

async function main() {
  const client = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    apiKey: process.env.TESTNET_API_KEY,
  });

  const polyMarket = client.open(PolyMarket.fromAddress(TESTNET_POLYMARKET_ADDRESS));

  console.log("Polymarket address", POLYMARKET_ADDRESS.toRawString());
  console.log("Gateway address", GATEWAY_ADDRESS.toRawString());
  console.log("zptPIGO7SLd3H910DEsrsFju7iaNP71P5Juq5mZlw2I=");

  const gateway = await polyMarket.getGateway();
  console.log(gateway.toString());

  const marketWallet = await polyMarket.getJettonWallet();
  console.log(marketWallet.toString());
}

main();
