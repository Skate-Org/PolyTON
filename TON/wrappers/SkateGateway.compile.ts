import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
  lang: 'tact',
  target: 'contracts/skate_gateway.tact',
  options: {
    debug: true,
    external: true
  },
};
