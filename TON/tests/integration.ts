import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import { toNano, address } from "@ton/core";
import "@ton/test-utils";
import { PolyMarket } from "../build/PolyMarket/tact_PolyMarket";
import { SkateGateway } from "../build/SkateGateway/tact_SkateGateway";

describe("Integration: Gateway + PolyMarket", () => {
  let blockchain: Blockchain;
  let deployer: SandboxContract<TreasuryContract>;
  let polyMarket: SandboxContract<PolyMarket>;
  // TODO: check if this can be mocked, e.g. mint arbitrary amounts to polyMarket contract
  let jetton_USDT = address("EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs");
  let skateGateway: SandboxContract<SkateGateway>;
  const relayerPublicKey = BigInt("0x072aa6ab487813c8763e8564cf74356e351280cff6380bf28a845259a6e90433");

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    deployer = await blockchain.treasury("deployer");
    skateGateway = blockchain.openContract(await SkateGateway.fromInit(deployer.address, relayerPublicKey));
    polyMarket = blockchain.openContract(await PolyMarket.fromInit(skateGateway.address, jetton_USDT));

    const deployResult = await polyMarket.send(
      deployer.getSender(),
      {
        value: toNano("0.1"),
      },
      {
        $$type: "Deploy",
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

  it("should deploy", async () => {
    // the check is done inside beforeEach
    // blockchain and skateGateway are ready to use
  });

  // TODO: PlaceBet tests, i.e. transfer to PolyMarket contract
  // TODO: SettleBet tests, i.e. request Gateway => executor settle.

  // NOTE: Gateway specific
  // TODO: SkateInitiateTaskNotification tests
  // TODO: SkateExecuteTask tests
  it("should correctly verify relayer signature");
  it("should false with mismatch struct data");
  it("should false with mismatch nonce");
});
