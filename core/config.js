const { ConfigPath } = require("./Constants");
const env = process.env.NODE_ENV || "development";

// context 这里是koa的ctx的原型
module.exports = context => {
  const config = require(ConfigPath)[env];
  context.config = config;
};
