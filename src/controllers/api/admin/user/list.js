import router from '@Core/router';
import koaBody from 'koa-body';
import { calculateLimitAndOffset } from '@Utils/paginate';

class List {
  @router.post({url: '/list', base: __dirname}, koaBody())
  async list(ctx) {
    const { body } = ctx.request;
    const {pageSize, pageNum, query={}} = body;
    const {limit, offset} = calculateLimitAndOffset(pageNum, pageSize);
    const data = await ctx.services.User.query(query, offset, limit);
    ctx.services.Response.ok(data);
  }
}
