import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type HashmapStorageConfig = {};

export function hashmapStorageConfigToCell(config: HashmapStorageConfig): Cell {
    return beginCell().endCell();
}

export class HashmapStorage implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new HashmapStorage(address);
    }

    static createFromConfig(config: HashmapStorageConfig, code: Cell, workchain = 0) {
        const data = hashmapStorageConfigToCell(config);
        const init = { code, data };
        return new HashmapStorage(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }
}
