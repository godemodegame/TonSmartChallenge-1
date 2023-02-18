import { Address, beginCell, toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = Counter.createFromAddress(Address.parse("EQCu3OOHs2hc4tQsSXeb7ArkZFHIvarSFviOLmk4xTtK3hii"));
    const openedContract = provider.open(counter);
    await openedContract.send(
        provider.sender(),
        toNano('1'),
        beginCell()
            .storeUint(2, 32)
            .storeUint(0, 64)
            .endCell()
    )
}