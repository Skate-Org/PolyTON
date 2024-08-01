import { beginCell, toNano } from "@ton/core";
import { Payload, SkateExecuteTask, SkateGateway, storeDestination } from "../../wrappers/SkateGateway";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { Destination, ExecutionInfo, storeSettleBet } from "../../wrappers/PolyMarket";
import { TESTNET_GATEWAY_ADDRESS, TESTNET_POLYMARKET_ADDRESS } from "../const";
import { bigintToHash, ed25519Sign } from "../helpers/crypto";

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

  const settle_query_id = 5n;
  const usd_amount = toNano("100"); // -> 20x in this test
  const mockData = beginCell()
    .store(
      storeSettleBet({
        $$type: "SettleBet",
        settle_id: settle_query_id,
        user: USER,
        fee_receiver: EXECUTOR,
        usd_amount,
      }),
    )
    .endCell();

  const payload: Payload = {
    $$type: "Payload",
    destination: mockDestination,
    data: mockData,
  };

  const expiration = BigInt(Math.round(new Date().getTime() / 1000 + 60));

  const execution_info: ExecutionInfo = {
    $$type: "ExecutionInfo",
    payload,
    expiration,
    value: toNano("0.01"),
  };
  const msg_hash = await skateGateway.getPayloadHash(settle_query_id, TESTNET_POLYMARKET_ADDRESS, payload, expiration);
  const signature = await ed25519Sign(bigintToHash(msg_hash), relayerPrivateKey);

  const MsgExecuteTask: SkateExecuteTask = {
    $$type: "SkateExecuteTask",
    query_id: settle_query_id, // this must match settle_id for AVS to approve.
    target_app: TESTNET_POLYMARKET_ADDRESS,
    execution_info,
    relayer_signature: beginCell().storeBuffer(signature, 64).endCell(),
  };

  await skateGateway.send(
    provider.sender(), // EXECUTOR ADDR
    {
      value: toNano("0.02"),
    },
    MsgExecuteTask,
  );
}
