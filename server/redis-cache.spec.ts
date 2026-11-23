import {
  IncomingMessage,
  ServerResponse,
} from 'node:http';
import { Socket } from 'node:net';
import { gunzipSync } from 'node:zlib';

import express from 'express';

import { RedisCacheConfig } from '../src/config/cache-config.interface';
import {
  CachedPage,
  canCacheSsrRequest,
  createSsrRefreshContext,
  getRedisCacheKey,
  normalizeSsrCacheLanguage,
  RedisSsrCache,
} from './redis-cache';

describe('Redis SSR cache', () => {
  let cache: RedisSsrCache;
  let client: any;
  let config: RedisCacheConfig;
  const value: CachedPage = { page: '<html>page</html>', headers: { Link: ['<item>; rel="item"'] }, statusCode: 200 };

  beforeEach(() => {
    config = {
      enabled: true, url: 'redis://localhost:6379', keyPrefix: 'test:',
      connectTimeout: 1000, commandTimeout: 20, refreshLockTimeToLive: 60000,
      routes: [],
    };
    cache = new RedisSsrCache(config);
    const redisClient = (cache as any).client;
    client = {
      isReady: true,
      isOpen: true,
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(JSON.stringify(value))),
      pTTL: jasmine.createSpy('pTTL').and.returnValue(Promise.resolve(10000)),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve('OK')),
      eval: jasmine.createSpy('eval').and.returnValue(Promise.resolve(1)),
      disconnect: jasmine.createSpy('disconnect').and.returnValue(Promise.resolve()),
      configSet: jasmine.createSpy('configSet').and.returnValue(Promise.resolve('OK')),
      connect: jasmine.createSpy('connect').and.callFake(async () => {
        redisClient.emit('ready');
      }),
    };
    // Replace the unconnected client; these tests do not require a Redis server.
    (cache as any).client = client;
    spyOn(console, 'warn');
  });

  it('leaves Redis memory settings unchanged by default', async () => {
    await cache.connect();
    expect(client.configSet).not.toHaveBeenCalled();
  });

  it('rejects invalid memory limits and eviction policies before connecting', () => {
    for (const maxMemory of [-1, 0.5, NaN, Infinity, 2 ** 33, Number.MAX_SAFE_INTEGER + 1]) {
      expect(() => new RedisSsrCache({ ...config, maxMemory })).toThrowError(/maxMemory/);
    }
    expect(() => new RedisSsrCache({ ...config, evictionPolicy: 'noeviction' as any })).toThrowError(/evictionPolicy/);
  });

  describe('Redis memory settings', () => {
    beforeEach(() => {
      config.maxMemory = 512;
      cache = new RedisSsrCache(config);
      const redisClient = (cache as any).client;
      client.connect.and.callFake(async () => {
        redisClient.emit('ready');
      });
      (cache as any).client = client;
    });

    it('converts the memory limit from MiB to bytes and defaults to LFU', async () => {
      await cache.connect();
      expect(client.configSet).toHaveBeenCalledOnceWith({ maxmemory: '536870912', 'maxmemory-policy': 'allkeys-lfu' });
    });

    it('supports LRU and reapplies settings after reconnecting', async () => {
      config.evictionPolicy = 'allkeys-lru';
      await cache.connect();
      await cache.connect();
      expect(client.configSet).toHaveBeenCalledTimes(2);
      expect(client.configSet).toHaveBeenCalledWith({ maxmemory: '536870912', 'maxmemory-policy': 'allkeys-lru' });
    });

    it('waits for memory configuration before using the cache', async () => {
      let finish: (result: string) => void;
      client.configSet.and.returnValue(new Promise<string>(resolve => finish = resolve));
      const connecting = cache.connect();
      const reading = cache.get('key');
      expect(client.get).not.toHaveBeenCalled();
      finish('OK');
      await connecting;
      expect(await reading).toEqual({ value, remainingTime: 10000 });
    });

    it('bypasses the cache if CONFIG SET is denied and recovers after reconnecting', async () => {
      client.configSet.and.callFake(() => Promise.reject(new Error('NOPERM private details')));
      await cache.connect();
      expect(await cache.get('key')).toBeUndefined();
      await cache.set('key', value, 1000);
      await cache.refresh('key', jasmine.createSpy('render'));
      expect(client.get).not.toHaveBeenCalled();
      expect(client.set).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledOnceWith('Redis SSR cache configure-memory failed (no error code). Continuing without cache for this operation.');
      client.configSet.and.returnValue(Promise.resolve('OK'));
      await cache.connect();
      expect(await cache.get('key')).toEqual({ value, remainingTime: 10000 });
    });

    it('bypasses the cache when memory configuration times out', async () => {
      client.configSet.and.returnValue(new Promise(() => undefined));
      await cache.connect();
      expect(await cache.get('key')).toBeUndefined();
      expect(client.get).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledOnceWith('Redis SSR cache configure-memory failed (ETIMEDOUT). Continuing without cache for this operation.');
    });
  });

  it('serializes pages with a millisecond TTL and deserializes cached HTML, headers and status', async () => {
    await cache.set('key', value, 900000);
    expect(client.set).toHaveBeenCalledWith('test:page:key', JSON.stringify(value), { PX: 900000 });
    expect(await cache.get('key')).toEqual({ value, remainingTime: 10000 });
    expect(client.get).toHaveBeenCalledWith('test:page:key');
  });

  it('compresses HTML without changing headers, status, TTL or the original value', async () => {
    config.compressHtml = true;
    const page = { ...value, page: `<html>${'Zażółć gęślą jaźń 🌍'.repeat(1000)}</html>` };
    await cache.set('key', page, 900000);
    const [key, data, options] = client.set.calls.mostRecent().args;
    const stored = JSON.parse(data);
    expect(key).toBe('test:page:key');
    expect(options).toEqual({ PX: 900000 });
    expect(stored.compressed).toBe(true);
    expect(stored.headers).toEqual(page.headers);
    expect(stored.statusCode).toBe(200);
    expect(data.length).toBeLessThan(JSON.stringify(page).length);
    expect(gunzipSync(Buffer.from(stored.page, 'base64')).toString('utf8')).toBe(page.page);
    expect(page).toEqual({ ...value, page: `<html>${'Zażółć gęślą jaźń 🌍'.repeat(1000)}</html>` });

    client.get.and.returnValue(Promise.resolve(data));
    expect(await cache.get('key')).toEqual({ value: page, remainingTime: 10000 });
    config.compressHtml = false;
    expect(await cache.get('key')).toEqual({ value: page, remainingTime: 10000 });
    await cache.set('key', page, 900000);
    expect(client.set.calls.mostRecent().args[1]).toBe(JSON.stringify(page));
  });

  it('reads existing uncompressed entries when compression is enabled', async () => {
    config.compressHtml = true;
    expect(await cache.get('key')).toEqual({ value, remainingTime: 10000 });
  });

  it('ignores corrupt compressed entries without marking Redis as unavailable', async () => {
    for (const compressed of [true, 'gzip']) {
      client.get.and.returnValue(Promise.resolve(JSON.stringify({ ...value, compressed })));
      expect(await cache.get('key')).toBeUndefined();
    }
    expect(console.warn).toHaveBeenCalledOnceWith('Redis SSR cache get failed (no error code). Invalid cached entry ignored.');
    client.get.and.returnValue(Promise.resolve(JSON.stringify(value)));
    expect(await cache.get('key')).toEqual({ value, remainingTime: 10000 });
    client.get.and.callFake(() => Promise.reject(Object.assign(new Error(), { code: 'ECONNRESET' })));
    expect(await cache.get('key')).toBeUndefined();
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('treats missing and expired entries as cache misses', async () => {
    client.get.and.returnValue(Promise.resolve(null));
    expect(await cache.get('key')).toBeUndefined();
    client.get.and.returnValue(Promise.resolve(JSON.stringify(value)));
    for (const ttl of [0, -1, -2]) {
      client.pTTL.and.returnValue(Promise.resolve(ttl));
      expect(await cache.get('key')).toBeUndefined();
    }
  });

  it('treats malformed entries as cache misses', async () => {
    for (const data of ['not json', 'null', '"<html>"', '{}']) {
      client.get.and.returnValue(Promise.resolve(data));
      expect(await cache.get('key')).toBeUndefined();
    }
    expect(console.warn).toHaveBeenCalledOnceWith('Redis SSR cache get failed (no error code). Invalid cached entry ignored.');
    client.get.and.callFake(() => Promise.reject(new Error('connection failed')));
    expect(await cache.get('key')).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith('Redis SSR cache get failed (no error code). Continuing without cache for this operation.');
  });

  it('treats entries without HTTP status 200 as cache misses', async () => {
    for (const statusCode of [undefined, null, '200', 200.5, 100, 199, 201, 203, 204, 206, 299, 301, 304, 404, 500]) {
      client.get.and.returnValue(Promise.resolve(JSON.stringify({ ...value, statusCode })));
      expect(await cache.get('key')).withContext(`statusCode: ${statusCode}`).toBeUndefined();
    }
  });

  it('does not cache routes with a disabled or invalid TTL', async () => {
    for (const ttl of [0, -1, NaN, Infinity]) {
      await cache.set('key', value, ttl);
    }
    expect(client.set).not.toHaveBeenCalled();
  });

  it('limits writes to 20, including commands still running after a timeout', async () => {
    let finish: (result: string) => void;
    const command = new Promise<string>(resolve => finish = resolve);
    client.set.and.returnValue(command);
    const writes = Array.from({ length: 20 }, (_, i) => cache.set(`key:${i}`, value, 1000));
    await cache.set('overflow', value, 1000);
    expect(client.set).toHaveBeenCalledTimes(20);
    await Promise.all(writes);
    await cache.set('after-timeout', value, 1000);
    expect(client.set).toHaveBeenCalledTimes(20);
    finish('OK');
    await command;
    await cache.set('after-completion', value, 1000);
    expect(client.set).toHaveBeenCalledTimes(21);
  });

  it('releases write slots after failed commands', async () => {
    client.set.and.callFake(() => Promise.reject(new Error('failed')));
    await Promise.all(Array.from({ length: 20 }, (_, i) => cache.set(`key:${i}`, value, 1000)));
    client.set.and.returnValue(Promise.resolve('OK'));
    await cache.set('next', value, 1000);
    expect(client.set).toHaveBeenCalledTimes(21);
  });

  it('does not queue operations during a Redis outage', async () => {
    client.isReady = false;
    expect(await cache.get('key')).toBeUndefined();
    await cache.set('key', value, 1000);
    const render = jasmine.createSpy('render');
    await cache.refresh('key', render);
    expect(client.get).not.toHaveBeenCalled();
    expect(client.set).not.toHaveBeenCalled();
    expect(render).not.toHaveBeenCalled();
  });

  it('continues without cache when Redis commands reject', async () => {
    client.get.and.callFake(() => Promise.reject(new Error('unavailable')));
    client.set.and.callFake(() => Promise.reject(new Error('unavailable')));
    expect(await cache.get('key')).toBeUndefined();
    await cache.set('key', value, 1000);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('logs error codes or a fallback without exposing error messages, URLs or keys', async () => {
    const secret = 'redis://user:password@private-host:6379';
    const cases: [Error, string][] = [
      [Object.assign(new Error(secret), { code: 'ECONNREFUSED' }), 'ECONNREFUSED'],
      [Object.assign(new Error(secret), { code: 'ETIMEDOUT' }), 'ETIMEDOUT'],
      [new Error(secret), 'no error code'],
      [Object.assign(new Error(secret), { code: '' }), 'no error code'],
      [Object.assign(new Error(secret), { code: 123 }), 'no error code'],
    ];
    for (const [error, code] of cases) {
      const testedCache = new RedisSsrCache(config);
      (testedCache as any).client = client;
      client.get.and.callFake(() => Promise.reject(error));
      (console.warn as jasmine.Spy).calls.reset();
      expect(await testedCache.get(secret)).toBeUndefined();
      expect(console.warn).toHaveBeenCalledOnceWith(`Redis SSR cache get failed (${code}). Continuing without cache for this operation.`);
    }
  });

  it('includes operation context in debug logs without repeating warnings', async () => {
    (cache as any).debug = true;
    spyOn(console, 'debug');
    client.get.and.callFake(() => Promise.reject(new Error('private details')));
    client.set.and.callFake(() => Promise.reject(Object.assign(new Error('private details'), { code: 'ETIMEDOUT' })));
    await cache.get('key');
    await cache.set('key', value, 1000);
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.debug).toHaveBeenCalledOnceWith('Redis SSR cache set failed (ETIMEDOUT).');
  });

  it('logs connection failures once and allows a new warning after reconnecting', async () => {
    const testedCache = new RedisSsrCache(config);
    const redisClient = (testedCache as any).client;
    const error = Object.assign(new Error('private connection details'), { code: 'ECONNREFUSED' });
    spyOn(redisClient, 'connect').and.returnValue(Promise.reject(error));
    await testedCache.connect();
    redisClient.emit('error', error);
    expect(console.warn).toHaveBeenCalledOnceWith('Redis SSR cache connect failed (ECONNREFUSED). Continuing without cache for this operation.');
    redisClient.emit('ready');
    redisClient.emit('error', error);
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('bounds the time spent waiting for an unresponsive Redis connection', async () => {
    client.get.and.returnValue(new Promise(() => undefined));
    expect(await cache.get('key')).toBeUndefined();
    expect(console.warn).toHaveBeenCalledOnceWith('Redis SSR cache get failed (ETIMEDOUT). Continuing without cache for this operation.');
  });

  it('does not refresh if another worker owns the lock', async () => {
    client.set.and.returnValue(Promise.resolve(null));
    const render = jasmine.createSpy('render');
    await cache.refresh('key', render);
    expect(render).not.toHaveBeenCalled();
    expect(client.eval).not.toHaveBeenCalled();
  });

  it('disconnects the Redis connection at shutdown', async () => {
    await cache.close();
    expect(client.disconnect).toHaveBeenCalledTimes(1);
    client.isOpen = false;
    await cache.close();
    expect(client.disconnect).toHaveBeenCalledTimes(1);
  });
});

describe('Redis cache keys', () => {
  it('isolates deployments, languages, namespaces and query strings', () => {
    const key = getRedisCacheKey('https://example.org', 'en', '/dspace/search?query=a');
    expect(key).toBe(getRedisCacheKey('https://example.org', 'en', '/dspace/search?query=a'));
    for (const args of [
      ['https://another.org', 'en', '/dspace/search?query=a'],
      ['https://example.org', 'pl', '/dspace/search?query=a'],
      ['https://example.org', 'en', '/search?query=a'],
      ['https://example.org', 'en', '/dspace/search?query=b'],
    ]) {
      expect(getRedisCacheKey(args[0], args[1], args[2])).not.toBe(key);
    }
  });
});

describe('SSR cache language', () => {
  const app = express();

  function normalize(header?: string, cookie?: string, languages = ['en', 'en-US', 'de', 'pt-BR']) {
    const req = new IncomingMessage(new Socket()) as express.Request;
    const res = new ServerResponse(req) as express.Response;
    Object.setPrototypeOf(req, app.request);
    Object.setPrototypeOf(res, app.response);
    if (header !== undefined) {
      req.headers['accept-language'] = header;
    }
    req.cookies = { dsLanguage: cookie };
    res.setHeader('Vary', 'Accept-Encoding');
    normalizeSsrCacheLanguage(req, res, languages, 'en');
    const language = req.get('accept-language');
    return { req, res, language, key: getRedisCacheKey('https://example.org', language, '/home') };
  }

  it('shares keys for equivalent language preferences and canonicalizes the SSR request', () => {
    for (const [headers, expected] of [
      [['en-US,en;q=0.9', 'en-US,en;q=0.8', 'EN-us, en;q=0.5'], 'en-US'],
      [['de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7', 'de,en;q=0.5'], 'de'],
    ] as [string[], string][]) {
      const results = headers.map(header => normalize(header));
      for (const result of results) {
        expect(result.language).toBe(expected);
        expect(result.req.headers['accept-language']).toBe(expected);
        expect(result.key).toBe(results[0].key);
      }
    }
    expect(normalize('de').key).not.toBe(normalize('en').key);
  });

  it('uses quality values and regional matches to select an active language', () => {
    expect(normalize('en;q=0.1,de;q=0.9').language).toBe('de');
    expect(normalize('de;q=0,en;q=0.5').language).toBe('en');
    expect(normalize('pt-PT, en;q=0.5').language).toBe('en');
    expect(normalize('pt-BR, en;q=0.5').language).toBe('pt-BR');
    expect(normalize('de-DE').language).toBe('de');
  });

  it('gives an active cookie precedence over browser preferences, including for REST requests', () => {
    const result = normalize('en-US,en;q=0.8', 'de');
    expect(result.language).toBe('de');
    expect(result.req.headers['accept-language']).toBe('de');
    expect(result.key).toBe(normalize('de').key);
  });

  it('ignores cookies for languages that are not active', () => {
    expect(normalize('de', 'fr').language).toBe('de');
  });

  it('uses the fallback for missing or unsupported preferences and an empty active list', () => {
    for (const header of [undefined, '', 'xx', 'de;q=0']) {
      expect(normalize(header).language).toBe('en');
    }
    expect(normalize('de', undefined, []).language).toBe('en');
    expect(normalize(undefined, undefined, ['de', 'en']).language).toBe('en');
    expect(normalize('*').language).toBe('en');
  });

  it('varies responses by language and cookies without replacing existing Vary fields', () => {
    const { res } = normalize('de');
    expect(res.getHeader('Vary')).toBe('Accept-Encoding, Accept-Language, Cookie');
  });
});

describe('Background SSR response', () => {
  it('preserves Express response methods and isolates headers, status, locals and req.res', () => {
    const app = express();
    const req = new IncomingMessage(new Socket()) as express.Request;
    const res = new ServerResponse(req) as express.Response;
    Object.setPrototypeOf(req, app.request);
    Object.setPrototypeOf(res, app.response);
    Object.assign(res, { req, locals: { foreground: true } });
    req.url = '/search?query=test';
    req.baseUrl = '/dspace';
    req.res = res;
    res.setHeader('Link', 'original');

    const background = createSsrRefreshContext(req, res);
    req.url = '/dspace/search?query=test';
    req.baseUrl = '';
    expect(background.request.url).toBe('/search?query=test');
    expect(background.request.baseUrl).toBe('/dspace');
    background.response.status(203).setHeader('Link', 'updated');
    background.response.locals.updated = true;
    expect(background.request.res).toBe(background.response);
    expect(req.res).toBe(res);
    expect(res.statusCode).toBe(200);
    expect(res.getHeader('Link')).toBe('original');
    expect(res.locals).toEqual({ foreground: true });
    expect(background.response.headersSent).toBe(false);
    expect(background.response.getHeader('Link')).toBe('updated');
  });
});

describe('SSR cache request eligibility', () => {
  function request(path: string, cookie?: string, authorization?: string): express.Request {
    return {
      path, method: 'GET', cookies: { token: cookie },
      get: () => authorization,
    } as unknown as express.Request;
  }

  const excluded = (path: string) => path.startsWith('/login') || path.startsWith('/bitstreams');

  it('allows anonymous SSR pages only in production', () => {
    expect(canCacheSsrRequest(request('/search'), true, true, 'token', excluded)).toBe(true);
    expect(canCacheSsrRequest(request('/search'), false, true, 'token', excluded)).toBe(false);
    expect(canCacheSsrRequest(request('/search'), true, false, 'token', excluded)).toBe(false);
  });

  it('bypasses requests authenticated by cookie or Authorization header', () => {
    expect(canCacheSsrRequest(request('/search', 'jwt'), true, true, 'token', excluded)).toBe(false);
    expect(canCacheSsrRequest(request('/search', undefined, 'Bearer jwt'), true, true, 'token', excluded)).toBe(false);
  });

  it('bypasses reload and excluded paths, but allows the SSR root', () => {
    for (const path of ['/reload/random', '/login', '/bitstreams/uuid/download']) {
      expect(canCacheSsrRequest(request(path), true, true, 'token', excluded)).toBe(false);
    }
    expect(canCacheSsrRequest(request('/'), true, true, 'token', () => true)).toBe(true);
  });

  it('bypasses non-GET requests', () => {
    const req = request('/search');
    req.method = 'POST';
    expect(canCacheSsrRequest(req, true, true, 'token', excluded)).toBe(false);
  });
});
