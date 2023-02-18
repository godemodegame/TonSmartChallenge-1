import { Address, beginCell, toNano } from 'ton-core';
import { Proxy } from '../wrappers/Proxy';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const proxy = Proxy.createFromConfig(
        {
            address: Address.parse("kQC_UQzCLJniVUDD4AD_uM8_cf22T7-QIHTy3zzfogCtO_XK"),
            counter: Math.floor(Math.random() * 10000)
        }, 
        await compile('Proxy')
    );

    await provider.deploy(
        proxy,
        toNano('0.05')
    );

    const openedContract = provider.open(proxy);
    console.log("Address:", openedContract.address);
}
