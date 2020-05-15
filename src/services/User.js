const Service = require("@Core/service");
const checkParams = require('@Utils/checkParams');
const trim = require('@Utils/trim');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class User extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async create(user) {
    user = trim(user);
    return checkParams(user, [
      {val: 'login', msg: '用户name不能为空!'},
      {val: 'avatar', msg: '用户头像不能为空!'},
    ]).then(user=> {
      const { login } = user;
      return this.ctx.models.User.findOne({where: {login}});
    }).then(u=> {
      if(u) { // 找到直接返回
        return u;
      }
      return this.ctx.models.User.create(user);
    });
  }

  async update(user) {
    return checkParams(user, [
      {val: 'id', msg: 'id不能为空！'}
    ]).then(user=> {
      const {id, ...other} = user;
      return this.ctx.models.User.update(other, {where: {id}});
    });
  }

  async query(query, offset, limit) {
    query = trim(query);
    if (query.login) {
      query.login = {
        [Op.like]: `${query.login}%`
      }
    }
    return this.ctx.models.User.findAndCountAll({
      where: query,
      offset, limit, order: [['speed', 'DESC']]
    }).then(result=> {
      return {
        total: result.count,
        items: result.rows
      }
    })
  }

  async delete(id) {
    return this.ctx.models.Blog.destroy(
      {where: {id}}
    );
  }
}

module.exports = User;
