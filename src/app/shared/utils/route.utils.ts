import { Router } from '@angular/router';

/**
 * Util function to retrieve the current path (without query parameters) the user is on
 * @param router The router service
 */
export function currentPath(router: Router) {
  const urlTree = router.parseUrl(router.url);
  return '/' + urlTree.root.children.primary.segments.map((it) => it.path).join('/')
}
