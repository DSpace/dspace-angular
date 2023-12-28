/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  Inject,
  Injectable,
  Injector,
  Optional,
  Type,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {
  combineLatest,
  forkJoin,
  map,
  Observable,
} from 'rxjs';
import {
  find,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { hasValue } from '../empty.util';
import { MenuID } from './menu-id.model';
import { AbstractMenuProvider } from './menu-provider';
import { MenuSection } from './menu-section.model';
import { MenuState } from './menu-state.model';
import { MenuService } from './menu.service';
import { MENU_PROVIDER } from './menu.structure';

@Injectable({
  providedIn: 'root',
})
export class MenuProviderService {
  constructor(
    @Inject(MENU_PROVIDER) @Optional() protected providers: ReadonlyArray<AbstractMenuProvider>,
    protected menuService: MenuService,
    protected injector: Injector,
  ) {
  }

  /**
   * Wait for a specific menu to appear
   * @param id  the ID of the menu to wait for
   * @return    an Observable that emits true as soon as the menu is created
   */
  protected waitForMenu$(id: MenuID): Observable<boolean> {
    return this.menuService.getMenu(id).pipe(
      find((menu: MenuState) => hasValue(menu)),
      map(() => true),
    );
  }

  public resolveStaticMenu(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return combineLatest(
      this.providers
          .filter(p => p.allRoutes)
          .map(provider => provider.getSections(route, state).pipe(
            tap((sections) => {
              sections.forEach((section: MenuSection) => {
                this.menuService.addSection(provider.menuID, {
                  ...section,
                  id: section.id ?? uuidv4(),
                  index: section.index ?? provider.index,
                  shouldPersistOnRouteChange: true,
                });
              });
            }),
            switchMap(() => this.waitForMenu$(provider.menuID)),
          )),
    ).pipe(
      map(done => done.every(Boolean)),
    );
  }

  public resolveRouteMenu(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ...providerTypes: Type<AbstractMenuProvider>[]
  ): Observable<any> {
    // todo: no why please no
    return forkJoin(
      providerTypes.map(pt => this.injector.get(pt))
                   .map((provider: AbstractMenuProvider) => provider.getSections(route, state).pipe(
                     map(sections => [
                       provider.menuID,
                       sections.map((section: MenuSection) => {
                         return {
                           ...section,
                           id: section.id ?? uuidv4(),
                           index: section.index ?? provider.index,
                           shouldPersistOnRouteChange: false,
                         };
                       }),
                     ]),
                     take(1),
                   )),
    ).pipe(
      map((entries) => {
        return entries.reduce((all, entry) => {
          const menuID = entry[0] as unknown as MenuID;
          const sections = entry[1] as unknown as MenuSection[];

          if (all[menuID] === undefined) {
            all[menuID] = [];
          }
          all[menuID].push(...sections);
          return all;
        }, {});
      }),
    );
  }
}
