import { log, parseFile } from './src/other.js';
import { generator } from './src/generate.js';
import readline from 'readline-sync';
import * as dotenv from 'dotenv';
dotenv.config();

(async() => {
    const mainStage = [
        'Generate New Wallets',
        'Generate New Wallets [1 mnemonic - 1 address]',
        'Generate Addresses for your mnemonic',
        'Generate Addresses for your mnemonic [1 mnemonic - 1 address]',
    ];

    const index = readline.keyInSelect(mainStage, 'Choose stage!');
    if (index == -1) { process.exit() };
    log('info', `Start ${mainStage[index]}`, 'green');
    
    try {
        if (index == 0) {
            await generator(process.env.Quantity_Of_Wallets, true);
        } else if (index == 1) {
            await generator(process.env.Quantity_Of_Wallets, false);
        } else if (index == 2) {
            const mnemonic = parseFile('mnemonic.txt');
            await generator(process.env.Quantity_Of_Wallets, true, mnemonic);
        } else if (index == 3) {
            const mnemonic = parseFile('mnemonic.txt');
            await generator(process.env.Quantity_Of_Wallets, false, mnemonic);
        }
    } catch (error) {
        log('error', error, 'red');
        return;
    }

    log('info', 'Process End!', 'bgMagentaBright');
})();