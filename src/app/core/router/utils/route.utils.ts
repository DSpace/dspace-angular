import {
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';

import { URLCombiner } from '../../url-combiner/url-combiner';

/**
 * The id of the element marking the top of a search component, used as a
 * URL fragment so the browser scrolls back to the search component (instead
 * of the top of the page) after a search interaction updates the URL.
 */
export const SEARCH_COMPONENT_ANCHOR_ID = 'search-component';

/**
 * Util function to retrieve the current path (without query parameters) the user is on
 * @param router The router service
 */
export function currentPath(router: Router) {
  const urlTree = router.parseUrl(router.url);
  return '/' + urlTree.root.children.primary.segments.map((it) => it.path).join('/');
}

export function currentPathFromSnapshot(route: ActivatedRouteSnapshot): string {
  if (hasValue(route.parent)) {
    const parentRoute: string = currentPathFromSnapshot(route.parent);
    return new URLCombiner(parentRoute, route.routeConfig.path).toString();
  }
  return route.routeConfig ? route.routeConfig.path : '';
}

/**
 * Function to use as `runGuardsAndResolvers` on routes that contain embedded
 * search components (e.g. item, collection and community pages).
 *
 * Resolvers and guards are only re-run when the path of the route itself, or
 * of any of its activated (grand)child routes, actually changes. Query
 * parameter changes caused by search interactions (e.g. selecting a filter or
 * submitting the search form) no longer re-run the resolvers, which prevented
 * the page from being fully reloaded on every search update.
 *
 * @param from The previously activated route snapshot
 * @param to The newly activated route snapshot
 */
export function rerunGuardsAndResolversOnPathChange(from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot): boolean {
  if (JSON.stringify(from.url) !== JSON.stringify(to.url)) {
    return true;
  }
  const fromChild = from.firstChild;
  const toChild = to.firstChild;
  if (hasValue(fromChild) || hasValue(toChild)) {
    if (hasNoValue(fromChild) || hasNoValue(toChild)) {
      return true;
    }
    return rerunGuardsAndResolversOnPathChange(fromChild, toChild);
  }
  return false;
}
