import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, beginCell, Cell, Dictionary } from '@ton/core';
import '@ton/test-utils';
import { PolyMarket } from '../build/PolyMarket/tact_PolyMarket';

describe('PolyMarket', () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let polyMarket: SandboxContract<PolyMarket>;
  let relayerPublicKey = BigInt('0x072aa6ab487813c8763e8564cf74356e351280cff6380bf28a845259a6e90433');

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    deployer = await blockchain.treasury('deployer');

    polyMarket = blockchain.openContract(await PolyMarket.fromInit(deployer.address, relayerPublicKey));

    const deployResult = await polyMarket.send(
      deployer.getSender(),
      {
        value: toNano('0.1'),
      },
      {
        // @ts-ignore
        $$type: 'Deploy',
        queryId: 0n,
      },
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: polyMarket.address,
      deploy: true,
      success: true,
    });
  });

  it('should deploy', async () => {
    // the check is done inside beforeEach
    // blockchain and skateGateway are ready to use
  });
});
