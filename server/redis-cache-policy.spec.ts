import { RedisCachePolicy } from './redis-cache-policy';

describe('Redis SSR cache route policy', () => {
  const uncached = { timeToLive: 0, refreshWhenTimeBelow: 0 };

  it('bypasses cache when rules are absent, empty or unmatched', () => {
    for (const routes of [undefined, [], [{ pattern: '/custom-page', timeToLive: 1000 }]]) {
      expect(new RedisCachePolicy({ routes }).getDurationsForUrl('/home')).toEqual(uncached);
    }
  });

  it('allows an explicit catch-all without built-in route defaults', () => {
    const policy = new RedisCachePolicy({ routes: [{ pattern: '*', timeToLive: 900000, refreshWhenTimeBelow: 300000 }] });
    for (const path of ['/', '/home', '/entities/service/uuid']) {
      expect(policy.getDurationsForUrl(path)).toEqual({ timeToLive: 900000, refreshWhenTimeBelow: 300000 });
    }
  });

  it('prefers an exact path over a broader pattern regardless of configuration order', () => {
    const routes = [
      { pattern: '*', timeToLive: 10000, refreshWhenTimeBelow: 1000 },
      { pattern: '/entities/*', timeToLive: 30000, refreshWhenTimeBelow: 5000 },
      { pattern: '/entities/service', timeToLive: 60000 },
    ];
    for (const ordered of [routes, [...routes].reverse()]) {
      const policy = new RedisCachePolicy({ routes: ordered });
      expect(policy.getDurationsForUrl('/entities/service')).toEqual({ timeToLive: 60000, refreshWhenTimeBelow: 0 });
      expect(policy.getDurationsForUrl('/entities/publication')).toEqual({ timeToLive: 30000, refreshWhenTimeBelow: 5000 });
      expect(policy.getDurationsForUrl('/home')).toEqual({ timeToLive: 10000, refreshWhenTimeBelow: 1000 });
    }
  });

  it('prefers the longest literal prefix for nested wildcard rules', () => {
    const routes = [
      { pattern: '/entities/*', timeToLive: 30000 },
      { pattern: '/entities/service/*', timeToLive: 60000 },
      { pattern: '/entities/service/special/*', timeToLive: 90000 },
    ];
    for (const ordered of [routes, [...routes].reverse()]) {
      const policy = new RedisCachePolicy({ routes: ordered });
      expect(policy.getDurationsForUrl('/entities/service/uuid').timeToLive).toBe(60000);
      expect(policy.getDurationsForUrl('/entities/service/special/uuid').timeToLive).toBe(90000);
      expect(policy.getDurationsForUrl('/entities/publication/uuid').timeToLive).toBe(30000);
    }
  });

  it('uses additional literal characters when wildcard prefixes have equal length', () => {
    const policy = new RedisCachePolicy({ routes: [
      { pattern: '/entities/*', timeToLive: 30000 },
      { pattern: '/entities/*/details', timeToLive: 60000 },
    ] });
    expect(policy.getDurationsForUrl('/entities/service/details').timeToLive).toBe(60000);
  });

  it('matches the entire path and excludes query parameters from policy selection', () => {
    const policy = new RedisCachePolicy({ routes: [{ pattern: '/entities/service', timeToLive: 60000 }] });
    expect(policy.getDurationsForUrl('/entities/service?query=anything').timeToLive).toBe(60000);
    expect(policy.getDurationsForUrl('/entities/service/uuid')).toEqual(uncached);
    expect(policy.getDurationsForUrl('/entities/services')).toEqual(uncached);
    expect(policy.getDurationsForUrl('/other?next=/entities/service')).toEqual(uncached);
  });

  it('treats regex metacharacters in paths literally and matches case sensitively', () => {
    const policy = new RedisCachePolicy({ routes: [{ pattern: '/custom.v1/[page]+(test)', timeToLive: 60000 }] });
    expect(policy.getDurationsForUrl('/custom.v1/[page]+(test)').timeToLive).toBe(60000);
    expect(policy.getDurationsForUrl('/customXv1/[page]+(test)')).toEqual(uncached);
    expect(policy.getDurationsForUrl('/CUSTOM.v1/[page]+(test)')).toEqual(uncached);
  });

  it('lets a specific rule disable caching even if a catch-all enables it', () => {
    const policy = new RedisCachePolicy({ routes: [
      { pattern: '*', timeToLive: 900000, refreshWhenTimeBelow: 300000 },
      { pattern: '/private/*', timeToLive: 0 },
    ] });
    expect(policy.getDurationsForUrl('/private/page')).toEqual(uncached);
    expect(policy.getDurationsForUrl('/home').timeToLive).toBe(900000);
  });

  it('rejects empty patterns and paths without a leading slash', () => {
    for (const pattern of ['', 'entities/*', '^/entities/']) {
      expect(() => new RedisCachePolicy({ routes: [{ pattern, timeToLive: 1000 }] })).toThrow();
    }
  });

  it('requires a TTL for each route and rejects invalid durations', () => {
    expect(() => new RedisCachePolicy({ routes: [{ pattern: '*', timeToLive: undefined }] })).toThrow();
    for (const duration of [-1, NaN, Infinity]) {
      expect(() => new RedisCachePolicy({ routes: [{ pattern: '*', timeToLive: duration }] })).toThrow();
      expect(() => new RedisCachePolicy({ routes: [{ pattern: '*', timeToLive: 1000, refreshWhenTimeBelow: duration }] })).toThrow();
    }
  });
});
