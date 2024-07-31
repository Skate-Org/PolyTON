import { beginCell, toNano } from "@ton/core";
import { SkateGateway, storeDestination } from "../build/SkateGateway/tact_SkateGateway";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { Destination, ExecutionInfo, storeSettleBet } from "../wrappers/PolyMarket";
import { Payload, SkateExecuteTask } from "../wrappers/SkateGateway";
import { TESTNET_GATEWAY_ADDRESS, TESTNET_POLYMARKET_ADDRESS } from "./const";
import { bigintToHash, ed25519Sign } from "./helpers/crypto"

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  const relayerKey = BigInt(`0x${process.env.RELAYER_PUBLIC_KEY!}`);
  if (!owner || !relayerKey) {
    throw "Missing deployer address or relayer key not specified";
  }
  const skateGateway = provider.open(SkateGateway.fromAddress(TESTNET_GATEWAY_ADDRESS));
  const relayerPrivateKey = BigInt(`0x${process.env.RELAYER_PRIVATE_KEY!}`);


  const USER = owner;
  const EXECUTOR = owner;

  const POLYMARKET_CTF = BigInt("0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E");
  const polyMarketCTF_ID: Destination = {
    $$type: "Destination",
    address: POLYMARKET_CTF,
    chain_id: 137n,
    chain_type: 0n,
  };
  const mockDestination = beginCell().store(storeDestination(polyMarketCTF_ID)).endCell();

  const settleId = BigInt(5);
  const fillAmount = toNano("100");
  const mockData = beginCell()
    .store(
      storeSettleBet({
        $$type: "SettleBet",
        settle_id: settleId,
        user: USER,
        fee_receiver: EXECUTOR,
        usd_amount: fillAmount, // 0.11 USDT
      }),
    )
    .endCell();

  const payload: Payload = {
    $$type: "Payload",
    destination: mockDestination,
    data: mockData,
  };

  const execution_info: ExecutionInfo = {
    $$type: "ExecutionInfo",
    payload,
    expiration: BigInt(Math.round(new Date().getTime() / 1000 + 60)),
    value: toNano("0.01"),
  };
  const msg_hash = await skateGateway.getPayloadHash(payload);
  const signature = await ed25519Sign(bigintToHash(msg_hash), relayerPrivateKey);

  const MsgExecuteTask: SkateExecuteTask = {
    $$type: "SkateExecuteTask",
    query_id: settleId, // this must match settle_id for AVS to approve.
    target_app: TESTNET_POLYMARKET_ADDRESS,
    execution_info,
    relayer_signature: beginCell().storeBuffer(signature, 64).endCell(),
  };

  await skateGateway.send(
    provider.sender(), // EXECUTOR ADDR
    {
      value: toNano("0.0101"),
    },
    MsgExecuteTask,
  );
}
