import * as fs from 'fs';
import {FileAndDirValidator} from './FileAndDirValidator';

export class UniqDirGenerator {
    private validator: FileAndDirValidator;

    constructor(validator: FileAndDirValidator) {
        this.validator = validator;
    }

    generateUniqDir(path: string): string {
        this.validator.validateExistingDir(path);
        const baseFolderName: string = path + '/file_parts_';
        let folderName: string = '';

        do {
            folderName = baseFolderName + (Date.now() % 1000);
        } while (fs.existsSync(folderName));

        try {
            fs.mkdirSync(folderName);
        } catch (e) {
            throw new Error('Unable to create a directory: ' + folderName);
        }

        return folderName;
    }
}
