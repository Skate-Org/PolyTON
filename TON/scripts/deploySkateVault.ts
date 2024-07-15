import { toNano } from '@ton/core';
import { SkateVault } from '../wrappers/SkateVault';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const skateVault = provider.open(await SkateVault.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await skateVault.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(skateVault.address);

    console.log('ID', await skateVault.getId());
}
