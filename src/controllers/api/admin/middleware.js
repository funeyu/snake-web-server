module.exports = async function(ctx, next) {
  const user = ctx.user;
  if (user && user.isAdmin) {
    return next();

  }
  ctx.services.Response.noAuth('需要admin权限！')
}
