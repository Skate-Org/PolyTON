import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'contracts/poly_market.tact',
  options: {
    debug: true,
    external: true,
  },
};
