import { SsrExcludeStrategy } from '../../../config/ssr-config.interface';

/**
 * Default strategy used when `ssr.excludePathStrategy` is not configured.
 */
export const DEFAULT_SSR_EXCLUDE_STRATEGY: SsrExcludeStrategy = 'router';

/**
 * Resolve the configured SSR exclude strategy, falling back to the default.
 */
export function getSsrExcludeStrategy(strategy?: SsrExcludeStrategy): SsrExcludeStrategy {
  return strategy === 'server' || strategy === 'router' ? strategy : DEFAULT_SSR_EXCLUDE_STRATEGY;
}

/**
 * Check whether the given path matches any of the configured SSR exclude patterns.
 *
 * @param path            the url path, without query params or fragment
 * @param excludePatterns the configured `ssr.excludePathPatterns`
 */
export function isExcludedFromSsr(path: string, excludePatterns: RegExp[] = []): boolean {
  return excludePatterns.some((regExp) => regExp.test(path));
}
