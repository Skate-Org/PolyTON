import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type GatewayConfig = {
  relayer: number;
};

export function counterConfigToCell(config: GatewayConfig): Cell {
  return beginCell().storeUint(config.relayer, 32).endCell();
}

export const Opcodes = {
};

export class SkateGateway implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

  static createFromAddress(address: Address) {
    return new SkateGateway(address);
  }

  static createFromConfig(config: GatewayConfig, code: Cell, workchain = 0) {
    const data = counterConfigToCell(config);
    const init = { code, data };
    return new SkateGateway(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }
}
