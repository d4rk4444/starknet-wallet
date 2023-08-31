import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { BigNumber, ethers } from 'ethers';
import { CallData, ec, hash } from 'starknet';
import { numberToHex } from 'web3-utils';
import { cleanFolder, log, timeout, writeFile } from './other.js';
import * as dotenv from 'dotenv';
dotenv.config();

export const getRandomMnemonic = () => {
    return bip39.generateMnemonic(wordlist);
}

export const generate = (mnemonic, index) => {
    const CLASS_HASH = '0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2';
    const PROXY_CLASS_HASH = '0x025ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918';
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/0`);

    const hdNode = ethers.utils.HDNode.fromSeed(wallet.privateKey);
    const starknetHdNode = hdNode.derivePath(`m/44'/9004'/0'/0/${index}`);

    const privateKeyHex = `0x` + ec.starkCurve.grindKey(starknetHdNode.privateKey);
    const publicKey = ec.starkCurve.getStarkKey(privateKeyHex);

    const constructorCallData = CallData.compile({
        implementation: CLASS_HASH,
        selector: hash.getSelectorFromName('initialize'),
        calldata: CallData.compile({ signer: publicKey, guardian: '0' }),
    });

    const address = hash.calculateContractAddressFromHash(publicKey, PROXY_CLASS_HASH, constructorCallData, 1);

    return { mnemonic, address, privateKey: BigNumber.from(privateKeyHex).toString() };
}

export const generator = async(quantity, type, mnemonic) => {
    cleanFolder('./result');
    await timeout(1000);

    if (mnemonic && mnemonic.length == 0) {
        throw new Error('Add Mnemonic in file');
    }

    if (mnemonic && type) {
        log('log', `${mnemonic[0]}`, 'bgBlue');
        for (let i = 0; i < quantity; i++) {
            const data = generate(mnemonic[0], i);
            writeFile('./result/address.txt', `${data.address}\n`);
            writeFile('./result/privateKey.txt', `${data.privateKey}\n`);
            log('log', `Index: ${i}, Address: ${data.address}, PrivateKey: ${numberToHex(data.privateKey)}`);
            await timeout(1000);
        }
    } else if (mnemonic && !type) {
        for (const seed of mnemonic) {
            const data = generate(seed, 0);
            writeFile('./result/address.txt', `${data.address}\n`);
            writeFile('./result/privateKey.txt', `${data.privateKey}\n`);
            log('log', `${seed}`, 'bgBlue');
            log('log', `Address: ${data.address}, PrivateKey: ${numberToHex(data.privateKey)}`);
            await timeout(1000);
        }
    } else if (!mnemonic && type) {
        const mnemonic = getRandomMnemonic();
        writeFile('./result/mnemonic.txt', `${mnemonic}\n`);
        log('log', `${mnemonic}`, 'bgBlue');
        for (let i = 0; i < quantity; i++) {
            const data = generate(mnemonic, i);
            writeFile('./result/address.txt', `${data.address}\n`);
            writeFile('./result/privateKey.txt', `${data.privateKey}\n`);
            log('log', `Index: ${i}, Address: ${data.address}, PrivateKey: ${numberToHex(data.privateKey)}`);
            await timeout(1000);
        }
    } else if (!mnemonic && !type) {
        for (let i = 0; i < quantity; i++) {
            const mnemonic = getRandomMnemonic();
            const data = generate(mnemonic, 0);
            writeFile('./result/mnemonic.txt', `${mnemonic}\n`);
            writeFile('./result/address.txt', `${data.address}\n`);
            writeFile('./result/privateKey.txt', `${data.privateKey}\n`);
            log('log', `${mnemonic}`, 'bgBlue');
            log('log', `Address: ${data.address}, PrivateKey: ${numberToHex(data.privateKey)}`);
            await timeout(1000);
        }
    }
}