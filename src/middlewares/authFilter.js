module.exports = function(options={}) {
  return async function auth(ctx, next) {
    const { cookieName } = ctx.config;
    const cookie = ctx.cookies.get(cookieName);
    if (cookie) {
      let user = await ctx.services.Redis.get(cookie);
      if (user) {
        try {
          user = JSON.parse(user);
          ctx.user = user;
        } catch(err) {

        }
      }
    }
    try {
      await next();
    } catch(err) {
      throw err;
    }
  }
}
