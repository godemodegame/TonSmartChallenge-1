import { Address } from 'ton-core';
import { Counter } from '../wrappers/Counter';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const counter = Counter.createFromAddress(Address.parse("EQCs_Ev2hdNc9nWUbsiM32DZNG9I6QsmjIgOXf4269cR6GxA"));
    const openedContract = provider.open(counter);
    const total = await openedContract.getTotal();
    console.log("Total:", total);
}