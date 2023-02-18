import { Address, beginCell, toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = Counter.createFromAddress(Address.parse("EQCs_Ev2hdNc9nWUbsiM32DZNG9I6QsmjIgOXf4269cR6GxA"));
    const openedContract = provider.open(counter);
    await openedContract.send(
        provider.sender(),
        toNano('0.05'),
        beginCell()
            .storeUint(1, 32)
            .endCell()
    )
}