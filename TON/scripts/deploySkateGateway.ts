import { toNano } from '@ton/core';
import { SkateGateway } from '../build/SkateGateway/tact_SkateGateway';
import { NetworkProvider } from '@ton/blueprint';
import "dotenv/config"

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  const relayerKey = BigInt(process.env.RELAYER_PUBLIC_KEY!);
  if (!owner || !relayerKey) {
    throw "Missing deployer address or relayer key not specified";
  }
  const skateGateway = provider.open(await SkateGateway.fromInit(owner, relayerKey));

  await skateGateway.send(
    provider.sender(),
    {
      value: toNano('0.05'),
    },
    {
      $$type: 'Deploy',
      queryId: 0n,
    }
  );

  await provider.waitForDeploy(skateGateway.address);
}
