import * as restify from "restify";
import {Request, Response} from "restify";
import {Inject} from "teys-injector";
import {
    badRequest,
    error,
    forbidden,
    JwtTokenManager, ok,
    Post, RegisterModel,
    RestController,
    RestUser,
    RestUserProvider,
    TokenProvider,
} from "../../lib";

export class DefaultAccountController extends RestController {

    @Inject()
    private readonly tokenManager: JwtTokenManager;
    @Inject("_class_restuserprovider")
    private readonly userProvider: RestUserProvider;
    @Inject("_class_tokenprovider")
    private readonly tokenProvider: TokenProvider;

    constructor(server: restify.Server, version: string = "v1") {
        super(server, "account", version);
    }

    @Post("authenticate")
    async login(req: Request, res: Response) {
        if (!req.body || !req.body.username || !req.body.passsword) {
            return badRequest(res, {details: "invalid data"});
        }
        const user: RestUser | undefined = await this.userProvider
            .validateCredentials(req.body.username, req.body.password);
        if (!user) {
            return forbidden(res, {details: "invalid credentials"});
        }
        if (!user.uuid) {
            return error(res, {details: "invalid user"});
        }
        const token: string = await this.tokenManager.createAuthenticationToken(user.uuid, user.roles);
        if (this.tokenProvider) {
            await this.tokenProvider.saveToken(token);
        }
        return ok(res, {detail: "login successful", token});
    }

    @Post("register")
    async register(req: Request, res: Response) {
        const post = req.body as RegisterModel;
        if (!post || !post.isValid()) {
            return badRequest(res, {details: "invalid data"});
        }
        const user = await this.userProvider.registerUser(post);
        return ok(res, user);
    }
}
