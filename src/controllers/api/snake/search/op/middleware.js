module.exports = async function(ctx, next) {
  const user = ctx.user;
  if (!user) {
    ctx.services.Response.noAuth('需要github登录！')
  } else {
    return next();
  }
}
