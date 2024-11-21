import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { MenuResolverService } from './menu-resolver.service';


/**
 * Initialize all menus
 */
export const menuResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  menuResolverService: MenuResolverService = inject(MenuResolverService),
): Observable<boolean> => {
  return menuResolverService.resolve(route, state);
};
