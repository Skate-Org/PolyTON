import { beginCell, Cell, Dictionary, toNano } from "@ton/core";
import { JettonMaster, JettonMasterContent } from "../wrappers/JettonMaster";
import { compile, NetworkProvider } from "@ton/blueprint";
import "dotenv/config";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }
  const usdtMasterCode = await compile("JettonMaster");
  const walletCodeRaw = await compile("JettonWallet");
  const jetton_content: JettonMasterContent = { uri: "https://tether.to/usdt-ton.json" };
  const _libs = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
  _libs.set(BigInt(`0x${walletCodeRaw.hash().toString("hex")}`), walletCodeRaw);
  let lib_prep = beginCell().storeUint(2, 8).storeBuffer(walletCodeRaw.hash()).endCell();
  const wallet_code = new Cell({ exotic: true, bits: lib_prep.bits, refs: lib_prep.refs });

  const mockUSDT = provider.open(
    JettonMaster.createFromConfig(
      {
        admin: owner,
        wallet_code,
        jetton_content,
      },
      usdtMasterCode,
    ),
  );
  await mockUSDT.sendDeploy(provider.sender(), toNano("2"));

  await provider.waitForDeploy(mockUSDT.address);
}
