import * as fs from "fs";
import * as path from "path";

export class FileHelper {

    static copyFileAsync(sourcePath: string, destinationPath: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const source = fs.createReadStream(sourcePath);
            const destination = fs.createWriteStream(destinationPath);
            source.pipe(destination);
            source.on("end", () => {
                return resolve(true);
            });
            source.on("error", () => {
                return resolve(false);
            });
        });
    }

    static createFileAsync(filePath: string, content: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                const folders = filePath.indexOf(path.sep) ? filePath.split(path.sep) : filePath.split("/");
                let compute = "";
                while (folders.length > 1) {
                    const f = folders.shift();
                    if (f) {
                        compute += (compute.length ? path.sep : "") + f;
                        if (!fs.existsSync(compute)) {
                            fs.mkdirSync(compute);
                        }
                    }
                }
                fs.appendFileSync(filePath, content);
            } catch (exception) {
                return reject(exception);
            }
            return resolve();
        });
    }
}
