const glob = require("glob");
const router = require("./router.js");

const { SrcControllerPath } = require("./Constants");

function sanitizeUrl(url) {
  for (let i = 0, len = url.length; i < len; i++) {
    let charCode = url.charCodeAt(i);
    if (charCode === 63 || charCode === 35) {
      return url.slice(0, i);
    }
  }
  return url;
}

function _defaultHttpRoute(ctx) {
  ctx.body = "404";
}

function loadController() {
  const files = glob.sync(`${SrcControllerPath}/**/*.js`);
  files.forEach(file => {
    if (file.includes('middleware.js')) { // 分组的中间件
      const middlePath = file.replace('middleware.js', '');
      router.GroupMiddle(middlePath, require(file));
    } else {
      let controller = require(file).default;
      if (typeof controller === "function") {
        new controller();
      }
    }
  });
}

function clearRequireCache() {
  const files = glob.sync(`${SrcControllerPath}/**/*.js`);
  files.forEach(file => {
    if (require.cache[file]) {
      delete require.cache[file];
    }
  });
}

module.exports.middleware = () => {
  loadController();
  return async (ctx, next) => {
    let req = ctx.req;
    let handle = router.routerWays.find(req.method, sanitizeUrl(req.url));
    if (handle) {
      // https://github.com/delvedor/find-my-way
      // 将/example/:userId' userId存放在params下
      ctx.params = handle.params;
      ctx.store = handle.store;
      // note:不return的写法有问题，会造成koa的middle Promise链断裂，
      // koa源码：fnMiddleware(ctx).then(handleResponse).catch(onerror);
      // 这里handle.handler一定要是一个Promsie
      return handle.handler(ctx, next);
    } else {
      _defaultHttpRoute(ctx);
    }
  };
};

// only used when file restore happens in src/controllers
module.exports.refresh = () => {
  router._reset();
  clearRequireCache();
  loadController();
};
