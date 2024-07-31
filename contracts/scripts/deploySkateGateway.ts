import { toNano, beginCell } from "@ton/core";
import { SkateGateway } from "../build/SkateGateway/tact_SkateGateway";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { sha256 } from "./helpers/convert";
import { ed25519Sign } from "./helpers/crypto";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  const relayerKey = BigInt(`0x${process.env.RELAYER_PUBLIC_KEY!}`);
  const relayerPrivateKey = BigInt(`0x${process.env.RELAYER_PRIVATE_KEY!}`);
  if (!owner || !relayerKey) {
    throw "Missing deployer address or relayer key not specified";
  }
  const hashedMsg = sha256("DeployGateway");
  const bufSignature = await ed25519Sign(hashedMsg, relayerPrivateKey);
  const signature = beginCell().storeBuffer(bufSignature, 64).endCell();
  const skateGateway = provider.open(await SkateGateway.fromInit(owner, relayerKey, signature));

  await skateGateway.send(
    provider.sender(),
    {
      value: toNano("0.005"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  );

  await provider.waitForDeploy(skateGateway.address);
}
