const Service = require("@Core/service");
const checkParams = require('@Utils/checkParams');
const trim = require('@Utils/trim');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Blog extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async create(blogInfo) {
    blogInfo = trim(blogInfo);
    return checkParams(blogInfo, [
      {val: 'domain', msg: '应用名称不能为空!'}
    ]).then(blogInfo=> {
      const { domain } = blogInfo;
      return this.ctx.models.Blog.findOne({where: {domain}});
    }).then(blog=> {
      if(blog) {
        throw new Error(`已经存在(${domain})不能重复！`)
      }
      return this.ctx.models.Blog.create(blogInfo);
    });
  }

  async update(blogInfo) {
    return checkParams(blogInfo, [
      {val: 'id', msg: 'id不能为空！'}
    ]).then(blogInfo=> {
      const {id, ...other} = blogInfo;
      return this.ctx.models.Blog.update(other, {where: {id}});
    });
  }


  // type: 1：热门博客主；2：多产博客主
  async top100(lang, type) {
    const order = type === '1' ? 'gitFollowers' : 'articleNum'
    return this.ctx.models.Blog.findAndCountAll({
      where: {lang}, offset: 0, limit: 100,
      order: [[order, 'DESC']]
    }).then(result=> {
      return result.rows
    })
  }

  async all() {
    return this.ctx.models.Blog.findAll();
  }

  async query(query, offset, limit) {
    query = trim(query);
    if (query.name) {
      query.name = {
        [Op.like]: `${query.name}%`
      }
    }
    return this.ctx.models.Blog.findAndCountAll({
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

module.exports = Blog;

const b = new Blog();

