import { toNano } from "@ton/core";
import { SkateGateway } from "../build/SkateGateway/tact_SkateGateway";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { gatewayAddress } from "./const";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const skateGateway = provider.open(SkateGateway.fromAddress(gatewayAddress));

  const newExecutorAddress = owner;

  await skateGateway.send(
    provider.sender(),
    {
      value: toNano("0.02"),
    },
    {
      $$type: "SetExecutor",
      executor: newExecutorAddress,
    },
  );
}
