import Cache from './cache';

export interface GetStaticPath<CacheVal> {
  (path: string, data: RenderData<CacheVal>): string;
}

interface ServerCtx {
  url: string;
  redirect(url: string): void;
}

export interface PathConfig<CacheVal> {
  matchPath: (path: string) => Boolean;
  revalidate: number;
  getStaticPath: GetStaticPath<CacheVal>;
}

export interface RenderData<CacheVal> {
  // store?: Store
  path: string;
  pathConfig?: PathConfig<CacheVal>;
  res?: CacheVal;
  ctx: ServerCtx;
  routeIsStatic?: boolean;
}

export interface DoRender<CacheVal> {
  (data: RenderData<CacheVal>): CacheVal;
}

export interface NormalizeRenderResult<CacheVal> {
  (data: RenderData<CacheVal>): CacheVal;
}

/**
 * 静态再生渲染器
 * 支持将「doRender()」参数的返回结果缓存到内存中，
 * 并指定缓存有效时长（revalidate）和缓存的key（staticPath）。
 *
 * 可用于缓存指定路由的 SSR 渲染结果，以节省服务端资源。
 *
 * RFC：TODO
 * 使用文档：TODO
 */
class IncrementalStaticRegenerationRender<CacheVal = string> {
  cache;

  doRender: DoRender<CacheVal>;

  normalizeRenderResult?: NormalizeRenderResult<CacheVal>;

  renderName: string;

  constructor({
    max,
    doRender,
    normalizeRenderResult,
    renderName,
  }: {
    max: number;
    doRender: DoRender<CacheVal>;
    normalizeRenderResult?: NormalizeRenderResult<CacheVal>;
    renderName: string;
  }) {
    this.cache = new Cache<CacheVal>({ max });
    this.doRender = doRender;
    if (normalizeRenderResult) {
      this.normalizeRenderResult = normalizeRenderResult;
    }
    this.renderName = renderName || 'Unknown';
  }

  saveCache(
    data: RenderData<CacheVal>,
    staticPath: string,
    renderResult: CacheVal,
    revalidate: number,
  ) {
    // 使用 staticPath 作为缓存的 key
    this.cache.set(staticPath, renderResult, revalidate);
  }

  // eslint-disable-next-line class-methods-use-this
  getOptions(
    data: RenderData<CacheVal>,
    path: string,
    pathConfig: PathConfig<CacheVal> | undefined,
  ) {
    const revalidate = pathConfig?.revalidate || 0;
    const getStaticPath = pathConfig?.getStaticPath || (() => path);
    const staticPath = getStaticPath(path, data);

    return {
      staticPath,
      revalidate,
    };
  }

  cacheSize(): number {
    return this.cache.size();
  }

  removeCache(key: string) {
    this.cache.remove(key);
  }

  render(data: RenderData<CacheVal>): CacheVal {
    const { revalidate, staticPath } = this.getOptions(
      data,
      data.path,
      data.pathConfig,
    );

    const routeIsStatic = Boolean(revalidate);
    const cache = routeIsStatic ? this.cache.get(staticPath) : null;
    const hasCache = Boolean(cache);
    // eslint-disable-next-line no-param-reassign
    data.routeIsStatic = routeIsStatic; // 用于 normalizeRenderResult 内部判断

    let res = cache || this.doRender(data);

    if (routeIsStatic && !hasCache) {
      this.saveCache(data, staticPath, res, revalidate);
    }

    if (typeof this.normalizeRenderResult === 'function') {
      // eslint-disable-next-line no-param-reassign
      data.res = res;
      res = this.normalizeRenderResult(data);
    }

    return res;
  }
}

export default IncrementalStaticRegenerationRender;
