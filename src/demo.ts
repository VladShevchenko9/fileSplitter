import * as fs from 'fs';
import {FileSplitter} from './FileSplitter';
import {FileAndDirValidator} from './FileAndDirValidator';
import {UniqDirGenerator} from './UniqDirGenerator';

const validator = new FileAndDirValidator();
const dirGenerator = new UniqDirGenerator(validator);
const fileSplitter = new FileSplitter(validator, dirGenerator);

function cleanDataFolder(): void {
    fs.readdirSync(__dirname + '/data').forEach(element => {
        const fullPath = __dirname + '/data/' + element;
        if (element !== 'demo.txt') {
            if (fs.lstatSync(fullPath).isDirectory()) {
                fs.rmSync(fullPath, {recursive: true, force: true});
            } else {
                fs.unlinkSync(fullPath);
            }
        }
    });
}

cleanDataFolder();
const partsPath: string = fileSplitter.fileSplit(__dirname + '/data/demo.txt', 4);
fileSplitter.fileMerge(__dirname + '/data/demo1.txt', partsPath);
