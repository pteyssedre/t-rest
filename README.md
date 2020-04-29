# TEYS-REST
`teys-rest` is a wrapper around `restify` to quickly create REST API servers. 
Use Typescript and annotations you can create your `controllers` and expose only the methods you want. 
It helps you focus on your business code so you don't have to spend more time on setting up your server.
`teys-rest` as two approach of quick api server: 
1) the classic `api-server`
2) the single page application server aka `spa-sever`

## Classic API Rest Server

The classic approach will allow you to create simple server like this:

```typescript
import {ApiServer} from "teys-rest";
import {MyController1, MyController2} from "./controllers"

let api = new ApiServer();
api.start()
    .then(() => api.registerControllers(MyController1, MyController2))
    .then(() => console.log('server started'))

```

By default the server will run on port `3000` but it can be override by passing a `ApiServerOptions` object
By default all `controllers` will be registered under `/api/v1/{controller}`. All controllers must `extends` the `RestController` class in order to be properly register.
Each controller will have some properties injected via the `teys-injector` such as :
 - logger
 - logOptions
 - apiPrefix
 - restify server

## Single Page Application Server

This approach is for people who wants to push a SPA with the Rest API code. It's build on top of the `api-server` approach

```typescript
import path from "path"
import {SpaServer} from "teys-rest";
import {MyController1, MyController2} from "./controllers"


let spa = new SpaServer({
    public: path.join(__dirname, "public")
  });
spa.startWithControllers(MyController1, MyController2)
    .then(() => console.log('server started'))
```

### Options
You can now specify the list of extensions of files that you want to expose

```typescript
let spa = new SpaServer({
    public: path.join(__dirname, "public"),
    extensionsAllowed: ["png", "jpeg", "html", "js"]
  });
```
If a list is provided via the property `extensionsAllowed` it will override the default list of extensions. So only those declared inside the array will be available.  
The default value is : `["css", "html", "js", "png", "svg", "ico", "jpeg", "jpg", "woff", "woff2", "ttf"]`
