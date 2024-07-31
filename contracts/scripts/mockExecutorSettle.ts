import { beginCell, toNano } from "@ton/core";
import { SkateGateway, storeDestination } from "../build/SkateGateway/tact_SkateGateway";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { Destination, ExecutionInfo, storeSettleBet } from "../wrappers/PolyMarket";
import { Payload, SkateExecuteTask } from "../wrappers/SkateGateway";
import { polyMarketAddress } from "./const";

export async function run(provider: NetworkProvider) {
  const ed = await import("@noble/ed25519");
  const { sha512 } = await import("@noble/hashes/sha512");
  // import * as ed from "@noble/ed25519";
  // import { sha512 } from "@noble/hashes/sha512";

  // Set the sha512 implementation
  ed.etc.sha512Sync = (...msgs) => {
    const hash = sha512.create();
    msgs.forEach((msg) => hash.update(msg));
    return hash.digest();
  };

  // Convert BigInt to Uint8Array
  const bigintToUint8Array = (bigint: BigInt): Uint8Array => {
    const hex = bigint.toString(16).padStart(64, "0");
    return new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
  };

  function bigintToHash(bytes32: bigint) {
    const hash = bytes32.toString(16).padStart(64, "0");
    return hash;
  }

  function ed25519Sign(hashedMsg: string | Buffer, privateKey: BigInt) {
    // step1: hashedMsg = sha256(message);
    const privKeyBytes = bigintToUint8Array(privateKey);

    // step2: return privateKey.sign(hashedMsg)
    const signature = ed.sign(hashedMsg, privKeyBytes);
    return Buffer.from(signature);
  }


  const owner = provider.sender().address;
  const relayerKey = BigInt(`0x${process.env.RELAYER_PUBLIC_KEY!}`);
  if (!owner || !relayerKey) {
    throw "Missing deployer address or relayer key not specified";
  }
  const skateGateway = provider.open(await SkateGateway.fromInit(owner, relayerKey));
  const relayerPrivateKey = BigInt(`0x${process.env.RELAYER_PRIVATE_KEY!}`);

  const POLYMARKET_CTF = BigInt("0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E");

  const USER = owner;
  const EXECUTOR = owner;

  const polyMarketCTF_ID: Destination = {
    $$type: "Destination",
    address: POLYMARKET_CTF,
    chain_id: 137n,
    chain_type: 0n,
  };
  const mockDestination = beginCell().store(storeDestination(polyMarketCTF_ID)).endCell();
  // NOTE: in production, this must match the request settle bet id
  const settleId = BigInt(2);
  const fillAmount = toNano("0.00011");
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
    value: 0n,
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
    provider.sender(), // EXECUTOR ADDR
    {
      value: toNano("0.01"),
    },
    MsgExecuteTask,
  );

  await provider.waitForDeploy(skateGateway.address);
}

