import "@ton/test-utils";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano, beginCell, Dictionary, Cell, Address } from "@ton/core";
import { compile } from "@ton/blueprint";

import { loadBet, loadRequestSettleBet, RequestSettleBet, BetConfig, PolyMarket, storeBetConfig } from "../build/PolyMarket/tact_PolyMarket";
import { loadDestination, loadSkateInitiateTaskEvent, SkateGateway } from "../build/SkateGateway/tact_SkateGateway";
import { Op as SkateOp } from "../wrappers/ISkate";
import { USDTMinter, JettonMinterContent } from "../wrappers/USDTMinter";
import { JettonWallet } from "../wrappers/JettonWallet";
import { Op as JettonOp } from "../wrappers/JettonConstants";
import { Op as PolyMarketOp } from "../wrappers/PolyMarket";

describe("PolyMarket", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let polyMarket: SandboxContract<PolyMarket>;
  let mockUSDT: SandboxContract<USDTMinter>;
  let skateGateway: SandboxContract<SkateGateway>;

  // PolyMarket user
  let user0: SandboxContract<TreasuryContract>;
  let getUSDTWallet: (address: Address) => Promise<SandboxContract<JettonWallet>>

  const relayerPublicKey = BigInt("0x072aa6ab487813c8763e8564cf74356e351280cff6380bf28a845259a6e90433");

  beforeEach(async () => {
    blockchain = await Blockchain.create();
    deployer = await blockchain.treasury("deployer");
    user0 = await blockchain.treasury("user0");

    const usdtMinterCode = await compile("USDTMinter");
    const walletCodeRaw = await compile("JettonWallet");
    const jetton_content: JettonMinterContent = {
      uri: 'https://tether.to/usdt-ton.json'
    };
    const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
    _libs.set(BigInt(`0x${walletCodeRaw.hash().toString('hex')}`), walletCodeRaw);
    const libs = beginCell().storeDictDirect(_libs).endCell();
    blockchain.libs = libs;
    let lib_prep = beginCell().storeUint(2, 8).storeBuffer(walletCodeRaw.hash()).endCell();
    const wallet_code = new Cell({ exotic: true, bits: lib_prep.bits, refs: lib_prep.refs });
    mockUSDT = blockchain.openContract(
      USDTMinter.createFromConfig({
        admin: deployer.address,
        wallet_code,
        jetton_content
      }, usdtMinterCode)
    )
    skateGateway = blockchain.openContract(await SkateGateway.fromInit(deployer.address, relayerPublicKey));
    polyMarket = blockchain.openContract(await PolyMarket.fromInit(deployer.address, skateGateway.address, mockUSDT.address));
    getUSDTWallet = async (address: Address) => blockchain.openContract(
      JettonWallet.createFromAddress(
        await mockUSDT.getWalletAddress(address)
      )
    );

    const deployResult = await mockUSDT.sendDeploy(deployer.getSender(), toNano('10'));
    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: mockUSDT.address,
      deploy: true,
    });
    // Make sure it didn't bounce
    expect(deployResult.transactions).not.toHaveTransaction({
      on: deployer.address,
      from: mockUSDT.address,
      inMessageBounced: true
    });

    const pmDeployResult = await polyMarket.send(
      deployer.getSender(),
      {
        value: toNano("100"), // NOTE: Skate sponsor gas for all participants
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    );
    expect(pmDeployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: polyMarket.address,
      deploy: true,
      success: true,
    });

    const gwDeployResult = await skateGateway.send(
      deployer.getSender(),
      {
        value: toNano("100"), // NOTE: Skate sponsor gas for all participants
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    );
    expect(gwDeployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: skateGateway.address,
      deploy: true,
      success: true,
    });
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

    const bets = await polyMarket.getInitiateCount();
    expect(bets).toEqual(0n);

    const settles = await polyMarket.getSettleCount();
    expect(settles).toEqual(0n);
  });

  async function mintUSDT({ amount, to }: { amount: bigint, to: Address }) {
    return mockUSDT.sendMint(
      deployer.getSender(),
      to,
      amount,
      null, null, null,
      toNano("0.1"), toNano("1")
    )
  }

  async function fundUser(address: Address, amount = toNano("1000")) { // 1 million USDT
    //// 1. Mint USDT to user
    const mintTx = await mintUSDT({ amount: amount, to: address });
    const userUSDTWallet = await getUSDTWallet(address);
    expect(mintTx.transactions).toHaveTransaction({
      from: mockUSDT.address,
      deploy: true,
      to: userUSDTWallet.address,
      success: true
    })
    const balance0 = await userUSDTWallet.getJettonBalance();
    expect(balance0).toEqual(amount);

    return userUSDTWallet;
  }


  it("should place bet", async () => {
    const user = user0;
    const userUSDTWallet = await fundUser(user.address);

    //// Place a bet /////
    const betAmount = toNano("1"); // 1000 USDT, since decimal is 6
    // const betCell = beginCell().storeUint(newBet.candidate_id, 8).storeBit(newBet.direction).endCell();
    const newBet: BetConfig = {
      $$type: 'BetConfig',
      candidate_id: 1n, // TRUMP
      direction: true, // YES
    }
    const betSlice = beginCell().store(storeBetConfig(newBet)).endCell().asSlice()
    const placeBetTx = await userUSDTWallet.sendTransfer(
      user.getSender(),
      toNano("0.5"), // NOTE: this consume gas on USDT wallet, Skate will rebate
      betAmount,
      polyMarket.address,
      user.address,
      null, // payload for USDT wallet, skip
      toNano("0.2"),
      betSlice
    )
    const polyMarketUSDTWallet = await getUSDTWallet(polyMarket.address);
    const balance1 = await polyMarketUSDTWallet.getJettonBalance();
    expect(balance1).toEqual(betAmount);

    /// 2.1 Should transfer to market USDT wallet
    expect(placeBetTx.transactions).toHaveTransaction({
      from: userUSDTWallet.address,
      to: polyMarketUSDTWallet.address,
      op: JettonOp.internal_transfer,
      success: true
    })
    /// 2.2 Should have Internal Transfer Notification to PolyMarket contract
    expect(placeBetTx.transactions).toHaveTransaction({
      from: polyMarketUSDTWallet.address,
      to: polyMarket.address,
      op: JettonOp.transfer_notification,
      success: true
    })
    /// 2.3 Should initiate task notification on SkateGateway
    expect(placeBetTx.transactions).toHaveTransaction({
      from: polyMarket.address,
      to: skateGateway.address,
      op: SkateOp.initiate_task_notification,
      success: true
    })

    expect(placeBetTx.externals).toHaveLength(1);
    const eventSlice = placeBetTx.externals[0].body.asSlice();
    const task = loadSkateInitiateTaskEvent(eventSlice);

    const destination = loadDestination(task.execution_info.payload.destination.asSlice());
    expect(destination.chain_id).toEqual(137n);
    expect(destination.chain_type).toEqual(0n);
    expect(BigInt(destination.address)).toEqual(BigInt("0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E"));
    const request = loadBet(task.execution_info.payload.data.asSlice());
    expect(request.candidate_id).toEqual(1n);
    expect(request.direction).toEqual(true);
    expect(request.usd_amount).toEqual(betAmount);
  })

  it("should request settle bet", async () => {
    const user = user0;

    //// Place a bet /////
    const settleAmount = toNano("1"); // 1000 ct_token, 6 decimal places to match USDT
    const settleRequest: RequestSettleBet = {
      $$type: 'RequestSettleBet',
      candidate_id: 1n, // TRUMP
      direction: true, // YES
      ct_amount: settleAmount
    }
    const requestSettleTx = await polyMarket.send(
      user.getSender(),
      {
        value: toNano("0.2")
      },
      settleRequest
    );

    /// 2.1 User transaction to polyMarket
    expect(requestSettleTx.transactions).toHaveTransaction({
      from: user.address,
      to: polyMarket.address,
      op: PolyMarketOp.request_settle_bet,
      success: true
    })
    /// 2.2 Should initiate task notification on SkateGateway
    expect(requestSettleTx.transactions).toHaveTransaction({
      from: polyMarket.address,
      to: skateGateway.address,
      op: SkateOp.initiate_task_notification,
      success: true
    })

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
  })
});
