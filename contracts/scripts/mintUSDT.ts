import { toNano } from "@ton/core";
import { JettonMaster } from "../wrappers/JettonMaster";
import { NetworkProvider } from "@ton/blueprint";
import "dotenv/config";
import { mockUSDTAddress, polyMarketAddress } from "./const";

export async function run(provider: NetworkProvider) {
  const owner = provider.sender().address;
  if (!owner) {
    throw "Missing deployer address or relayer key not specified";
  }

  const mockUSDT = provider.open(
    JettonMaster.createFromAddress(
      mockUSDTAddress
    ),
  );
  // NOTE: user
  // const to = address("0QBuMAzv90ZXWm2JRgMO0Hr2StP4dsy-Gb7ygeizxYBp3jmU");

  const to = polyMarketAddress;
  await mockUSDT.sendMint(
    provider.sender(),
    to,
    toNano("10000"),
    null,
    null,
    null,
    toNano("0"),
    toNano("0.1"),
  );

  await provider.waitForDeploy(mockUSDT.address);
}
