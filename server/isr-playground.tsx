import { renderToString } from 'react-dom/server';
import Cache from './IncrementalStaticRegeneration/cache';
import IncrementalStaticRegenerationRender from './IncrementalStaticRegeneration/renderer';

const { log } = console;

log(`Hello ISR`);

const cache = new Cache({ max: 1000 });
// eslint-disable-next-line no-console
// console.log(cache.getDir('1'));

const key = '1';
const value = 'value-1';
const maxAge = 1000; // unit: ms
cache.set(key, value, maxAge);
log(cache.get(key));
log(cache.size());

// setTimeout(() => {
//   log(`After maxAge=${maxAge}`);
//   log(cache.get(key));
//   log(cache.size());
// }, 1500);

function doRender({ ctx }) {
  log(`doRender run`);
  let markup = '';
  try {
    markup = renderToString(<div>Hello ISR</div>);
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
  max: 1000,
  doRender,
  renderName: 'AppRender',
});

const staticPath = '/404';
const revalidateTime = 1000;

const defaultPathConfig = {
  matchPath() {
    return true;
  },
  revalidate: revalidateTime,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getStaticPath(path, data) {
    return staticPath;
  },
};

function getRenderMarkup(pathConfig = defaultPathConfig) {
  const { markup } = appRenderer.render({
    path: staticPath,
    ctx: {
      url: 'TODO',
    },
    pathConfig,
  });

  return markup;
}

log(`empty pathConfig markup=${getRenderMarkup({})}`);
log(`empty pathConfig markup=${getRenderMarkup({})}`);
log(`empty pathConfig markup=${getRenderMarkup({})}`);

log(`markup=${getRenderMarkup()}`);
log(`markup=${getRenderMarkup()}`);
log(`markup=${getRenderMarkup()}`);

setTimeout(() => {
  log(`markup=${getRenderMarkup()}`);
  log(`markup=${getRenderMarkup()}`);

  log(`empty pathConfig markup=${getRenderMarkup({})}`);
  log(`empty pathConfig markup=${getRenderMarkup({})}`);
  log(`empty pathConfig markup=${getRenderMarkup({})}`);
}, revalidateTime + 500);
