import { Blockchain } from '@ton-community/sandbox';
import { Cell, beginCell, toNano } from 'ton-core';
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

        const proxy = blockchain.openContract(
            Proxy.createFromConfig(
                {
                    address: randomAddress()
                }, 
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await proxy.sendDeploy(
            deployer.getSender(), 
            toNano('0.05')
            );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: proxy.address,
            deploy: true,
        });
    });
    it('should resend msg to owner wallet', async () => {
        const blockchain = await Blockchain.create();
        const owner = await blockchain.treasury('owner');
        const proxy = blockchain.openContract(
            Proxy.createFromConfig(
                {
                    address: owner.address
                },
                code
            )
        );
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await proxy.sendDeploy(
            deployer.getSender(), 
            toNano('0.05')
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: proxy.address,
            deploy: true
        });

        const sender = await blockchain.treasury('sender');
        const value = toNano('0.5');

        const msg = beginCell()
            .storeUint(1, 32)
            .endCell()

        const sendResult = await proxy.send(
            sender.getSender(),
            value,
            msg
        );
        expect(sendResult.transactions).toHaveTransaction({
            from: sender.address,
            to: proxy.address,
            value: value,
            success: true,
        });
        // TODO: Check body
        expect(sendResult.transactions).toHaveTransaction({
            from: proxy.address,
            to: owner.address,
            success: true,
        });
    })
});
