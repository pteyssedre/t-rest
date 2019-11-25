import { RestController, UserRole } from "./rest-controller";
export declare function Delete(path?: string): <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Post(path?: string): <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Get(path?: string): <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Patch(path?: string): <T extends RestController>(target: T, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare function Authorize(...roles: UserRole[]): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
