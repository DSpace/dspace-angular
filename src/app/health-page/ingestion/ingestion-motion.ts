/**
 * Se o usuário pediu menos movimento no sistema operacional. As animações em CSS
 * já respeitam `prefers-reduced-motion` por media query; o accordion do
 * ng-bootstrap anima via JS, então precisa da checagem em código.
 */
export function prefersReducedMotion(isBrowser: boolean): boolean {
  if (!isBrowser || typeof matchMedia !== 'function') {
    return false;
  }
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
