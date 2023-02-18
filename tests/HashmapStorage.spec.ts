import { Blockchain } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { HashmapStorage } from '../wrappers/HashmapStorage';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('HashmapStorage', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('HashmapStorage');
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const hashmapStorage = blockchain.openContract(HashmapStorage.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await hashmapStorage.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: hashmapStorage.address,
            deploy: true,
        });
    });
});
