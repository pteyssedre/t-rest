import {RegisterModel} from "../../models";
import {RestUser} from "../rest-controller";

export abstract class RestUserProvider {
    abstract userById(id: number | string): Promise<RestUser>;

    validateCredentials(username: any, password: any): Promise<RestUser | undefined> {
        return new Promise<RestUser | undefined>((resolve) => {
            return resolve(undefined);
        });
    }

    registerUser(model: RegisterModel): Promise<RestUser | undefined> {
        return new Promise<RestUser | undefined>((resolve) => {
            return resolve(undefined);
        });
    }
}
