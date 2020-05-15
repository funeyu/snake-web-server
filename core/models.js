const path = require("path");
const Sequelize = require("sequelize");
const glob = require("glob");
const { ConfigPath, SrcModelPath } = require("./Constants");
const env = process.env.NODE_ENV || "development";

const config = require(ConfigPath)[env];

config.define = {
  underscored: true
};

const { database, username, password, dialect, host, port } = config.db;
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
  port
});
const db = {};

const importSequelize = function() {
  const files = glob.sync(`${SrcModelPath}/*.js`);
  files.forEach(file => {
    const model = sequelize.import(file);
    db[model.name] = model;
  });

  Object.keys(db).forEach(modelName => {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });
};

importSequelize();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const reImportOneModel = function(file) {
  delete db.sequelize.importCache[file];

  const model = db.sequelize.import(file);
  // db[model.name].associate(db.models)
};

// 保存src/model 会触发refresh操作
db.refresh = function(filename) {
  const filepath = path.join(SrcModelPath, filename);
  if (require.cache[filepath]) {
    delete require.cache[filepath];
  }
  reImportOneModel(filepath);
};

module.exports = db;
