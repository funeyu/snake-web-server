require('./babel');

const Koa = require('koa');
const path = require('path');
const controllers = require('./core/controllers');
const {SrcServicesPath, SrcControllerPath, SrcModelPath, CorePath} = require('./core/Constants');
const Service = require('./core/service');
const Config = require('./core/config');
const util = require('./core/util');
const models = require('./core/models');
const { getGlobalMiddleware } = require('./core/middleware');

const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  require('console-color-mr');
}
class MarsServer extends Koa {
  constructor() {
    super();
    Config(this.context);
    this.context.models = models;
    this.use(Service.Inject());
		this.use(getGlobalMiddleware());
		// 先把controller全部加载进来, 同时将koa的context注入进来
		// 这里的context可以再追加写自身的service
		this.use(controllers.middleware(super.context));
		if (env === 'development') {
			this.watchServer();
    }
  }

  // -------------一下几个watch fun 是为开发过程中，如果有controller等的变化，可以不用重启nodejs，所谓的热更吧-----------------
	// 监听server代码的改变
	watchServer() {
		this.watchServerService();
		this.watchServerControllers();
		this.watchServerMiddleware();
		this.watchServerModels();
	}

	watchServerService() {
		util.watch(SrcServicesPath, { recursive: true }, async(type, filename) => {
			Service.Refresh();
		});
	}

	watchServerControllers() {
		util.watch(SrcControllerPath, { recursive: true }, async(type, filename) => {
			console.debug('controllers.refresh:' , filename);
      controllers.refresh();
		});
	}

	watchServerModels() {
    // 实现有问题，有无必要监听model的变化，sql都变了，为啥不重启
		// util.watch(SrcModelPath, { recursive: true }, async(type, filename) => {
    //   models.refresh(filename);
    //   console.log('require.cache', require.cache);
		// 	const modelPath = path.join(CorePath, 'models.js')
		// 	console.log('modelPath', modelPath)
		// 	console.log(require.cache[modelPath])
		// 	if(require.cache[modelPath]) {
		// 		delete require.cache[modelPath]
		// 	}
		// 	this.context.models = require(modelPath)
		// });
  }

  // todo 待实现
	watchServerMiddleware() {

  }
}

const server = new MarsServer();
const { port } = server.context.config;
server.listen(port, ()=> {
  console.info('Snake-server started!!\nlisten on port:', port);
});
