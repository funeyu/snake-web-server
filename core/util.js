const fs = require("fs");
const _ = require("./Constants");
const glob = require("glob");

const promisifyFsRead = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, fileContent) => {
      if (err) return reject(err);
      resolve(fileContent);
    });
  });

const exist = dir => fs.existsSync(dir);

const watch = (dir, options, handler) => {
  if (!exist(dir)) return;
  let lastTime = Date.now();
  const throttledHandler = function(handler, period) {
    return function(...args) {
      let nowTime = Date.now();
      if (nowTime - lastTime > period) {
        lastTime = nowTime;
        handler(...args);
      } else {
        lastTime = nowTime;
      }
    };
  };
  return fs.watch(dir, options, throttledHandler(handler, 3000));
};

module.exports = {
  promisifyFsRead,
  watch
};
