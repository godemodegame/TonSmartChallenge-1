import { Blockchain } from '@ton-community/sandbox';
import { Cell, beginCell, toNano } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Counter', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Counter');
    });

    it('should deploy', async () => {
        const blockchain = await Blockchain.create();

        const counter = blockchain.openContract(
            Counter.createFromConfig(
                {
                    counter: 10
                }, 
                code
            )
        );

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.sendDeploy(
            deployer.getSender(), 
            toNano('0.05')
        );

        expect(deployResult.transactions).toHaveTransaction(
            {
                from: deployer.address,
                to: counter.address,
                deploy: true,
            }
        );
    });

    it('should increase counter', async () => {
        const blockchain = await Blockchain.create();
        const counter = blockchain.openContract(
            Counter.createFromConfig(
                {
                    counter: 10
                }, 
                code
            )
        );
        const deployer = await blockchain.treasury('deployer');
        const deployResult = await counter.sendDeploy(
            deployer.getSender(),
            toNano('0.05')
        );
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
        });
        
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i+1}/${increaseTimes}`);
            const increaser = await blockchain.treasury('increaser' + 1);
            const counterBefore = await counter.getTotal();
            console.log('counter before increasing', counterBefore);
            const increaseBy = Math.floor(Math.random() * 100);
            console.log('increasing by', increaseBy);
            const increaseResult = await counter.send(
                blockchain.sender(increaser.address),
                toNano('0.05'), 
                beginCell()
                    .storeUint(increaseBy, 32)
                    .endCell()
            );
            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: counter.address,
                success: true,
            });
            const counterAfter = await counter.getTotal();
            console.log('counter after increasing', counterAfter);
            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    })
});
