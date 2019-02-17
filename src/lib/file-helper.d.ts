export declare class FileHelper {
    static copyFileAsync(sourcePath: string, destinationPath: string): Promise<boolean>;
    static createFileAsync(filePath: string, content: any): Promise<void>;
}
