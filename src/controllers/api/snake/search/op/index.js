import router from '@Core/router';
import koaBody from 'koa-body';

class Operation {

  @router.post({url: '/', base: __dirname}, koaBody())
  async operation(ctx, next) {
    try {
      const {word, type, docId} = ctx.request.body;
      await ctx.services.Operation.create(docId, word, type);
      if (type != 3) {
        await ctx.services.GRPC.star(word, type, docId);
      }
      ctx.body = {
        success: true
      };
    } catch(err) {
      ctx.body = {
        success: false,
        msg: err.message
      }
    }
  }

  @router.get({url: '/list', base: __dirname})
  async list(ctx, next) {
    const { type } = ctx.query;
    const ids = await ctx.services.Operation.query(type);
    const details = await ctx.services.GRPC.details(ids);
    ctx.services.Response.ok(details.data);
  }
}
