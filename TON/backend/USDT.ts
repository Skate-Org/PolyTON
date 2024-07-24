import { address } from "@ton/core";
import { JettonMaster, TonClient } from "@ton/ton";
import { SkateGateway } from "../build/SkateGateway/tact_SkateGateway";

const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC"
})

const USDT_ADDR = address("EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs");

async function main() {
  const jettonMaster = client.open(JettonMaster.create(USDT_ADDR))
  const data = await jettonMaster.getJettonData()
  // client.open(SkateGateway.fromAddress(USDT_ADDR))
  console.log(data)
}
main()
