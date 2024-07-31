import { toNano } from "@ton/core";
import { SkateGateway } from "../build/SkateGateway/tact_SkateGateway";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { TESTNET_GATEWAY_ADDRESS } from "./const";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const skateGateway = provider.open(SkateGateway.fromAddress(TESTNET_GATEWAY_ADDRESS));

  const EXECUTOR_ADDRSES = owner;

  await skateGateway.send(
    provider.sender(),
    {
      value: toNano("0.00383"),
    },
    {
      $$type: "SetExecutor",
      executor: EXECUTOR_ADDRSES,
    },
  );
}
