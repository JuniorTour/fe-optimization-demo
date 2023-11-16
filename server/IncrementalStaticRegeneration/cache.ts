import { log } from 'console';
import LRUCache from 'lru-cache';

interface Cache<CacheVal> {
  lruCache: LRUCache<string, CacheVal>;
}

class Cache<CacheVal> implements Cache<CacheVal> {
  constructor({ max }: { max: number }) {
    this.lruCache = new LRUCache({
      noDisposeOnSet: true, // 只在超过 max 时，触发 dispose
      max,
      dispose: (key: string) => {
        log(`ISR cache ${key} dispose`);
      },
    });
  }

  remove(key: string) {
    this.lruCache.del(key);
  }

  // maxAge unit: ms
  set(path: string, data: CacheVal, maxAge?: number) {
    if (!data) return;

    this.lruCache.set(path, data, maxAge);
  }

  get(path: string) {
    if (!path) return null;

    return this.lruCache.get(path);
  }

  size() {
    return this.lruCache.length;
  }
}

export default Cache;
