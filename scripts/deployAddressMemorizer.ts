import { Address, beginCell, toNano } from 'ton-core';
import { AddressMemorizer } from '../wrappers/AddressMemorizer';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const addressMemorizer = AddressMemorizer.createFromConfig(
        {
            owner: Address.parse("kQC_UQzCLJniVUDD4AD_uM8_cf22T7-QIHTy3zzfogCtO_XK"),
            memorized: Address.parse("EQC2tC4THShN6jkWlfhYaIAF8pwjtSPbAW1oEaxFWR1SxJet")
        }, 
        await compile('AddressMemorizer')
    );

    const message = beginCell()
        .storeUint(1, 32)
        .storeUint(0, 64)
        .storeAddress(Address.parse("EQC2tC4THShN6jkWlfhYaIAF8pwjtSPbAW1oEaxFWR1SxJet"))
        .endCell()

    await provider.deploy(
        addressMemorizer, 
        toNano('0.05'),
        message
    );
    const openedContract = provider.open(addressMemorizer);
    console.log("Address:", openedContract.address);
}
