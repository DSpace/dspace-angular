import {
  createHash,
  randomUUID,
} from 'node:crypto';
import { ServerResponse } from 'node:http';
import { promisify } from 'node:util';
import {
  gunzip,
  gzip,
} from 'node:zlib';

import {
  Request,
  Response,
} from 'express';
import { createClient } from 'redis';

import { RedisCacheConfig } from '../src/config/cache-config.interface';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

export interface CachedPage {
  page: string;
  headers: Record<string, string | number | string[]>;
  statusCode: number;
}

/** Include the deployment, negotiated language and full URL; keep Redis keys bounded. */
export function getRedisCacheKey(baseUrl: string, language: string, url: string): string {
  return createHash('sha256').update(JSON.stringify([baseUrl, language, url])).digest('hex');
}

/** Use one language for the cache key, SSR translations and REST requests. */
export function normalizeSsrCacheLanguage(req: Request, res: Response, languages: string[], fallback: string): void {
  const cookieLanguage = req.cookies?.dsLanguage;
  const requestedLanguage = req.get('accept-language') && languages.length > 0 && req.acceptsLanguages(languages);
  req.headers['accept-language'] = languages.includes(cookieLanguage)
    ? cookieLanguage : requestedLanguage || fallback;
  res.vary('Accept-Language');
  res.vary('Cookie');
}

/** Shared SSR pages must never contain authenticated or route-specific private responses. */
export function canCacheSsrRequest(req: Request, production: boolean, ssrEnabled: boolean,
  authenticationCookie: string, isExcluded: (path: string) => boolean): boolean {
  return production && ssrEnabled && req.method === 'GET'
    && !req.cookies?.[authenticationCookie] && !req.get('authorization')
    && !req.path.startsWith('/reload') && (req.path === '/' || !isExcluded(req.path));
}

/** Keep response mutations made by a background render away from the live request. */
export function createSsrRefreshContext(req: Request, res: Response): { request: Request; response: Response } {
  const request = Object.assign(Object.create(Object.getPrototypeOf(req)), req) as Request;
  const response = new ServerResponse(request) as unknown as Response;
  Object.setPrototypeOf(response, Object.getPrototypeOf(res));
  Object.assign(response, { locals: {}, req: request });
  request.res = response;
  return { request, response };
}

/** Shared SSR cache. Redis failures are cache misses and never prevent rendering. */
export class RedisSsrCache {
  private client: ReturnType<typeof createClient>;
  private unavailable = false;
  private invalidEntryReported = false;
  private memoryConfiguration?: Promise<string | undefined>;
  private pendingWrites = 0;

  constructor(private config: RedisCacheConfig, private debug = false) {
    const maxMemory = config.maxMemory ?? 0;
    if (!Number.isSafeInteger(maxMemory) || maxMemory < 0 || !Number.isSafeInteger(maxMemory * 1024 * 1024)) {
      throw new Error('Redis maxMemory must be a non-negative integer in MiB within the safe byte range.');
    }
    if (config.evictionPolicy !== undefined && !['allkeys-lru', 'allkeys-lfu'].includes(config.evictionPolicy)) {
      throw new Error('Redis evictionPolicy must be allkeys-lru or allkeys-lfu.');
    }
    this.client = createClient({
      url: config.url,
      disableOfflineQueue: true,
      socket: {
        connectTimeout: config.connectTimeout,
        reconnectStrategy: retries => Math.min(100 * (retries + 1), 5000),
      },
    });
    // Do not log connection errors: their messages may contain credentials from the URL.
    this.client.on('error', error => this.reportFailure('connect', error));
    this.client.on('ready', () => {
      this.unavailable = false;
      if (maxMemory > 0) {
        this.memoryConfiguration = this.execute('configure-memory', () => this.client.configSet({
          maxmemory: String(maxMemory * 1024 * 1024),
          'maxmemory-policy': config.evictionPolicy ?? 'allkeys-lfu',
        }));
      }
    });
  }

  /** Connect in the background so an unavailable cache cannot delay server startup. */
  connect(): Promise<void> {
    return this.client.connect().then(async () => {
      await this.memoryConfiguration;
    }).catch(error => this.reportFailure('connect', error));
  }

