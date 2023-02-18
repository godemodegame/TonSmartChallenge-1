import { Blockchain } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { AddressMemorizer } from '../wrappers/AddressMemorizer';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('AddressMemorizer', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('AddressMemorizer');
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const addressMemorizer = blockchain.openContract(AddressMemorizer.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await addressMemorizer.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: addressMemorizer.address,
            deploy: true,
        });
    });
});
