import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'src/SkateGateway.tact',
  options: {
    debug: true,
    // masterchain: true,
    external: true
  },
};
