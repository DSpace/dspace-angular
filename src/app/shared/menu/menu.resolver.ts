/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  inject,
  Type,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AbstractMenuProvider } from './menu-provider';
import { MenuProviderService } from './menu-provider.service';

// export function resolveStaticMenus(): (ActivatedRouteSnapshot, RouterStateSnapshot, ProviderMenuService) => Observable<boolean> {
//   return (
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot,
//     menuProviderService: MenuProviderService = inject(MenuProviderService),
//   ) => menuProviderService.resolveStaticMenu();
// }
