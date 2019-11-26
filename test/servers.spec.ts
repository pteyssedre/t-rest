import * as chai from "chai";
import * as path from "path";
import {Injector} from "teys-injector";
import {RestUser, UserRole} from "../src/lib/base";
import {RestUserProvider as Provider} from "../src/lib/base/providers";
import {ApiServer, SpaServer} from "../src/servers";
import {DefaultAccountController} from "../src/servers/controllers/default-account-controller";
import {DefaultStatsController} from "../src/servers/controllers/default-stats-controller";

const axios = require("axios");
const assert = chai.assert;

class RestUserProvider extends Provider {
    userById(id: number | string): Promise<RestUser> {
        return Promise.resolve({userId: "1234"});
    }
}

describe("teys-rest", () => {

    describe("ApiServer", () => {

        let api: ApiServer;
        describe("Testing pre-register servers", () => {
            before(async () => {
                Injector.Register("_class_restuserprovider", new RestUserProvider());
                api = new ApiServer("localhost", "api", "1h");
                await api.start();
                await api.registerControllers(DefaultAccountController, DefaultStatsController);
            });

            it("Should work", async () => {
                const response = await axios.default.get("http://localhost:3000/api/v1/stats/echo");
                assert(response.status === 200, "not working");
            });

            it("Should fail authentication", async () => {
                const response = await axios.default.get("http://localhost:3000/api/v1/stats/user",
                    {validateStatus: () => true});
                assert(response.status === 401, "not working");
            });

            it("Should success authentication", async () => {
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

            after(() => {
                api.stop();
            });
        });
    });

    describe("SPA Server", () => {

        let spa: SpaServer;
        describe("Testing pre-register servers", () => {
            before(async () => {
                Injector.Register("_class_restuserprovider", new RestUserProvider());
                spa = new SpaServer({
                    filePath: path.join(__dirname, "./"),
                    proxy: {
                        "/images": {target: "https://static.lpnt.fr"},
                    },
                });
                // @ts-ignore
                await spa.startWithControllers(DefaultAccountController, DefaultStatsController);
            });

            it("Should work", async () => {
                const response = await axios.default.get("http://localhost:3000/api/v1/stats/echo");
                assert(response.status === 200, "not working");
            });

            it("Should fail authentication", async () => {
                const response = await axios.default.get("http://localhost:3000/api/v1/stats/user",
                    {validateStatus: () => true});
                assert(response.status === 401, "not working");
            });

            it("Should success authentication", async () => {
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

            it("Should return default index.html", async () => {
                const response = await axios.default.get("http://localhost:3000/",
                    {validateStatus: () => true});
                assert(response.status === 200, "not working");
                assert(response.headers["content-type"] === "text/html", "not html file");
                assert(response.data === `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">` +
                    `<title>Title</title></head><body></body></html>\r\n`, "not index page");
            });

            it("Should return data.json", async () => {
                const response = await axios.default.get("http://localhost:3000/data.json",
                    {validateStatus: () => true});
                assert(response.status === 200, "not working");
                assert(response.headers["content-type"] === "application/json", "not json file");
                assert(JSON.stringify(response.data) === JSON.stringify({data: 1}), "not data file");
            });

            it("Should return 404", async () => {
                const response = await axios.default.get("http://localhost:3000/data2.json",
                    {validateStatus: () => true});
                assert(response.status === 404, "not working");
            });

            it("Should return images results", async () => {
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
