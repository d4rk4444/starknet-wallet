import fs from 'fs';
import path from 'path';
import consoleStamp from 'console-stamp';
import chalk from 'chalk';
import * as dotenv from 'dotenv';
dotenv.config();

export const log = (type, msg, color) => {
    const output = fs.createWriteStream(`history.log`, { flags: 'a' });
    const logger = new console.Console(output);
    consoleStamp(console, { format: ':date(HH:MM:ss) :label' });
    consoleStamp(logger, { format: ':date(yyyy/mm/dd HH:MM:ss) :label', stdout: output });

    if (!color) {
        console[type](msg);
    } else {
        console[type](chalk[color](msg));
    }
    logger[type](msg);
}

export const writeFile = (file, text) => {
    fs.writeFileSync(file, text, { flag: 'a+' });
}

export const timeout = ms => new Promise(res => setTimeout(res, ms));

export const parseFile = (file) => {
    const data = fs.readFileSync(file, "utf-8");
    const array = (data.replace(/[^a-zA-Z \n]/g,'')).split('\n');
    const trueArr = [];

    for (const arr of array) {
        if (arr.length > 0) {
            trueArr.push(arr);
        }
    }

    return trueArr;
}

export const cleanFolder = (directoryPath) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            const currentPath = path.join(directoryPath, file);

            if (fs.lstatSync(currentPath).isDirectory()) {
                clearDirectory(currentPath);
                fs.rmdirSync(currentPath);
            } else {
                fs.unlinkSync(currentPath);
            }
        }
    });
}