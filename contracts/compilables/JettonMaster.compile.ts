import { CompilerConfig } from "@ton/blueprint";

export const compile: CompilerConfig = {
  lang: "func",
  targets: ["src/mocks/USDT/jetton-minter.fc"],
};
