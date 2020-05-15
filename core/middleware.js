const glob = require("glob");
const compose = require("koa-compose");

const { SrcMiddlewarePath } = require("./Constants");

// 收集所有的middleware
module.exports = () => {
  const middlewaresContainer = new Map();

  let middlewares = glob.sync(`${SrcMiddlewarePath}/*.js`);
  middlewares.forEach(middleware => {
    let controller = require(middleware);
    if (typeof controller === "function") {
      let middlewareName = middleware.match(/\/(\w+).js/)[1];
      middlewaresContainer.set(middlewareName, controller);
    }
  });

  return middlewaresContainer;
};

//收集所有的全局middleware

module.exports.getGlobalMiddleware = () => {
  let middlewarePaths = glob.sync(`${SrcMiddlewarePath}/global/*`);
  let middlewares = middlewarePaths.map(path => {
    return require(path);
  });

  middlewares.sort((m1, m2) => {
    return m2.weight - m1.weight;
  });

  return compose(middlewares.map(m => m.content));
};

// middlewares的热更
module.exports.refresh = () => {};