  async close(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }

  async get(key: string): Promise<{ value: CachedPage; remainingTime: number } | undefined> {
    return this.execute('get', async () => {
      const cacheKey = this.pageKey(key);
      const [data, remainingTime] = await Promise.all([this.client.get(cacheKey), this.client.pTTL(cacheKey)]);
      if (!data || remainingTime <= 0) {
        return undefined;
      }
      const value = JSON.parse(data) as CachedPage & { compressed?: boolean };
      if (typeof value?.page !== 'string' || !value.headers || typeof value.headers !== 'object'
        || value.statusCode !== 200 || (value.compressed !== undefined && typeof value.compressed !== 'boolean')) {
        throw new SyntaxError('Invalid cached page');
      }
      if (value.compressed) {
        try {
          value.page = (await gunzipAsync(Buffer.from(value.page, 'base64'))).toString('utf8');
        } catch {
          throw new SyntaxError('Invalid compressed cached page');
        }
      }
      delete value.compressed;
      return { value, remainingTime };
    });
  }

  async set(key: string, value: CachedPage, timeToLive: number): Promise<void> {
    if (!Number.isFinite(timeToLive) || timeToLive <= 0) {
      return;
    }
    await this.execute('set', async () => {
      if (this.pendingWrites >= 20) { return; }
      this.pendingWrites++;
      try {
        const stored = this.config.compressHtml
          ? { ...value, page: (await gzipAsync(value.page)).toString('base64'), compressed: true }
          : value;
        return await this.client.set(this.pageKey(key), JSON.stringify(stored), { PX: Math.ceil(timeToLive) });
      } finally {
        this.pendingWrites--;
      }
    });
  }

  /** Only one worker may refresh a page at a time. Expiry recovers locks after crashes. */
  async refresh(key: string, render: () => Promise<void>): Promise<void> {
    const lockKey = `${this.config.keyPrefix}refresh:${key}`;
    const token = randomUUID();
    const acquired = await this.execute('refresh-lock', () => this.client.set(lockKey, token, {
      NX: true,
      PX: this.config.refreshLockTimeToLive,
    }));
    if (acquired !== 'OK') {
      return;
    }
    try {
      await render();
    } catch {
      console.warn('Background SSR cache refresh failed.');
    } finally {
      // A slow render must not delete a lock subsequently acquired by another worker.
      await this.execute('refresh-unlock', () => this.client.eval(
        'if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end',
        { keys: [lockKey], arguments: [token] },
      ));
    }
  }

  private pageKey(key: string): string {
    return `${this.config.keyPrefix}page:${key}`;
  }

  private async execute<T>(name: string, operation: () => Promise<T>): Promise<T | undefined> {
    if (!this.client.isReady) {
      return undefined;
    }
    if (name !== 'configure-memory' && this.config.maxMemory > 0 && await this.memoryConfiguration !== 'OK') {
      return undefined;
    }
    let timer: ReturnType<typeof setTimeout>;
    try {
      return await Promise.race([
        operation(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(Object.assign(new Error('Redis command timed out'), { code: 'ETIMEDOUT' })), this.config.commandTimeout);
        }),
      ]);
    } catch (error) {
      this.reportFailure(name, error);
      return undefined;
    } finally {
      clearTimeout(timer);
    }
  }

  private reportFailure(operation: string, error: unknown): void {
    const code = (error as { code?: unknown })?.code;
    const context = `Redis SSR cache ${operation} failed (${typeof code === 'string' && code ? code : 'no error code'}).`;
    if (error instanceof SyntaxError) {
      if (!this.invalidEntryReported) {
        console.warn(`${context} Invalid cached entry ignored.`);
        this.invalidEntryReported = true;
      } else if (this.debug) {
        console.debug(context);
      }
      return;
    }
    if (!this.unavailable) {
      console.warn(`${context} Continuing without cache for this operation.`);
      this.unavailable = true;
    } else if (this.debug) {
      console.debug(context);
    }
  }
}
