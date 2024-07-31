import { Blockchain, SandboxContract, SendMessageResult, TreasuryContract } from "@ton/sandbox";
import { toNano, beginCell, Cell } from "@ton/core";
import "@ton/test-utils";
import { bigintToHash, ed25519Sign, sha256 } from "./helpers";
import {
  ExecutionInfo,
  loadSkateInitiateTaskEvent,
  Payload,
  SkateExecuteTask,
  SkateGateway,
  SkateInitiateTaskNotification,
  storeDestination,
  ExitCode as SkateGateway_ExitCode,
  Op as SkateGateway_Op,
} from "../wrappers/SkateGateway";
import { storeRequestPlaceBet } from "../build/PolyMarket/tact_PolyMarket";

describe("SkateGateway", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let skateGateway: SandboxContract<SkateGateway>;
  let mockApp: SandboxContract<TreasuryContract>;
  const relayerPublicKey = BigInt("0x072aa6ab487813c8763e8564cf74356e351280cff6380bf28a845259a6e90433");
  const relayerPrivateKey = BigInt("0x276d3cc1884911f558e1add19222fe3576114825fa1fd67302b657e02ed8f96c");

  let registerExecutor: (key: string) => Promise<{
    executor: SandboxContract<TreasuryContract>;
    result: SendMessageResult & {
      result: void;
    };
  }>;

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    mockApp = await blockchain.treasury("MockApp");
    deployer = await blockchain.treasury("deployer");

    const hashedMsg = sha256("DeployGateway");
    const bufSignature = ed25519Sign(hashedMsg, relayerPrivateKey);
    const signature = beginCell().storeBuffer(bufSignature, 64).endCell();
    skateGateway = blockchain.openContract(await SkateGateway.fromInit(deployer.address, relayerPublicKey, signature));
    const deployResult = await skateGateway.send(
      deployer.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    );
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      deploy: true,
      success: true,
    });

    registerExecutor = async (key: string) => {
      const executor = await blockchain.treasury(key);
      const result = await skateGateway.send(
        deployer.getSender(),
        { value: toNano("0.01") },
        { $$type: "SetExecutor", executor: executor.address },
      );
      return {
        executor,
        result,
      };
    };
  });

  it("should deploy", async () => {
    // the check is done inside beforeEach
  });

  it("should init correctly", async () => {
    const relayer = await skateGateway.getRelayer();
    const owner = await skateGateway.getOwner();
    expect(relayer).toBe(relayerPublicKey);
    expect(owner.toString()).toEqual(deployer.address.toString());
  });

  it("should register executors", async () => {
    const { executor: executor0, result: setExecutor0Tx } = await registerExecutor("EXECUTOR_0");
    expect(setExecutor0Tx.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      success: true,
    });

    const { executor: executor1, result: setExecutor1Tx } = await registerExecutor("EXECUTOR_1");
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

  it("should revoke executors", async () => {
    const { executor: executor0 } = await registerExecutor("EXECUTOR_0");
    const { executor: executor1 } = await registerExecutor("EXECUTOR_1");
    const revokeExecutorTx = await skateGateway.send(
      deployer.getSender(),
      {
        value: toNano("0.01"),
      },
      {
        $$type: "RevokeExecutor",
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

  it("should change relayer", async () => {
    const msg = await skateGateway.getChangeRelayerMsg();
    const hashedMsg = sha256(msg);
    const relayer2PublicKey = BigInt("0x3469fe629307891974865a7e7444e2ca346d330a6afe40a7cc4b96e03da25b3e");
    const relayer2PrivateKey = BigInt("0xf9ddeb8472bd91440c250a06f7f05c8941b1d98bd2a5ac211eebd1d844bd3fe0");
    const currentSignature = ed25519Sign(hashedMsg, relayerPrivateKey);
    const newSignature = ed25519Sign(hashedMsg, relayer2PrivateKey);

    const changeRelayerTx = await skateGateway.send(
      deployer.getSender(),
      {
        value: toNano("100"),
      },
      {
        $$type: "ChangeRelayer",
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

  ////////////////////////////////////////////////////////////////////////////
  ///////////////////////// TASK PROCESSING //////////////////////////////////

  ////// INITIATE TASK //////
  it("should receive task initiation request", async () => {
    const mockData = beginCell()
      .store(
        storeRequestPlaceBet({
          $$type: "RequestPlaceBet",
          candidate_id: 1n,
          direction: true,
          usd_amount: toNano("1"),
        }),
      )
      .endCell();
    const destination = beginCell()
      .store(
        storeDestination({
          $$type: "Destination",
          address: 0n,
          chain_id: 137n,
          chain_type: 0n,
        }),
      )
      .endCell();
    const mockInitiateTask: SkateInitiateTaskNotification = {
      $$type: "SkateInitiateTaskNotification",
      query_id: 0n,
      user: deployer.address,
      execution_info: {
        $$type: "ExecutionInfo",
        payload: {
          $$type: "Payload",
          destination: destination,
          data: mockData,
        },
        expiration: BigInt(Math.round(new Date().getTime() / 1000)),
        value: toNano("1"),
      },
    };
    const mockApp = await blockchain.treasury("MockAddress");

    const initiateTaskTx = await skateGateway.send(
      mockApp.getSender(),
      {
        value: toNano("0.2"),
      },
      mockInitiateTask,
    );
    expect(initiateTaskTx.transactions).toHaveTransaction({
      from: mockApp.address,
      to: skateGateway.address,
      success: true,
      op: SkateGateway_Op.initiate_task_notification,
    });

    expect(initiateTaskTx.externals).toHaveLength(1);
    const eventSlice = initiateTaskTx.externals[0].body.asSlice();
    const task = loadSkateInitiateTaskEvent(eventSlice);
    expect(task.query_id).toEqual(mockInitiateTask.query_id);
    expect(task.user.equals(mockInitiateTask.user)).toEqual(true);
    expect(task.execution_info.value).toEqual(mockInitiateTask.execution_info.value);
    expect(task.execution_info.expiration).toEqual(mockInitiateTask.execution_info.expiration);
    expect(task.execution_info.payload.destination.hash().toString("hex")).toEqual(
      mockInitiateTask.execution_info.payload.destination.hash().toString("hex"),
    );
    expect(task.execution_info.payload.data.hash().toString("hex")).toEqual(
      mockInitiateTask.execution_info.payload.data.hash().toString("hex"),
    );
  });

  ////// EXECUTE TASK //////
  async function callExecuteTask({
    relayerSig,
    data,
    forward_amount,
    destination,
    executor,
  }: {
    relayerSig?: Buffer;
    data?: Cell;
    forward_amount: bigint; // as coins < 10 ton
    destination?: Cell;
    executor?: SandboxContract<TreasuryContract>;
  }) {
    if (forward_amount >= toNano("1")) {
      throw new Error("callExecuteTask()::Forward amount too large, change this function");
    }
    const mockExecutor = executor ?? (await blockchain.treasury("MockExecutor"));
    const mockData = beginCell()
      .store(
        storeRequestPlaceBet({
          $$type: "RequestPlaceBet",
          candidate_id: 1n,
          direction: true,
          usd_amount: toNano("1"),
        }),
      )
      .endCell();
    // const mockDestination = beginCell().endCell();
    const mockDestination = beginCell()
      .store(
        storeDestination({
          $$type: "Destination",
          address: 0n,
          chain_id: 137n,
          chain_type: 0n,
        }),
      )
      .endCell();

    const payload: Payload = {
      $$type: "Payload",
      destination: destination ?? mockDestination,
      data: data ?? mockData,
    };
    const execution_info: ExecutionInfo = {
      $$type: "ExecutionInfo",
      payload,
      expiration: BigInt(Math.round(new Date().getTime() / 1000)),
      value: forward_amount, // NOTE: amount forward to
    };
    const msg_hash = await skateGateway.getPayloadHash(payload);
    const signature = relayerSig ?? ed25519Sign(bigintToHash(msg_hash), relayerPrivateKey);
    // const hashedMsg = sha256("hello");
    // const signature = ed25519Sign(hashedMsg, relayerPrivateKey);

    const mockExecuteTask: SkateExecuteTask = {
      $$type: "SkateExecuteTask",
      query_id: 0n,
      target_app: mockApp.address,
      execution_info,
      relayer_signature: beginCell().storeBuffer(signature, 64).endCell(),
    };
    const executeTaskTx = await skateGateway.send(
      mockExecutor.getSender(),
      {
        value: toNano("10"),
      },
      mockExecuteTask,
    );

    return {
      executor: executor ?? mockExecutor,
      payload,
      tx: executeTaskTx,
    };
  }

  it("should execute task", async () => {
    const { executor: executor0 } = await registerExecutor("EXECUTOR_0");
    const forward_amount = toNano("0.5");
    const { tx: executeTaskTx } = await callExecuteTask({ executor: executor0, forward_amount });
    expect(executeTaskTx.transactions).toHaveTransaction({
      from: executor0.address,
      to: skateGateway.address,
      op: SkateGateway_Op.execute_task,
      success: true,
      exitCode: 0,
    });

    expect(executeTaskTx.transactions).toHaveTransaction({
      from: skateGateway.address,
      to: mockApp.address,
      value: forward_amount,
      success: true,
      exitCode: 0,
    });
  });

  it("should reject execution if not executor", async () => {
    const relayerSig = ed25519Sign(sha256("Corrupted MSG"), relayerPrivateKey);
    const { executor: executor0 } = await registerExecutor("EXECUTOR_0");
    const forward_amount = toNano("0.05");
    const { tx: executeTaskTx } = await callExecuteTask({ relayerSig, executor: executor0, forward_amount });
    expect(executeTaskTx.transactions).toHaveTransaction({
      from: executor0.address,
      to: skateGateway.address,
      success: false,
      op: SkateGateway_Op.execute_task,
      exitCode: SkateGateway_ExitCode.ValidateRelayerSignature_InvalidRelayerSignature, // Invalid signature -> not allowed
    });

    expect(executeTaskTx.transactions).not.toHaveTransaction({
      from: skateGateway.address,
      to: mockApp.address,
      value: forward_amount,
      success: true,
      exitCode: 0,
    });
  });

  it("should reject execution without valid signature", async () => {
    const relayerSig = ed25519Sign(sha256("Corrupted MSG"), relayerPrivateKey);
    const { executor: executor0 } = await registerExecutor("EXECUTOR_0");
    const forward_amount = toNano("0.05");
    const { tx: executeTaskTx } = await callExecuteTask({ relayerSig, executor: executor0, forward_amount });
    expect(executeTaskTx.transactions).toHaveTransaction({
      from: executor0.address,
      to: skateGateway.address,
      success: false,
      op: SkateGateway_Op.execute_task,
      exitCode: SkateGateway_ExitCode.ValidateRelayerSignature_InvalidRelayerSignature, // Invalid signature -> not allowed
    });

    expect(executeTaskTx.transactions).not.toHaveTransaction({
      from: skateGateway.address,
      to: mockApp.address,
      value: forward_amount,
      success: true,
      exitCode: 0,
    });
  });
});
