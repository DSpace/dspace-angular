import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { MenuSection } from '../menu/menu-section.model';
import { DSOEditMenuResolverService } from './dso-edit-menu-resolver.service';

/**
 * Initialise all dspace object related menus
 */
export const dsoEditMenuResolver: ResolveFn<{ [key: string]: MenuSection[] }> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  menuResolverService: DSOEditMenuResolverService = inject(DSOEditMenuResolverService),
): Observable<{ [key: string]: MenuSection[] }> => {
  return menuResolverService.resolve(route, state);
};
