// 踢掉obj为空的属性值，注意如果value为moment等对象就不要用了，专剔除要传给后端的json数据
const trimObject = function(obj) {
  return Object.keys(obj).reduce((pre, next) => {
    if (obj[next] && typeof obj[next] === 'object') {
      if (Object.prototype.toString.call(obj[next]) === '[object Array]') {
        pre[next] = obj[next].map(i=> {
          if (typeof i !== 'object') {
            return i;
          } else {
            // 深层次的array到底要trim吗？
            return trimObject(i);
          }
        });

      } else {
        pre[next] = trimObject(obj[next]);
      }

    } else if (typeof obj[next] !== 'undefined' && obj[next] !== '') {
      pre[next] = obj[next];
    }
    return pre;
  }, {});
};

module.exports = trimObject
