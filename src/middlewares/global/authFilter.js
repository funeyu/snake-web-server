const AuthFilter = require('../authFilter');

module.exports = {
  weight: 1,// 在路由匹配的前一步
  content: AuthFilter(),
}
