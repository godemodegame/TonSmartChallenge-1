import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type AddressMemorizerConfig = {
    owner: Address,
    memorized: Address
};

export function addressMemorizerConfigToCell(config: AddressMemorizerConfig): Cell {
    return beginCell()
        .storeAddress(config.owner)
        .storeAddress(config.memorized)
        .storeUint(12, 32)
        .endCell();
}

export class AddressMemorizer implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new AddressMemorizer(address);
    }

    static createFromConfig(config: AddressMemorizerConfig, code: Cell, workchain = 0) {
        const data = addressMemorizerConfigToCell(config);
        const init = { code, data };
        return new AddressMemorizer(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATLY,
            body: beginCell().endCell(),
        });
    }
}
