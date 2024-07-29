import { beginCell, toNano } from "@ton/core";
import { SkateGateway, storeDestination } from "../build/SkateGateway/tact_SkateGateway";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { Destination, ExecutionInfo, storeSettleBet } from "../wrappers/PolyMarket";
import { Payload, SkateExecuteTask } from "../wrappers/SkateGateway";
import { bigintToHash, ed25519Sign } from "../tests/helpers";
import { polyMarketAddress } from "./const";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  const relayerKey = BigInt(`0x${process.env.RELAYER_PUBLIC_KEY!}`);
  if (!owner || !relayerKey) {
    throw "Missing deployer address or relayer key not specified";
  }
  const skateGateway = provider.open(await SkateGateway.fromInit(owner, relayerKey));
  const relayerPrivateKey = BigInt(`0x${process.env.RELAYER_PRIVATE_KEY!}`);

  const POLYMARKET_CTF = BigInt("0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E");
  const polyMarketCTF_ID: Destination = {
    $$type: "Destination",
    address: POLYMARKET_CTF,
    chain_id: 137n,
    chain_type: 0n,
  };
  const mockDestination = beginCell().store(storeDestination(polyMarketCTF_ID)).endCell();
  // NOTE: in production, this must match the request settle bet id
  const settleId = BigInt(0xffffffff);
  const fillAmount = toNano("1");
  const mockData = beginCell()
    .store(
      storeSettleBet({
        $$type: "SettleBet",
        settle_id: settleId,
        user: owner,
        fee_receiver: owner,
        usd_amount: fillAmount, // 1000 USDT
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
    expiration: BigInt(Math.round(new Date().getTime() / 1000)),
    value: toNano("0.1"),
  };
  const msg_hash = await skateGateway.getPayloadHash(payload);
  const signature = ed25519Sign(bigintToHash(msg_hash), relayerPrivateKey);

  const MsgExecuteTask: SkateExecuteTask = {
    $$type: "SkateExecuteTask",
    query_id: settleId, // this must match settle_id for AVS to approve.
    target_app: polyMarketAddress,
    execution_info,
    relayer_signature: beginCell().storeBuffer(signature, 64).endCell(),
  };

  await skateGateway.send(
    provider.sender(),
    {
      value: toNano("0.2"),
    },
    MsgExecuteTask,
  );

  await provider.waitForDeploy(skateGateway.address);
}
