import * as fs from "fs";
import * as NodeRSA from "node-rsa";
import * as path from "path";
import * as ursa from "ursa";

import { Injectable } from "teys-injector";
import { FileHelper } from "./file-helper";

@Injectable()
export class CryptoHelper {

    public key: any;
    public crt: any;
    public base: string = "./certs";
    public privatePath = path.join(this.base, "server/key.pem");
    public publicPath = path.join(this.base, "client/key.pub");

    private keys: any;

    public async initBase() {
        return new Promise<void>(async (resolve, reject) => {
            try {

                if (!fs.existsSync(this.privatePath) || !fs.existsSync(this.publicPath)) {
                    this.keys = new NodeRSA({b: 2048});
                    await FileHelper.createFileAsync(this.privatePath, this.keys.exportKey("private"));
                    await FileHelper.createFileAsync(this.publicPath, this.keys.exportKey("public"));
                }

                this.key = ursa.createPrivateKey(fs.readFileSync(this.privatePath));

                this.crt = ursa.createPublicKey(fs.readFileSync(this.publicPath));
                return resolve();
            } catch (exception) {
                return reject(exception);
            }
        });
    }
}
