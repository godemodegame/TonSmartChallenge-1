import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type ProxyConfig = {
    address: Address
};

export function proxyConfigToCell(config: ProxyConfig): Cell {
    return beginCell()
        .storeAddress(config.address)
        .endCell();
}

export class Proxy implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Proxy(address);
    }

    static createFromConfig(config: ProxyConfig, code: Cell, workchain = 0) {
        const data = proxyConfigToCell(config);
        const init = { code, data };
        return new Proxy(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }

    async send(
        provider: ContractProvider, 
        via: Sender, 
        value: bigint, 
        cell: Cell
    ) {
        await provider.internal(
            via, 
            {
                value: value,
                sendMode: SendMode.PAY_GAS_SEPARATLY,
                body: cell
            }
        );
    }
}
