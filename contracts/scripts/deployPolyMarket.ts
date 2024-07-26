import { toNano } from "@ton/core";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { PolyMarket } from "../wrappers/PolyMarket";
import { gatewayAddress } from "./const";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const polyMarket = provider.open(await PolyMarket.fromInit(owner, gatewayAddress));

  await polyMarket.send(
    provider.sender(),
    {
      value: toNano("2"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  );

  await provider.waitForDeploy(polyMarket.address);
}
