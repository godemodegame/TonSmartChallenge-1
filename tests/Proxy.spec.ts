import { Blockchain } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { Proxy } from '../wrappers/Proxy';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';
import { randomAddress } from '@ton-community/test-utils';

describe('Proxy', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Proxy');
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const proxy = blockchain.openContract(Proxy.createFromConfig(
            {
                address: randomAddress()
            }, 
            code
        ));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await proxy.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: proxy.address,
            deploy: true,
        });
    });
});
