/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Inject, Injectable, Injector, Optional, } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, ResolveEnd, Router, RouterStateSnapshot, } from '@angular/router';
import { combineLatest, map, Observable, } from 'rxjs';
import { filter, find, switchMap, take, tap, } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { hasValue, isNotEmpty } from '../empty.util';
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
    protected router: Router,
    protected route: ActivatedRoute,
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

  listenForRouteChanges(): Observable<boolean> {
    return this.router.events.pipe(
      filter(event => event instanceof ResolveEnd),
      switchMap((event: ResolveEnd) => {

        const currentRoute = this.getCurrentRoute(event.state.root);

        return this.resolveRouteMenus(currentRoute, event.state);
      }),
    );
  }

  private getCurrentRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }


  public resolvePersistentMenus(
    // route: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot
  ): Observable<boolean> {

    return combineLatest([
        ...this.providers
          .filter(provider => provider.shouldPersistOnRouteChange)
          .map(provider => provider.getSections().pipe(
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
      // ...this.providers
      //   .filter(provider => {
      //     let matchesPath = false;
      //     if (isNotEmpty(provider.activePaths)) {
      //       route.url.forEach((urlSegment) => {
      //         if (provider.activePaths.includes(urlSegment.path)) {
      //           matchesPath = true;
      //         }
      //       })
      //     }
      //     return matchesPath;
      //   })
      //   .map(provider => provider.getSections(route, state).pipe(
      //     tap((sections) => {
      //       sections.forEach((section: MenuSection) => {
      //         this.menuService.addSection(provider.menuID, {
      //           ...section,
      //           id: section.id ?? uuidv4(),
      //           index: section.index ?? provider.index,
      //           shouldPersistOnRouteChange: false,
      //         });
      //       });
      //     }),
      //     switchMap(() => this.waitForMenu$(provider.menuID)),
      //   ))
      ]
    ).pipe(
      map(done => done.every(Boolean)),
    );
  }

  public resolveRouteMenus(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return combineLatest([
      ...Object.values(MenuID).map((menuID) => {
        return this.menuService.getNonPersistentMenuSections(menuID)
          .pipe(
            take(1),
            map((sections) => {
              return {menuId: menuID, sections: sections};
            })
          );
      })]).pipe(
      switchMap((menuSectionsPerMenu) => {
          menuSectionsPerMenu.forEach((menu) => {
            menu.sections.forEach((section) => {
              this.menuService.removeSection(menu.menuId, section.id);
            });
          });


          return combineLatest([
            // ...this.providers
            //   .filter(provider => isEmpty(provider.activePaths))
            //   .map(provider => provider.getSections(route.snapshot, state).pipe(

            //     tap((sections) => {

            //       sections.forEach((section: MenuSection) => {
            //         this.menuService.addSection(provider.menuID, {
            //           ...section,
            //           id: section.id ?? uuidv4(),
            //           index: section.index ?? provider.index,
            //           shouldPersistOnRouteChange: true,
            //         });
            //       });
            //     }),
            //     switchMap(() => this.waitForMenu$(provider.menuID)),
            //   )),
            ...this.providers
              .filter(provider => {
                let shouldUpdate = false;
                if (!provider.shouldPersistOnRouteChange && isNotEmpty(provider.activePaths)) {

                  provider.activePaths.forEach((path) => {
                    if (state.url.includes(path)) {
                      shouldUpdate = true;
                    }
                  });
                } else {
                  if (!provider.shouldPersistOnRouteChange) {

                    shouldUpdate = true;
                  }
                }

                return shouldUpdate;
              })
              .map(provider => provider.getSections(route, state).pipe(
                tap((sections) => {

                  sections.forEach((section: MenuSection) => {
                    this.menuService.addSection(provider.menuID, {
                      ...section,
                      id: section.id ?? uuidv4(),
                      index: section.index ?? provider.index,
                      shouldPersistOnRouteChange: false,
                    });
                  });
                }),
                switchMap(() => this.waitForMenu$(provider.menuID)),
              ))]
          ).pipe(
            map(done => done.every(Boolean)),
          );
        }
      )
    );
  }
}
