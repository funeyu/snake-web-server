import router from '@Core/router';
import { v4 as uuidv4 } from 'uuid';

// github登录相关的接口
class Github {
  @router.get({url: '/', base: __dirname})
  async home(ctx, next) {
    const redirect = ctx.services.Github.redirectUrl();
    ctx.redirect(redirect);
  }

  @router.get({url: '/callback', base: __dirname})
  async callback(ctx, next) {
    const { code } = ctx.query;
    const { cookieName, cookieOption } = ctx.config;
    try {
      const gitInfo = await ctx.services.Github.accessToken(code);
      const userInfo = {
        login: gitInfo.login,
        avatar: gitInfo.avatar_url
      };
      const user = await ctx.services.User.create(userInfo);
      const cookie = uuidv4();
      await ctx.services.Redis.set(cookie, JSON.stringify({
        id: user.id,
        login: user.login,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      }));
      ctx.cookies.set(cookieName, cookie, cookieOption);
      ctx.redirect('http://www.xiaoshesoso.com');
    } catch(err) {
      console.log('github auth 出错！', err.message);
      ctx.redirect('http://www.xiaoshesoso.com');
    }
  }
}
