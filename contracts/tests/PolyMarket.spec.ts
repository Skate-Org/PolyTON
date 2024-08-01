import "@ton/test-utils";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano, beginCell, Dictionary, Cell, Address } from "@ton/core";
import { compile } from "@ton/blueprint";

import {
  loadDestination,
  loadSkateInitiateTaskEvent,
  storeDestination,
  Payload,
  ExecutionInfo,
  SkateExecuteTask,
  SkateGateway,
  Destination,
  Op as SkateOp,
} from "../wrappers/SkateGateway";
import { JettonMaster, JettonMasterContent } from "../wrappers/JettonMaster";
import { JettonWallet } from "../wrappers/JettonWallet";
import { Op as JettonOp } from "../wrappers/JettonConstants";
import {
  loadRequestPlaceBet,
  loadRequestSettleBet,
  RequestSettleBet,
  BetConfig,
  PolyMarket,
  storeBetConfig,
  storeSettleBet,
  Op as PolyMarketOp,
} from "../wrappers/PolyMarket";
import { bigintToHash, ed25519Sign, sha256 } from "./helpers";

describe("PolyMarket", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let polyMarket: SandboxContract<PolyMarket>;
  let mockUSDT: SandboxContract<JettonMaster>;
  let skateGateway: SandboxContract<SkateGateway>;
  let executor: SandboxContract<TreasuryContract>;

  // PolyMarket user
  let user: SandboxContract<TreasuryContract>;
  let getUSDTWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>;

  const relayerPublicKey = BigInt("0x072aa6ab487813c8763e8564cf74356e351280cff6380bf28a845259a6e90433");
  const relayerPrivateKey = BigInt("0x276d3cc1884911f558e1add19222fe3576114825fa1fd67302b657e02ed8f96c");
  const POLYMARKET_CTF = BigInt("0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E");
  const initialMarketUSDTBalance = toNano("100000000");

  async function mintUSDT(to: Address, amount = toNano("1000")) {
    // 1 million USDT
    //// 1. Mint USDT to user
    const mintTx = await mockUSDT.sendMint(
      deployer.getSender(),
      to,
      amount,
      null,
      null,
      null,
      toNano("0.1"),
      toNano("1"),
    );
    const userUSDTWallet = await getUSDTWallet(to);
    expect(mintTx.transactions).toHaveTransaction({
      from: mockUSDT.address,
      deploy: true,
      to: userUSDTWallet.address,
      success: true,
    });
    const balance0 = await userUSDTWallet.getJettonBalance();
    expect(balance0).toEqual(amount);

    return userUSDTWallet;
  }

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    deployer = await blockchain.treasury("Deployer");
    user = await blockchain.treasury("User");

    // Create USDT
    const usdtMasterCode = await compile("JettonMaster");
    const walletCodeRaw = await compile("JettonWallet");
    const jetton_content: JettonMasterContent = { uri: "https://tether.to/usdt-ton.json" };
    const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
    _libs.set(BigInt(`0x${walletCodeRaw.hash().toString("hex")}`), walletCodeRaw);
    const libs = beginCell().storeDictDirect(_libs).endCell();
    blockchain.libs = libs;
    let lib_prep = beginCell().storeUint(2, 8).storeBuffer(walletCodeRaw.hash()).endCell();
    const wallet_code = new Cell({ exotic: true, bits: lib_prep.bits, refs: lib_prep.refs });
    mockUSDT = blockchain.openContract(
      JettonMaster.createFromConfig(
        {
          admin: deployer.address,
          wallet_code,
          jetton_content,
        },
        usdtMasterCode,
      ),
    );
    getUSDTWallet = async (address: Address) =>
      blockchain.openContract(JettonWallet.createFromAddress(await mockUSDT.getWalletAddress(address)));
    const deployResult = await mockUSDT.sendDeploy(deployer.getSender(), toNano("10"));
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: mockUSDT.address,
      deploy: true,
      success: true,
    });

    // Deploy gateway
    const hashedMsg = sha256("DeployGateway");
    const bufSignature = ed25519Sign(hashedMsg, relayerPrivateKey);
    const signature = beginCell().storeBuffer(bufSignature, 64).endCell();
    skateGateway = blockchain.openContract(await SkateGateway.fromInit(deployer.address, relayerPublicKey, signature));
    const gwDeployResult = await skateGateway.send(
      deployer.getSender(),
      { value: toNano("10000") },
      { $$type: "Deploy", queryId: 0n },
    );
    expect(gwDeployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      deploy: true,
      success: true,
    });

    // Register executor
    executor = await blockchain.treasury("Executor");
    await skateGateway.send(
      deployer.getSender(),
      { value: toNano("0.01") },
      { $$type: "SetExecutor", executor: executor.address },
    );

    // Create polymarket
    polyMarket = blockchain.openContract(await PolyMarket.fromInit(deployer.address, skateGateway.address));
    const pmDeployResult = await polyMarket.send(
      deployer.getSender(),
      { value: toNano("1000") },
      { $$type: "Deploy", queryId: 0n },
    );
    expect(pmDeployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: polyMarket.address,
      deploy: true,
      success: true,
    });
    // fund polymarket
    const polyMarketUSDTWallet = await mintUSDT(polyMarket.address, initialMarketUSDTBalance);
    const setJettonTx = await polyMarket.send(
      deployer.getSender(),
      { value: toNano("0.1") },
      { $$type: "SetJettonWallet", jetton_wallet: polyMarketUSDTWallet.address },
    );
    expect(setJettonTx.transactions).toHaveTransaction({
      from: deployer.address,
      to: polyMarket.address,
      op: PolyMarketOp.set_jetton_wallet,
      success: true,
    });
    const balance = await polyMarketUSDTWallet.getJettonBalance();
    expect(balance).toEqual(initialMarketUSDTBalance);
  });

  it("should deploy", async () => {
    // the check is done inside beforeEach
    // blockchain and skateGateway are ready to use
  });

  // function mintJetton

  it("should init correctly", async () => {
    const owner = await polyMarket.getOwner();
    expect(owner.toString()).toEqual(deployer.address.toString());

    const gateway = await polyMarket.getGateway();
    expect(gateway.toString()).toEqual(skateGateway.address.toString());

    const queryId = await polyMarket.getQueryId();
    expect(queryId).toEqual(0n);
  });

  it("should place bet", async () => {
    const userUSDTWallet = await mintUSDT(user.address);

    //// Place a bet /////
    const betAmount = toNano("1"); // 1000 USDT, since decimal is 6
    // const betCell = beginCell().storeUint(newBet.candidate_id, 8).storeBit(newBet.direction).endCell();
    const newBet: BetConfig = {
      $$type: "BetConfig",
      candidate_id: 1n, // TRUMP
      direction: true, // YES
    };
    const betSlice = beginCell().store(storeBetConfig(newBet)).endCell().asSlice();

    const FORWARD_AMOUNT = toNano("0.008");
    const TRANSFER_USDT_GAS = toNano("0.0028");
    const TOTAL_AMOUNT = toNano("0.02");

    const placeBetTx = await userUSDTWallet.sendTransfer(
      user.getSender(),
      TOTAL_AMOUNT, // NOTE: this consume gas on USDT wallet, Skate will rebate
      betAmount,
      polyMarket.address,
      user.address,
      null, // payload for USDT wallet, skip
      FORWARD_AMOUNT,
      betSlice,
    );
    const polyMarketUSDTWallet = await getUSDTWallet(polyMarket.address);
    const balance1 = await polyMarketUSDTWallet.getJettonBalance();
    expect(balance1).toEqual(betAmount + initialMarketUSDTBalance);

    /// 2.1 Should transfer to market USDT wallet
    expect(placeBetTx.transactions).toHaveTransaction({
      from: userUSDTWallet.address,
      to: polyMarketUSDTWallet.address,
      op: JettonOp.internal_transfer,
      success: true,
    });
    /// 2.2 Should have Internal Transfer Notification to PolyMarket contract
    expect(placeBetTx.transactions).toHaveTransaction({
      from: polyMarketUSDTWallet.address,
      to: polyMarket.address,
      op: JettonOp.transfer_notification,
      success: true,
    });
    /// 2.3.1 Should initiate task notification on SkateGateway
    expect(placeBetTx.transactions).toHaveTransaction({
      from: polyMarket.address,
      to: skateGateway.address,
      op: SkateOp.initiate_task_notification,
      success: true,
    });

    /// 2.3.2 Should rebate gas for user
    expect(placeBetTx.transactions).toHaveTransaction({
      from: polyMarket.address,
      to: user.address,
      success: true,
      value: FORWARD_AMOUNT + TRANSFER_USDT_GAS,
    });

    expect(placeBetTx.externals).toHaveLength(1);
    const eventSlice = placeBetTx.externals[0].body.asSlice();
    const task = loadSkateInitiateTaskEvent(eventSlice);

    expect(task.user.toString()).toEqual(user.address.toString());
    expect(task.skate_app.toString()).toEqual(polyMarket.address.toString());
    const destination = loadDestination(task.execution_info.payload.destination.asSlice());
    expect(destination.chain_id).toEqual(137n);
    expect(destination.chain_type).toEqual(0n);
    expect(BigInt(destination.address)).toEqual(BigInt("0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"));
    const request = loadRequestPlaceBet(task.execution_info.payload.data.asSlice());
    expect(request.candidate_id).toEqual(1n);
    expect(request.direction).toEqual(true);
    expect(request.usd_amount).toEqual(betAmount);
  });

  it("should request settle bet", async () => {
    //// 1. Request settle a bet /////
    const settleAmount = toNano("1"); // 1000 ct_token, 6 decimal places to match USDT
    const settleRequest: RequestSettleBet = {
      $$type: "RequestSettleBet",
      candidate_id: 1n, // TRUMP
      direction: true, // YES
      ct_amount: settleAmount, // 20 Token represent win
    };
    const GAS_USED = toNano("0.01");
    const requestSettleTx = await polyMarket.send(user.getSender(), { value: GAS_USED }, settleRequest);

    /// 1.1 User transaction to polyMarket
    expect(requestSettleTx.transactions).toHaveTransaction({
      from: user.address,
      to: polyMarket.address,
      op: PolyMarketOp.request_settle_bet,
      success: true,
    });
    /// 1.2.1 Should initiate task notification on SkateGateway
    expect(requestSettleTx.transactions).toHaveTransaction({
      from: polyMarket.address,
      to: skateGateway.address,
      op: SkateOp.initiate_task_notification,
      success: true,
    });

    /// 1.2.2 Should rebate gas for user
    expect(requestSettleTx.transactions).toHaveTransaction({
      from: polyMarket.address,
      to: user.address,
      success: true,
      value: GAS_USED,
    });

    /// 1.3 Match emitted event
    expect(requestSettleTx.externals).toHaveLength(1);
    const eventSlice = requestSettleTx.externals[0].body.asSlice();
    const task = loadSkateInitiateTaskEvent(eventSlice);

    const destination = loadDestination(task.execution_info.payload.destination.asSlice());
    expect(destination.chain_id).toEqual(137n);
    expect(destination.chain_type).toEqual(0n);
    expect(BigInt(destination.address)).toEqual(BigInt("0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"));

    const decodedSettleRequest = loadRequestSettleBet(task.execution_info.payload.data.asSlice());
    expect(decodedSettleRequest.candidate_id).toEqual(1n);
    expect(decodedSettleRequest.direction).toEqual(true);
    expect(decodedSettleRequest.ct_amount).toEqual(settleAmount);
  });

  it("should settle user bet", async () => {
    //// 2. Executor settle a bet /////
    const polyMarketCTF_ID: Destination = {
      $$type: "Destination",
      address: POLYMARKET_CTF,
      chain_id: 137n,
      chain_type: 0n,
    };
    const mockDestination = beginCell().store(storeDestination(polyMarketCTF_ID)).endCell();
    // NOTE: in production, this must match the request settle bet id
    const settleId = BigInt(2n);
    const fillAmount = toNano("1");
    const mockData = beginCell()
      .store(
        storeSettleBet({
          $$type: "SettleBet",
          settle_id: settleId,
          user: user.address,
          fee_receiver: executor.address,
          usd_amount: fillAmount, // 1000 USDT
        }),
      )
      .endCell();

    const payload: Payload = {
      $$type: "Payload",
      destination: mockDestination,
      data: mockData,
    };
    const expiration = BigInt(Math.round(new Date().getTime() / 1000));
    const execution_info: ExecutionInfo = {
      $$type: "ExecutionInfo",
      payload,
      expiration,
      value: toNano("0.01"),
    };
    const msg_hash = await skateGateway.getPayloadHash(settleId, polyMarket.address, payload, expiration);
    const signature = ed25519Sign(bigintToHash(msg_hash), relayerPrivateKey);

    const mockExecuteTask: SkateExecuteTask = {
      $$type: "SkateExecuteTask",
      query_id: settleId, // this must match settle_id for AVS to approve.
      target_app: polyMarket.address,
      execution_info,
      relayer_signature: beginCell().storeBuffer(signature, 64).endCell(),
    };
    const executeTaskTx = await skateGateway.send(
      executor.getSender(),
      {
        value: toNano("0.02"),
      },
      mockExecuteTask,
    );

    /// 2.1 Execute task called
    expect(executeTaskTx.transactions).toHaveTransaction({
      from: executor.address,
      to: skateGateway.address,
      op: SkateOp.execute_task,
      success: true,
    });

    /// 2.2 Relayed to Polymarket
    expect(executeTaskTx.transactions).toHaveTransaction({
      from: skateGateway.address,
      to: polyMarket.address,
      op: PolyMarketOp.settle_bet,
      success: true,
    });

    /// 2.3 USDT transfer from PolyMarket contract -> user
    const polyMarketUSDTWallet = await getUSDTWallet(polyMarket.address);
    const userUSDTWallet = await getUSDTWallet(user.address);
    expect(executeTaskTx.transactions).toHaveTransaction({
      from: polyMarket.address,
      to: polyMarketUSDTWallet.address,
      op: JettonOp.transfer,
      success: true,
    });
    expect(executeTaskTx.transactions).toHaveTransaction({
      from: polyMarketUSDTWallet.address,
      to: userUSDTWallet.address,
      op: JettonOp.internal_transfer,
      success: true,
    });
    const userBalance = await userUSDTWallet.getJettonBalance();
    expect(userBalance).toEqual(fillAmount);
  });
});
