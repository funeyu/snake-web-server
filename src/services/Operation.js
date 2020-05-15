const Service = require("@Core/service");
const checkParams = require('@Utils/checkParams');
const trim = require('@Utils/trim');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Operation extends Service {
  constructor(ctx) {
    super(ctx);
  }

  // 有个次数限制：每天star，collect分别十次的限制；
  // type: 'star' or 'collect'
  // 获取某个用户的操作限制数据，redis中： {star: 2, collect: 3}
  async operationLimit(userId) {
    const s = await this.ctx.services.Redis.get(userId);
    const info = JSON.parse(s || '{"star":0,"collect":0}');
    return info;
  }

  // 更新redis中的限制数据
  async updateOpLimit(userId, limitInfo) {
    const lastTime = new Date(new Date().toLocaleDateString()).getTime() +24 * 60 * 60 * 1000 -1
    const currentTime = + new Date();
    const expire = Math.ceil((lastTime - currentTime) / 1000);

    const limitString = JSON.stringify(limitInfo);
    return this.ctx.services.Redis.set(userId, limitString, expire);
  }

  // type: 1 为加星，2为踩，3为收藏
  async create(docId, word, type) {
    const {id} = this.ctx.user;
    const mm = {'star': '加星/踩', 'collect': '收藏'};
    const limitInfo = await this.operationLimit(id);
    const tt = {1: 'star', 2: 'star', 3: 'collect'}[type];
    if (limitInfo[tt] < 10) {
      limitInfo[tt] = limitInfo[tt] + 1;
      await this.updateOpLimit(id, limitInfo);
      return this.ctx.models.Operation.create({
        userId: id, docId, type, word
      });
    } else {
      throw new Error(`今天你的${mm[tt]}操作次数已用完(每天限制10次)！`)
    }
  }

  // 查找用户的type操作记录, 返回docId数组
  async query(type) {
    const {id} = this.ctx.user;
    return this.ctx.models.Operation.findAndCountAll({
      where: {userId: id, type: type},
      order: [['createdAt', 'DESC']]
    }).then(result=> {
      return result.rows.map(r => r.docId);
    })
  }

  async operationInfo() {
    const star = await this.query(1) || [];
    const unstar = await this.query(2) || [];
    const collect = await this.query(3)|| [];

    return {
      star: star.length, unstar: unstar.length, collect: collect.length
    }
  }
}

module.exports = Operation;
