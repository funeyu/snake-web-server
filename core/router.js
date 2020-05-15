const FindMyWay = require("find-my-way");
const compose = require("koa-compose");
const { SrcControllerPath } = require("./Constants");
import middlewares from "./middleware";

const env = process.env.NODE_ENV;
if (env === 'development') {
  require('console-color-mr');
}

// todo router decorate的类方法能否将方法的ctx提升到类的属性上
class Router {
  constructor() {
    this.urls = {};
    const routerWays = FindMyWay();
    this.routerWays = routerWays;

    this.groupMiddlewares = new Map();
    this.middlewares = middlewares(); // 细分到url的中间件,可以从middlewares全局的定义中找寻
  }

  // 重置路由，只会在热更的controller的时候用到
  _reset() {
    this.routerWays.reset();
  }

  GroupMiddle(pathName, middleware) {
    this.groupMiddlewares.set(pathName, middleware);
  }

  check(urlInfo) {
    const { url, base } = urlInfo;
    if(!url || !base) {
      console.error(`${url}'s urlInfo should has url and base !!`);
    }
    if (!url.startsWith('/')) {
      console.error(`${url}'s urlInfo.url should startsWith ’/‘`);
    }
  }

  url(urlInfo) {
    const { url, base } = urlInfo;
    const basePath = base.replace(SrcControllerPath, "");
    return `${basePath}${url}`;
  }

  // 根据urlInfo 去加载'分组'的中间件；
  getGroupMiddleware(urlInfo) {
    const { base } = urlInfo

    return this.groupMiddlewares.get(`${base}/middleware.js`);
  }

  // target 即 descorate的controller
  get = (urlInfo, middleware, ...middleargs) => (target, name, descriptor) => {
    if (env === 'development') {
      this.check(urlInfo);
    }
    let action = (descriptor || target.descriptor).value;
    if (typeof action !== 'function') {
      throw new Error('router descorate the only one thing: function!');
    }

    action = action.bind(target);
    this.routerWays.on("GET", this.url(urlInfo), async (ctx, next) => {
      let groupMiddleware = this.getGroupMiddleware(urlInfo);
      if (groupMiddleware || middleware) {
        const middlewareHandlers =[];
        if (groupMiddleware) {
          middlewareHandlers.push(groupMiddleware)
        }
        if (typeof middleware === "function") {
          middlewareHandlers.push(middleware);
        } else if (
          typeof middleware === "string" &&
          this.middlewares.get(middleware)
        ) {
          middlewareHandlers.push(this.middlewares.get(middleware)(...middleargs));
        }
        if (middlewareHandlers && middlewareHandlers.length > 0) {
          const composedMiddlewares = compose(middlewareHandlers);
          const nextHandler = function(ctx) {
            return action(ctx, next);
          }.bind(null, ctx);
          return composedMiddlewares(ctx, nextHandler);
        }
      } else {
        return action(ctx, next);
      }
    });
  };

  options = (urlInfo, middleware, ...middleargs) => (target, name, descriptor) => {
    if (env === 'development') {
      this.check(urlInfo);
    }

    let action = (descriptor || target.descriptor).value;
    if (typeof action !== 'function') {
      throw new Error('router descorate the only one thing: function!');
    }
    action = action.bind(target);
    this.routerWays.on("OPTIONS", this.url(urlInfo), async (ctx, next) => {
      if (middleware) {
        let middlewareHandler = this.middlewares.get(middleware);
        middlewareHandler = middlewareHandler(...middleargs);

        let nextHandler = function(ctx) {
          return action(ctx, next);
        };

        return middlewareHandler(ctx, nextHandler.bind(null, ctx));
      }

      return action(ctx, next);
    });
  };

  // post方法是否要默认添加koa-body 中间件？
  post = (urlInfo, middleware, ...middleargs) => (target, name, descriptor) => {
    if (env === 'development') {
      this.check(urlInfo);
    }

    let action = (descriptor || target.descriptor).value;
    if (typeof action !== 'function') {
      throw new Error('router descorate the only one thing: function!');
    }
    action = action.bind(target);
    this.routerWays.on("POST", this.url(urlInfo), async (ctx, next) => {
      if (middleware) {
        let middlewareHandler;
        if (typeof middleware === "function") {
          middlewareHandler = middleware;
        } else if (
          typeof middleware === "string" &&
          this.middlewares.get(middleware)
        ) {
          middlewareHandler = this.middlewares.get(middleware)(...middleargs);
        }

        if (middlewareHandler) {
          let nextHandler = function(ctx) {
            return action(ctx, next);
          }.bind(null, ctx);

          return middlewareHandler(ctx, nextHandler);
        }
      } else {
        return action(ctx, next);
      }
    });
  };
}

module.exports = new Router();
