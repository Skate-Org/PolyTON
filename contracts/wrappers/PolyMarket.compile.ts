import { CompilerConfig } from "@ton/blueprint";

export const compile: CompilerConfig = {
  lang: "tact",
  target: "src/poly_market.tact",
  options: {
    debug: true,
  },
};
