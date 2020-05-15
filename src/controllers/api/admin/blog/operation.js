import router from '@Core/router';
import koaBody from 'koa-body';

class Operation {
  @router.post({url: '/create', base: __dirname}, koaBody())
  async create(ctx) {
    try {
      const { body } = ctx.request;
      const data = await ctx.services.Blog.create(body);
      const res = data.toJSON();
      ctx.services.Response.ok({rootId: res.id});
    } catch(error) {
      console.log('error', error);
      ctx.services.Response.error(10050, error.message);
    }
  }

  @router.post({url: '/delete', base: __dirname}, koaBody())
  async delete(ctx) {
    try {
      const { body } = ctx.request;
      const res = await ctx.services.Blog.delete(body.id);
      ctx.services.Response.ok('ok');
    } catch(error) {
      ctx.services.Response.error(10050, error.message);
    }
  }

}
