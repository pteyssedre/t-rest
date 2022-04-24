import {assert} from "chai";
import * as path from "path";
import {Injector} from "teys-injector";
import {ApiServer, RestUser, SpaServer, UserRole} from "../src";
import {RestUserProvider as Provider} from "../src/lib/base/providers";
import {DefaultAccountController} from "../src/servers/controllers/default-account-controller";
import {DefaultStatsController} from "../src/servers/controllers/default-stats-controller";

const axios = require("axios");

class RestUserProvider extends Provider {
    userById(id: number | string): Promise<RestUser> {
        return Promise.resolve({userId: "1234"});
    }
}

describe("teys-rest", () => {

    describe("ApiServer", () => {

        let api: ApiServer;
        describe("Testing pre-register server with classic server", () => {
            before(async () => {
                Injector.Register("_class_restuserprovider", new RestUserProvider());
                api = new ApiServer();
                await api.start();
                await api.registerControllers(DefaultAccountController, DefaultStatsController);
            });

            it("Should return success with classic server", async () => {
                const response = await axios.default.get("http://localhost:3000/api/v1/stats/echo");
                assert(response.status === 200, "not working");
            });

            it("Should fail authentication with classic server", async () => {
                const response = await axios.default.get("http://localhost:3000/api/v1/stats/user",
                    {validateStatus: () => true});
                assert(response.status === 401, "not working");
            });

            it("Should success authentication with classic server", async () => {
                const tokenM = Injector.Resolve("_class_jwttokenmanager");
                if (!tokenM) {
                    return;
                }
                const jwt = await (tokenM as any).createAuthenticationToken("1234", UserRole.Admin);

                const response = await axios.default.get("http://localhost:3000/api/v1/stats/user",
                    {headers: {authorization: `Bearer ${jwt}`}, validateStatus: () => true});
                assert(response.status === 200);
                assert(response.data.user.userId === "1234");
            });

            it("Should validate the body parser", async () => {
                const tokenM = Injector.Resolve("_class_jwttokenmanager");
                if (!tokenM) {
                    return;
                }
                const jwt = await (tokenM as any).createAuthenticationToken("1234", UserRole.Admin);

                const response = await axios.default.post("http://localhost:3000/api/v1/stats/user", {post: "is the best"},
                    {headers: {authorization: `Bearer ${jwt}`}, validateStatus: () => true});
                assert(response.status === 200);
                assert(response.data.post === "is the best");
            });
            it("Should validate the 500 error return", async () => {
                const tokenM = Injector.Resolve("_class_jwttokenmanager");
                if (!tokenM) {
                    return;
                }
                const jwt = await (tokenM as any).createAuthenticationToken("1234", UserRole.Admin);

                const response = await axios.default.post("http://localhost:3000/api/v1/stats/500", {post: "is the best"},
                    {headers: {authorization: `Bearer ${jwt}`}, validateStatus: () => true});
                assert(response.status === 500);
                assert(response.data.details === "automatic error validation");
            });

            after(() => {
                api.stop();
            });
        });
    });

    describe("SPA Server", () => {

        let spa: SpaServer;
        describe("Testing pre-register server  with spa server", () => {
            before(async () => {
                Injector.Register("_class_restuserprovider", new RestUserProvider());
                spa = new SpaServer({
                    proxy: {
                        "/images": {target: "https://static.lpnt.fr"},
                    },
                    public: path.join(__dirname, "./"),
                });
                // @ts-ignore
                await spa.startWithControllers(DefaultAccountController, DefaultStatsController);
            });

            it("Should return success  with spa server", async () => {
                const response = await axios.default.get("http://localhost:3000/api/v1/stats/echo");
                assert(response.status === 200, "not working");
            });

            it("Should fail authentication  with spa server", async () => {
                const response = await axios.default.get("http://localhost:3000/api/v1/stats/user",
                    {validateStatus: () => true});
                assert(response.status === 401, "not working");
            });

            it("Should success authentication  with spa server", async () => {
                const tokenM = Injector.Resolve("_class_jwttokenmanager");
                if (!tokenM) {
                    return;
                }
                const jwt = await (tokenM as any).createAuthenticationToken("1234", UserRole.Admin);

                const response = await axios.default.get("http://localhost:3000/api/v1/stats/user",
                    {headers: {authorization: `Bearer ${jwt}`}, validateStatus: () => true});
                assert(response.status === 200);
                assert(response.data.user.userId === "1234");
            });

            it("Should return default index.html with spa server", async () => {
                const response = await axios.default.get("http://localhost:3000/",
                    {validateStatus: () => true});
                assert(response.status === 200, "not working");
                assert(response.headers["content-type"] === "text/html", "not html file");
                assert(response.data === `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">` +
                    `<title>Title</title></head><body></body></html>\r\n`, "not index page");
            });

            it("Should return javascript file with spa server", async () => {
                const response = await axios.default.get("http://localhost:3000/test.js",
                    {validateStatus: () => true});
                assert(response.status === 200, "not working");
                assert(response.headers["content-type"] === "application/javascript", "not javascript file");
            });

            it("Should return javascript file with point in name within spa server", async () => {
                const response = await axios.default.get("http://localhost:3000/test.chunk.js",
                    {validateStatus: () => true});
                assert(response.status === 200, "not working");
                assert(response.headers["content-type"] === "application/javascript", "not javascript file");
            });

            it("Should return data.json with spa server", async () => {
                const response = await axios.default.get("http://localhost:3000/data.json",
                    {validateStatus: () => true});
                assert(response.status === 200, "not working");
                assert(response.headers["content-type"] === "application/json", "not json file");
                assert(JSON.stringify(response.data) === JSON.stringify({data: 1}), "not data file");
            });

            it("Should return 404 with spa server", async () => {
                const response = await axios.default.get("http://localhost:3000/data2.json",
                    {validateStatus: () => true});
                assert(response.status === 404, "not working");
            });

            it("Should return images results with spa server", async () => {
                const response = await axios.default.get("http://localhost:3000/images/2019/09/25/19403277lpw-19403339-article-chat-etude-felin-jpg_6528763_660x281.jpg",
                    {validateStatus: () => true});
                assert(response.status === 200, "not working");
                assert(response.headers["content-type"].indexOf("image/jpeg") > -1, "not html");
            });

            after(() => {
                spa.stop();
            });
        });
    });
});
