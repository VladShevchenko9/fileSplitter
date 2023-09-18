import * as path from 'path';
import * as fs from 'fs';
import {FileAndDirValidator} from './FileAndDirValidator';
import {UniqDirGenerator} from './UniqDirGenerator';

export class FileSplitter {
    private validator: FileAndDirValidator;
    private dirGenerator: UniqDirGenerator;

    constructor(validator: FileAndDirValidator, dirGenerator: UniqDirGenerator) {
        this.validator = validator;
        this.dirGenerator = dirGenerator;
    }

    fileSplit(filePath: string, partsNumber: number): string {
        this.validator.validateExistingFile(filePath);
        const maxChunkSize: number = 2048 * 1024;
        const baseDirName: string = path.dirname(filePath);
        const partsFolder = this.dirGenerator.generateUniqDir(baseDirName);
        const fileExtension = path.extname(filePath);
        const fileDescriptor = fs.openSync(filePath, 'r');
        let fileSize = fs.statSync(filePath).size;
        const chunkSize = Math.ceil(fileSize / partsNumber);

        if (chunkSize > maxChunkSize) {
            throw new Error('The File is way too large. Please, try to increase parts number.');
        }

        let buffer = Buffer.alloc(chunkSize);

        for (let i = 0; i < partsNumber; i++) {
            if (fileSize < buffer.length) {
                buffer = Buffer.alloc(fileSize);
            }

            fs.readSync(fileDescriptor, buffer, 0, buffer.length, null);
            fileSize -= buffer.length;
            fs.writeFileSync(partsFolder + '/' + i + fileExtension, buffer.toString(), {flag: 'w'});
        }

        fs.closeSync(fileDescriptor);

        return partsFolder;
    }

    fileMerge(mergeFilePath: string, partsDirPath: string): void {
        this.validator.validateExistingDir(partsDirPath);

        if (fs.existsSync(mergeFilePath)) {
            throw new Error('File or directory already exists: ' + mergeFilePath);
        }

        const outputStream = fs.createWriteStream(mergeFilePath);

        fs.readdirSync(partsDirPath).forEach(element => {
            const fullElementPath: string = partsDirPath + '/' + element;

            if (fs.lstatSync(fullElementPath).isFile()) {
                const inputStream = fs.createReadStream(fullElementPath);
                inputStream.pipe(outputStream);
            }
        });
    }
}
