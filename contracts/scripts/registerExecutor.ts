import { toNano } from "@ton/core";
import { SkateGateway } from "../wrappers/SkateGateway";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { GATEWAY_ADDRESS } from "./const";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const skateGateway = provider.open(SkateGateway.fromAddress(GATEWAY_ADDRESS));

  const EXECUTOR_ADDRSES = owner;

  await skateGateway.send(
    provider.sender(),
    {
      value: toNano("0.004"),
    },
    {
      $$type: "SetExecutor",
      executor: EXECUTOR_ADDRSES,
    },
  );
}
