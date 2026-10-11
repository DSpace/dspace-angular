import {
  createHash,
  randomUUID,
} from 'node:crypto';
import { ServerResponse } from 'node:http';

import {
  Request,
  Response,
} from 'express';
import { createClient } from 'redis';

import { RedisCacheConfig } from '../src/config/cache-config.interface';

export interface CachedPage {
  page: string;
  headers: Record<string, string | number | string[]>;
  statusCode: number;
}

/** Include the deployment, negotiated language and full URL; keep Redis keys bounded. */
export function getRedisCacheKey(baseUrl: string, language: string, url: string): string {
  return createHash('sha256').update(JSON.stringify([baseUrl, language, url])).digest('hex');
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

  constructor(private config: RedisCacheConfig, private debug = false) {
    this.client = createClient({
      url: config.url,
      disableOfflineQueue: true,
      socket: {
        connectTimeout: config.connectTimeout,
        reconnectStrategy: retries => Math.min(100 * (retries + 1), 5000),
      },
    });
    // Do not log connection errors: their messages may contain credentials from the URL.
    this.client.on('error', () => this.reportUnavailable());
    this.client.on('ready', () => {
      this.unavailable = false;
    });
  }

  /** Connect in the background so an unavailable cache cannot delay server startup. */
  connect(): Promise<void> {
    return this.client.connect().then(() => undefined).catch(() => this.reportUnavailable());
  }

  async close(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }

  async get(key: string): Promise<{ value: CachedPage; remainingTime: number } | undefined> {
    return this.execute(async () => {
      const cacheKey = this.pageKey(key);
      const [data, remainingTime] = await Promise.all([this.client.get(cacheKey), this.client.pTTL(cacheKey)]);
      if (!data || remainingTime <= 0) {
        return undefined;
      }
      const value = JSON.parse(data) as CachedPage;
      if (typeof value?.page !== 'string' || !value.headers || typeof value.headers !== 'object'
        || !Number.isInteger(value.statusCode) || value.statusCode < 200 || value.statusCode >= 300) {
        return undefined;
      }
      return { value, remainingTime };
    });
  }

  async set(key: string, value: CachedPage, timeToLive: number): Promise<void> {
    if (!Number.isFinite(timeToLive) || timeToLive <= 0) {
      return;
    }
    await this.execute(() => this.client.set(this.pageKey(key), JSON.stringify(value), { PX: Math.ceil(timeToLive) }));
  }

  /** Only one worker may refresh a page at a time. Expiry recovers locks after crashes. */
  async refresh(key: string, render: () => Promise<void>): Promise<void> {
    const lockKey = `${this.config.keyPrefix}refresh:${key}`;
    const token = randomUUID();
    const acquired = await this.execute(() => this.client.set(lockKey, token, {
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
      await this.execute(() => this.client.eval(
        'if redis.call("GET", KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1]) else return 0 end',
        { keys: [lockKey], arguments: [token] },
      ));
    }
  }

  private pageKey(key: string): string {
    return `${this.config.keyPrefix}page:${key}`;
  }

  private async execute<T>(operation: () => Promise<T>): Promise<T | undefined> {
    if (!this.client.isReady) {
      return undefined;
    }
    let timer: ReturnType<typeof setTimeout>;
    try {
      return await Promise.race([
        operation(),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('Redis command timed out')), this.config.commandTimeout);
        }),
      ]);
    } catch {
      this.reportUnavailable();
      return undefined;
    } finally {
      clearTimeout(timer);
    }
  }

  private reportUnavailable(): void {
    if (!this.unavailable) {
      console.warn('Redis SSR cache unavailable; requests will be rendered without caching.');
      this.unavailable = true;
    } else if (this.debug) {
      console.debug('Redis SSR cache operation failed.');
    }
  }
}
