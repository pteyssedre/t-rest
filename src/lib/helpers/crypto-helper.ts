import * as fs from "fs";
import * as NodeRSA from "node-rsa";
import * as path from "path";
import {Injectable} from "teys-injector";
import {FileHelper} from "./file-helper";

@Injectable()
export class CryptoHelper {

    key: any;
    crt: any;
    base: string = "./certs";
    privatePath = path.join(this.base, "private.pem");
    publicPath = path.join(this.base, "public.pem");

    private keys: any;

    async initBase() {
        return new Promise<void>(async (resolve, reject) => {
            try {

                if (!fs.existsSync(this.privatePath) || !fs.existsSync(this.publicPath)) {
                    this.keys = new NodeRSA({b: 2048});
                    this.keys.generateKeyPair();
                    await FileHelper.createFileAsync(this.privatePath, this.keys.exportKey("pkcs8-private"));
                    await FileHelper.createFileAsync(this.publicPath, this.keys.exportKey("pkcs8-public"));
                }

                this.key = new NodeRSA(fs.readFileSync(this.privatePath));
                this.crt = new NodeRSA(fs.readFileSync(this.publicPath));
                return resolve();
            } catch (exception: any) {
                return reject(exception);
            }
        });
    }
}
