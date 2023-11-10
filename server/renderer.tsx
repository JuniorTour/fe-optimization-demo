import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouterContext } from 'react-router';
import { log } from 'console';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { App } from '../src/app/ui/app/app';
import { history } from '../src/shared/router';
import { DIST } from '../webpack/constants';
import IncrementalStaticRegenerationRender, {
  PathConfig,
} from './IncrementalStaticRegeneration/renderer';
import { markSSREnd, measureSSRRenderDuration } from './performance-mark';

function getIndexHTMLTemplate() {
  return readFileSync(resolve(DIST, 'index.html'), {
    encoding: 'utf-8',
  });
}

function doRender({ ctx }) {
  log(`doRender run`);
  let markup = '';
  try {
    markup = renderToString(<App />);
  } catch (err) {
    console.error('renderToString', err, ctx.url);
  }

  return {
    // 如有需要，可以自由添加其他数据用于缓存，例如 react-helmet 的渲染结果
    markup,
  };
}

export const appRenderer = new IncrementalStaticRegenerationRender({
  // 如果「缓存数量超过最大值删除次数」：https://gf.in.zhihu.com/d/VyQnbK1nz/jing-tai-ye-mian-zai-sheng-isr?orgId=1&var-app=heifetz-errorpage&var-RouteName=NotFoundErrorPage&from=now-15d&to=now&viewPanel=19
  // 其中的 dispose.start.count 指标触发数量较高，就该考虑加大「缓存最大数量：max」了
  max: 100 * 1000,
  doRender,
  renderName: 'AppRender',
});

const PathConfigs: PathConfig<{ markup: string }>[] = [
  {
    matchPath(path) {
      return /article\/(.*)/.test(path);
    },
    // 对于文章页，我们期望每 10 秒，更新一次缓存，也即更新一次服务端渲染的结果：
    revalidate: 10 * 1000, // 10 seconds
    getStaticPath(path /* , renderData: RenderData<string> */) {
      // 对于每一个文章页，都以其path作为缓存的 key
      return path;
    },
  },
  {
    matchPath(path) {
      return /^\/login$/.test(path);
    },
    // 对于登录页，我们期望每 180 秒，更新一次缓存，也即更新一次服务端渲染的结果：
    revalidate: 180 * 1000, // 180 seconds
    getStaticPath() {
      // 对于登录页，将固定值 'login' 作为缓存的 key
      return 'login';
    },
  },
  // // 热门榜单页示例
  // {
  //   matchPath(path) {
  //     return /hot/.test(path);
  //   },
  //   // 对于热门榜单页，我们期望每 1 秒，更新一次缓存，也即更新一次服务端渲染的结果：
  //   revalidate: 1 * 1000, // 1 seconds
  //   getStaticPath() {
  //     return 'hot';
  //   },
  // },
];

function getPathConfig(path) {
  return PathConfigs.find((config) => config.matchPath(path));
}

function getISRRenderResult({ path, ctx }) {
  const { markup } = appRenderer.render({
    path,
    ctx,
    pathConfig: getPathConfig(path),
  });

  return markup;
}

export function serverRenderer(req, res) {
  const context: StaticRouterContext = {};

  const reqUrl = req.url;
  history.push(reqUrl);
  log(`reqUrl=${reqUrl}`);

  const markup = getISRRenderResult({
    path: reqUrl,
    ctx: {
      history,
      redirect(statusCode, url) {
        return res.redirect(statusCode, url);
      },
    },
  });

  // eslint-disable-next-line no-console
  console.log(`markup=${markup.substring(0, 100)}`);

  markSSREnd();

  if (context.url) {
    // eslint-disable-next-line no-console
    console.log(`context?.url=${context?.url}`);
    // 某处渲染了 `<Redirect />` 组件
    res.redirect(301, context.url);
  } else {
    res.send(
      getIndexHTMLTemplate().replace(
        '<div id="root"></div>',
        `<div id="root">${markup}</div>`,
      ),
    );
  }

  measureSSRRenderDuration();
}
