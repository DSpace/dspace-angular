import {
  RedisCacheConfig,
  RedisCacheRouteConfig,
} from '../src/config/cache-config.interface';

export interface RedisCacheDurations {
  timeToLive: number;
  refreshWhenTimeBelow: number;
}

/** Compile administrator-defined route rules once, when the SSR cache is initialized. */
export class RedisCachePolicy {
  private rules: {
    pattern: RegExp;
    durations: RedisCacheDurations;
    exact: boolean;
    prefixLength: number;
    literalLength: number;
    wildcardCount: number;
    index: number;
  }[];

  constructor(config: Pick<RedisCacheConfig, 'routes'>) {
    this.rules = (config.routes ?? []).map((route, index) => {
      if (typeof route.pattern !== 'string' || !route.pattern.length
        || (route.pattern !== '*' && !route.pattern.startsWith('/'))) {
        throw new Error(`Redis cache route ${index} requires a path starting with '/' or the catch-all '*'.`);
      }
      const parts = route.pattern.split('*');
      // Treat all characters except '*' literally, so paths are not regular expressions.
      const expression = parts.map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*');
      return {
        pattern: new RegExp(`^${expression}$`),
        durations: this.getDurations(route),
        exact: parts.length === 1,
        prefixLength: parts[0].length,
        literalLength: parts.join('').length,
        wildcardCount: parts.length - 1,
        index,
      };
    }).sort((first, second) => Number(second.exact) - Number(first.exact)
      || second.prefixLength - first.prefixLength
      || second.literalLength - first.literalLength
      || first.wildcardCount - second.wildcardCount
      || first.index - second.index);
  }

  /** Exact paths, then longest literal prefixes win. Unmatched pages bypass Redis. */
  getDurationsForUrl(url: string): RedisCacheDurations {
    const path = url.split('?')[0];
    const rule = this.rules.find(({ pattern }) => pattern.test(path));
    return { ...(rule?.durations ?? { timeToLive: 0, refreshWhenTimeBelow: 0 }) };
  }

  private getDurations(config: Pick<RedisCacheRouteConfig, 'timeToLive' | 'refreshWhenTimeBelow'>): RedisCacheDurations {
    const timeToLive = config.timeToLive;
    const refreshWhenTimeBelow = config.refreshWhenTimeBelow ?? 0;
    if (!Number.isFinite(timeToLive) || timeToLive < 0
      || !Number.isFinite(refreshWhenTimeBelow) || refreshWhenTimeBelow < 0) {
      throw new Error('Redis cache durations must be finite, non-negative numbers in milliseconds.');
    }
    return { timeToLive, refreshWhenTimeBelow };
  }
}
