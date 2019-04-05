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

export class AccountController extends RestController {

    @Inject()
    private readonly tokenManager: JwtTokenManager;
    @Inject()
    private readonly userProvider: RestUserProvider;
    @Inject()
    private readonly tokenProvider: TokenProvider;

    constructor(server: restify.Server, path: string, version: string) {
        super(server, path, version);
    }

    @Post()
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

    @Post()
    async register(req: Request, res: Response) {
        const post = req.body as RegisterModel;
        if (!post || !post.isValid()) {
            return badRequest(res, {details: "invalid data"});
        }
        const user = await this.userProvider.registerUser(post);
    }
}
