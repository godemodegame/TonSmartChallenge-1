import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type CounterConfig = {};

export function counterConfigToCell(config: CounterConfig): Cell {
    return beginCell()
        .storeUint(99, 64)
        .endCell();
}

export class Counter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new Counter(address);
    }

    static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
        const data = counterConfigToCell(config);
        const init = { code, data };
        return new Counter(contractAddress(workchain, init), init);
    }

    async sendDeploy(
        provider: ContractProvider, 
        via: Sender, 
        value: bigint
    ) {
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

    async getTotal(provider: ContractProvider) {
        const { stack } = await provider.get("get_total", []);
        return stack.readNumber();
    }
}
