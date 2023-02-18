import { beginCell, toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = Counter.createFromConfig(
        {}, 
        await compile('Counter')
    );

    const deployMessage = beginCell()
        .storeUint(1, 32)
        .endCell();

    await provider.deploy(
        counter, 
        toNano('0.05'), 
        deployMessage
    );

    const openedContract = provider.open(counter);
    console.log("Address:", openedContract.address);
}
