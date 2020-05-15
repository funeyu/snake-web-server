module.exports = function(obj, keys) {
  return new Promise((resolve, reject)=> {
    for (let i = 0; i < keys.length; i ++) {
      const key = keys[i];
      if (typeof obj[key.val] === 'undefined' || (obj[key.val] === '')) {
        reject(new Error(key.msg));
      }
    }
    resolve(obj);
  });
}
