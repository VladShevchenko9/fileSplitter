import * as fs from "fs";

export class FileAndDirValidator {
    validateExistingFile(path: string): void {
        if (!fs.existsSync(path)) {
            throw new Error('the path does not exist');
        }

        if (!fs.lstatSync(path).isFile()) {
            throw new Error('the path is not a file');
        }
    }

    validateExistingDir(path: string): void {
        if (!fs.existsSync(path)) {
            throw new Error('the path does not exist');
        }

        if (!fs.lstatSync(path).isDirectory()) {
            throw new Error('the path is not a directory');
        }
    }
}
