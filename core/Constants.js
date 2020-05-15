const path = require("path");

const RootPath = path.resolve(__dirname, "..");
const CorePath = path.join(RootPath, 'core');
const ConfigPath = path.join(RootPath, "config.js");
const SrcPath = path.resolve(RootPath, "src");
const SrcServicesPath = path.join(SrcPath, "services");
const SrcControllerPath = path.join(SrcPath, "controllers");
const SrcMiddlewarePath = path.join(SrcPath, "middlewares");
const SrcModelPath = path.join(SrcPath, "models");

module.exports = {
  RootPath,
  CorePath,
  ConfigPath,
  SrcPath,
  SrcServicesPath,
  SrcControllerPath,
  SrcMiddlewarePath,
  SrcModelPath
};
