import { RegisterModel } from "../../models";
import { RestUser } from "../rest-controller";
export declare abstract class RestUserProvider {
    abstract userById(id: number | string): Promise<RestUser>;
    validateCredentials(username: any, password: any): Promise<RestUser | undefined>;
    registerUser(model: RegisterModel): Promise<RestUser | undefined>;
}
