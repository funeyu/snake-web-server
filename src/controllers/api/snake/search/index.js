import router from '@Core/router';

class Search {
  @router.get({url: '/', base: __dirname})
  async home(ctx, next) {
    const {word, page=1, sort} = ctx.query;
    const response = await ctx.services.GRPC.search(word, sort, page);
    ctx.body = response;
  }
}
