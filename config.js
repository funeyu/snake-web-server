const path = require('path');

module.exports.development = {
    port: 8090, // 应用启动的时候时的端口号
    cookieName: 'snake_user',
    cookieOption: {
      path: '/', maxAge: 24 * 3600 * 1000 * 7, domain: 'xiaoshesoso.com'
    },
    db: {
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3306, // 数据库的端口号
        database: 'snake',
        username: 'root',
        password: '123456'
    },
    github: {
      client_id: 'cc1ff1c257ffb626a759',
      client_secret: '6e9c6a572841d522b48da67767c83311b5e1ca9b',
      redirect_uri: 'http://www.xiaoshesoso.com/api/snake/github/callback',
      access_token: 'https://github.com/login/oauth/access_token',
      user_uri: 'https://api.github.com/user?access_token='
    },
    redis: {
      host: '192.168.1.13',
      port: 16379,
      password: '123456'
    },
    logPath: 'logs/daily.log'
};
