import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'src/poly_ton.tact',
  options: {
    debug: true,
    // masterchain: true,
    external: true
  },
};
