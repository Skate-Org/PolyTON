import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, beginCell } from '@ton/core';
import '@ton/test-utils';
import { SkateGateway } from '../build/SkateGateway/tact_SkateGateway';
import { ed25519Sign } from './helpers';

describe('SkateGateway', () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let skateGateway: SandboxContract<SkateGateway>;
  const relayerPublicKey = BigInt('0x072aa6ab487813c8763e8564cf74356e351280cff6380bf28a845259a6e90433');
  const relayerPrivateKey = BigInt('0x276d3cc1884911f558e1add19222fe3576114825fa1fd67302b657e02ed8f96c');

  const relayer2PublicKey = BigInt('0x3469fe629307891974865a7e7444e2ca346d330a6afe40a7cc4b96e03da25b3e');
  const relayer2PrivateKey = BigInt('0xf9ddeb8472bd91440c250a06f7f05c8941b1d98bd2a5ac211eebd1d844bd3fe0');

  async function registerExecutor(key: string) {
    const executor = await blockchain.treasury(key);
    const result = await skateGateway.send(
      deployer.getSender(),
      {
        value: toNano('0.01'),
      },
      {
        $$type: 'SetExecutor',
        executor: executor.address,
      },
    );
    return {
      executor,
      result,
    };
  }

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    deployer = await blockchain.treasury('deployer');

    skateGateway = blockchain.openContract(await SkateGateway.fromInit(deployer.address, relayerPublicKey));

    const deployResult = await skateGateway.send(
      deployer.getSender(),
      {
        value: toNano('100'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      },
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      deploy: true,
      success: true,
    });
  });

  it('should deploy', async () => {
    // the check is done inside beforeEach
  });

  it('should init correctly', async () => {
    const relayer = await skateGateway.getRelayer();
    const owner = await skateGateway.getOwner();
    expect(relayer).toBe(relayerPublicKey);
    expect(owner.toString()).toEqual(deployer.address.toString());
  });

  it('should register executors', async () => {
    const { executor: executor0, result: setExecutor0Tx } = await registerExecutor('EXECUTOR_0');
    expect(setExecutor0Tx.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      success: true,
    });

    const { executor: executor1, result: setExecutor1Tx } = await registerExecutor('EXECUTOR_1');
    expect(setExecutor1Tx.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      success: true,
    });

    const executors = await skateGateway.getExecutors();
    expect(executors.size).toEqual(2);

    const executorKeys = executors
      .keys()
      .map((a) => a.toString())
      .sort();
    const expectedKeys = [executor0.address.toString(), executor1.address.toString()].sort();
    expect(executorKeys).toEqual(expectedKeys);
  });

  it('should revoke executors', async () => {
    const { executor: executor0 } = await registerExecutor('EXECUTOR_0');
    const { executor: executor1 } = await registerExecutor('EXECUTOR_1');
    const revokeExecutorTx = await skateGateway.send(
      deployer.getSender(),
      {
        value: toNano('0.01'),
      },
      {
        $$type: 'RevokeExecutor',
        executor: executor1.address,
      },
    );
    expect(revokeExecutorTx.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      success: true,
    });

    const executors = await skateGateway.getExecutors();
    expect(executors.size).toEqual(1);

    const executorKeys = executors
      .keys()
      .map((a) => a.toString())
      .sort();
    const expectedKeys = [executor0.address.toString()].sort();
    expect(executorKeys).toEqual(expectedKeys);
  });

  it('should change relayer', async () => {
    const msg = await skateGateway.getChangeRelayerMsg();
    const currentSignature = ed25519Sign(msg, relayerPrivateKey);
    const newSignature = ed25519Sign(msg, relayer2PrivateKey);

    const changeRelayerTx = await skateGateway.send(
      deployer.getSender(),
      {
        value: toNano('0.01'),
      },
      {
        $$type: 'ChangeRelayer',
        newRelayer: relayer2PublicKey,
        currentSignature: beginCell().storeBuffer(currentSignature, 64).endCell(),
        newSignature: beginCell().storeBuffer(newSignature, 64).endCell(),
      },
    );
    expect(changeRelayerTx.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      success: true,
    });

    const newRelayer = await skateGateway.getRelayer();
    expect(newRelayer).toEqual(relayer2PublicKey);
  });

  // NOTE: Task execution will be done in integration tests
});
