const Service = require("@Core/service");

const NOAUTH = 10400;
class Response extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async ok(data) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: 10000,
      msg: '',
      data
    };
  }

  async error(code, msg) {
    this.ctx.status = 200;
    this.ctx.body = {
      code, msg
    };
  }

  async noAuth(msg) {
    this.ctx.status = 200;
    this.ctx.body = {
      code: NOAUTH,
      msg,
    }
  }
}

module.exports = Response;
