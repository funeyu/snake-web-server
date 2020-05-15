const Service = require("@Core/service");
const axios = require('axios');
const querystring = require('querystring')

class Github extends Service {
  constructor(ctx) {
    super(ctx);
  }

  redirectUrl() {
    const { config } = this.ctx;
    const githubConfig = config.github;
    const { client_id, redirect_uri} = githubConfig;
    return `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${encodeURI(redirect_uri)}`
  }

  async accessToken(code) {
    const { config } = this.ctx;
    const githubConfig = config.github;
    const {access_token, client_secret, client_id, redirect_uri, user_uri} = githubConfig;
    const params = {
      client_id: client_id,
      client_secret: client_secret,
      code: code
    }
    const res = await axios.post(access_token, params);
    const q = querystring.parse(res.data);
    if (q.error) {
      console.log('error', q.error);
    } else {
      const token = q.access_token;
      const userInfo = await axios.get(user_uri + token).then(res=> res.data);
      return userInfo;
    }
  }

}

module.exports = Github;
