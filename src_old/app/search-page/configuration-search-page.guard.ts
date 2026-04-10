import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';

/**
 * Assemble the correct i18n key for the configuration search page's title depending on the current route's configuration parameter.
 * The format of the key will be "{configuration}.search.title" with:
 * - configuration: The current configuration stored in route.params
 */
export const configurationSearchPageGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean => {
  const configuration = route.params.configuration;

  const newTitle = `${configuration}.search.title`;

  route.data = { title: newTitle };
  return true;
};
