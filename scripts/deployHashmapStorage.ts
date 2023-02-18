import { toNano } from 'ton-core';
import { HashmapStorage } from '../wrappers/HashmapStorage';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const hashmapStorage = HashmapStorage.createFromConfig(
        {}, 
        await compile('HashmapStorage')
    );
    await provider.deploy(hashmapStorage, toNano('0.05'));
    const openedContract = provider.open(hashmapStorage);
    console.log("Address:", openedContract.address);
}
