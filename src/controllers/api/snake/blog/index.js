import router from '@Core/router';

function formartUrl(item) {
  if (item.schema == 1) {
    return `https://${item.domain}${item.path}`;
  }
  return `http://${item.domain}${item.path}`;
}

class Index {
  @router.get({url: '/nav', base: __dirname})
  async nav(ctx, next) {
    const {type, lang} = ctx.query
    const items = await ctx.services.Blog.top100(lang, type);
    ctx.body = items.map(i=> ({
      id: i.id,
      url: formartUrl(i),
      title: i.title,
      favicon: i.favicon,
      description: i.keywords,
      articleNum: i.articleNum
    }));
  }
}
