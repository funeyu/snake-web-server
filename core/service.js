const glob = require("glob");
const path = require("path");
const { SrcServicesPath } = require("./Constants");

// console.log('SrcServicesPath', SrcServicesPath)
// 存储所有的service, key为service 文件名， value为该service Class
const ServiceContainer = new Map();
class Service {
  constructor(ctx) {
    this.ctx = ctx;
  }
  // todo: 和controller的部分代码逻辑重, 代码待优化
  static Inject() {
    Service.LoadAll(SrcServicesPath, (serviceName, serviceClass) => {
      ServiceContainer.set(serviceName, serviceClass);
    });

    return async (ctx, next) => {
      ctx.services = {};
      // 在controller 中使用ctx.services.user
      // 就会找ServiceContainer里已经注册好的user的service
      for (const key of ServiceContainer.keys()) {
        Object.defineProperty(ctx.services, key, {
          get: function() {
            const ServiceClass = ServiceContainer.get(key);
            return new ServiceClass(ctx);
          },
          configurable: true
        });
      }
      return next();
    };
  }

  static LoadAll(dir, cb) {
    const files = glob.sync(`${dir}/*.js`);
    files.forEach(file => {
      let serviceName = file.match(/\/(\w+).js/)[1];
      let serviceClass = require(file);
      const serviceClassName = serviceClass.name;
      if (serviceName !== serviceClassName) {
        console.warn("service class name should be the same as its filename!");
      }
      cb(serviceClassName, serviceClass);
    });
  }

  static ClearRequireCache() {
    const files = glob.sync(`${SrcServicesPath}/*.js`);
    files.forEach(file => {
      if (require.cache[file]) {
        delete require.cache[file];
      }
    });
  }

  // 热更的时候会调用该函数
  static Refresh() {
    ServiceContainer.clear();
    Service.ClearRequireCache();
    // 重新加载service到container中
    Service.LoadAll(SrcServicesPath, (serviceName, serviceClass) => {
      ServiceContainer.set(serviceName, serviceClass);
    });
  }
}

module.exports = Service;
