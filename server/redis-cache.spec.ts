import {
  IncomingMessage,
  ServerResponse,
} from 'node:http';
import { Socket } from 'node:net';

import express from 'express';

import { RedisCacheConfig } from '../src/config/cache-config.interface';
import {
  CachedPage,
  canCacheSsrRequest,
  createSsrRefreshContext,
  getRedisCacheKey,
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
    client = {
      isReady: true,
      isOpen: true,
      get: jasmine.createSpy('get').and.returnValue(Promise.resolve(JSON.stringify(value))),
      pTTL: jasmine.createSpy('pTTL').and.returnValue(Promise.resolve(10000)),
      set: jasmine.createSpy('set').and.returnValue(Promise.resolve('OK')),
      eval: jasmine.createSpy('eval').and.returnValue(Promise.resolve(1)),
      disconnect: jasmine.createSpy('disconnect').and.returnValue(Promise.resolve()),
    };
    // Replace the unconnected client; these tests do not require a Redis server.
    (cache as any).client = client;
    spyOn(console, 'warn');
  });

  it('serializes pages with a millisecond TTL and deserializes cached HTML, headers and status', async () => {
    await cache.set('key', value, 900000);
    expect(client.set).toHaveBeenCalledWith('test:page:key', JSON.stringify(value), { PX: 900000 });
    expect(await cache.get('key')).toEqual({ value, remainingTime: 10000 });
    expect(client.get).toHaveBeenCalledWith('test:page:key');
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
