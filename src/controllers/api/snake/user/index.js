import router from '@Core/router';

class User {
  @router.get({url: '/info', base: __dirname})
  async info(ctx, next) { // 返回是否登录等信息
    if(ctx.user) {
      const opInfo = await ctx.services.Operation.operationInfo();
      ctx.body = {
        logined: true,
        ... ctx.user,
        ... opInfo
      }
    } else {
      ctx.body = {
        logined: false
      }
    }
  }
}
