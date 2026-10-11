import { randomUUID } from 'node:crypto';

import { createClient } from 'redis';

import { RedisCacheConfig } from '../src/config/cache-config.interface';
import {
  CachedPage,
  RedisSsrCache,
} from './redis-cache';

// Opt in with an isolated Redis instance. The default unit suite requires no external services.
if (process.env.DSPACE_TEST_REDIS_URL) {
  describe('Redis SSR cache integration', () => {
    let first: RedisSsrCache;
    let second: RedisSsrCache;
    let redis: ReturnType<typeof createClient>;
    let prefix: string;
    const value: CachedPage = { page: '<html>real Redis</html>', headers: { Link: '<item>; rel="item"' }, statusCode: 200 };

    beforeEach(async () => {
      prefix = `dspace-test:${randomUUID()}:`;
      const config: RedisCacheConfig = {
        enabled: true, url: process.env.DSPACE_TEST_REDIS_URL, keyPrefix: prefix,
        connectTimeout: 1000, commandTimeout: 1000, refreshLockTimeToLive: 60000,
        routes: [],
      };
      first = new RedisSsrCache(config);
      second = new RedisSsrCache(config);
      redis = createClient({ url: config.url });
      redis.on('error', () => undefined);
      await Promise.all([first.connect(), second.connect(), redis.connect()]);
    });

    afterEach(async () => {
      const keys = await redis.keys(`${prefix}*`);
      if (keys.length) {
        await redis.del(keys);
      }
      await Promise.all([first.close(), second.close(), redis.disconnect()]);
    });

    it('shares serialized pages, headers and status between workers and expires them', async () => {
      await first.set('page', value, 100);
      expect((await second.get('page'))?.value).toEqual(value);
      const ttl = await redis.pTTL(`${prefix}page:page`);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(100);
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(await second.get('page')).toBeUndefined();
    });

    it('permits one refresh across workers and releases the lock after completion', async () => {
      let finish: () => void;
      let entered: () => void;
      const started = new Promise<void>(resolve => entered = resolve);
      const render = jasmine.createSpy('render').and.callFake(() => {
        entered();
        return new Promise<void>(resolve => finish = resolve);
      });
      const refreshing = first.refresh('page', render);
      await started;
      await second.refresh('page', render);
      expect(render).toHaveBeenCalledTimes(1);
      finish();
      await refreshing;
      expect(await redis.get(`${prefix}refresh:page`)).toBeNull();
      await second.refresh('page', () => Promise.resolve());
      expect(await redis.get(`${prefix}refresh:page`)).toBeNull();
    });

    it('does not delete a replacement lock after its own lease expires', async () => {
      await first.refresh('page', async () => {
        // Simulate a new worker acquiring an expired lease during a slow render.
        await redis.set(`${prefix}refresh:page`, 'new-owner', { PX: 1000 });
      });
      expect(await redis.get(`${prefix}refresh:page`)).toBe('new-owner');
    });

    it('treats an incompatible cached entry as a miss', async () => {
      await redis.set(`${prefix}page:page`, '<html>old raw HTML format</html>', { PX: 1000 });
      spyOn(console, 'warn');
      expect(await first.get('page')).toBeUndefined();
    });
  });
}
