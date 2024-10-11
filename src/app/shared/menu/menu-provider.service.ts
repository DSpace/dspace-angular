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
import { filter, find, switchMap, take, } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../empty.util';
import { MenuID } from './menu-id.model';
import { AbstractMenuProvider, PartialMenuSection } from './menu-provider';
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

  listenForRouteChanges() {
    this.router.events.pipe(
      filter(event => event instanceof ResolveEnd),
      switchMap((event: ResolveEnd) => {

        const currentRoute = this.getCurrentRoute(event.state.root);

        return this.resolveRouteMenus(currentRoute, event.state);
      }),
    ).subscribe((done) => {
      Object.values(MenuID).forEach((menuID) => {
        this.menuService.buildRouteMenuSections(menuID);
      });
    });
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
        .map((provider) => {
          return provider;
        })
        .filter(provider => provider.shouldPersistOnRouteChange)
        .map(provider => provider.getSections()
          .pipe(
            map((sections) => {
              return {provider: provider, sections: sections};
            }),
          )
        )])
      .pipe(
        switchMap((providerWithSections: { provider: AbstractMenuProvider, sections: PartialMenuSection[] }[]) => {
          const waitForMenus = providerWithSections.map((providerWithSection: {
            provider: AbstractMenuProvider,
            sections: PartialMenuSection[]
          }, sectionIndex) => {
            providerWithSection.sections.forEach((section) => {
              this.addSection(providerWithSection, section);
            });
            return this.waitForMenu$(providerWithSection.provider.menuID);
          });
          return [waitForMenus];
        }),
        map(done => done.every(Boolean)),
      );
  }

  public resolveRouteMenus(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return combineLatest([
      ...Object.values(MenuID).map((menuID) => {
        return this.menuService.getNonPersistentMenuSections(menuID).pipe(
          take(1),
          map((sections) => {
            return {menuId: menuID, sections: sections};
          }));
      })])
      .pipe(
        switchMap((menuSectionsPerMenu) => {
          this.removeNonPersistentSections(menuSectionsPerMenu);
          return combineLatest([
            ...this.providers
              .filter(provider => {
                let shouldUpdate = false;
                if (!provider.shouldPersistOnRouteChange && isNotEmpty(provider.activePaths)) {
                  provider.activePaths.forEach((path) => {
                    if (state.url.includes(path)) {
                      shouldUpdate = true;
                    }
                  });
                } else if (!provider.shouldPersistOnRouteChange) {
                  shouldUpdate = true;
                }
                return shouldUpdate;
              })
              .map(provider => provider.getSections(route, state)
                .pipe(
                  map((sections) => {
                    return {provider: provider, sections: sections};
                  }),
                )
              )
          ]);
        }),
        switchMap((providerWithSections: { provider: AbstractMenuProvider, sections: PartialMenuSection[] }[]) => {
          const waitForMenus = providerWithSections.map((providerWithSection: {
            provider: AbstractMenuProvider,
            sections: PartialMenuSection[]
          }, sectionIndex) => {
            providerWithSection.sections.forEach((section) => {
              this.addSection(providerWithSection, section);
            });
            return this.waitForMenu$(providerWithSection.provider.menuID);
          });
          return [waitForMenus];
        }),
        map(done => done.every(Boolean)),
      );
    // }
  }

  private addSection(providerWithSection: {
    provider: AbstractMenuProvider;
    sections: PartialMenuSection[]
  }, section: PartialMenuSection) {
    this.menuService.addSection(providerWithSection.provider.menuID, {
      ...section,
      id: section.id ?? `${providerWithSection.provider.menuProviderId}`,
      parentID: section.parentID ?? providerWithSection.provider.parentID,
      index: section.index ?? providerWithSection.provider.index,
      shouldPersistOnRouteChange: section.shouldPersistOnRouteChange ?? providerWithSection.provider.shouldPersistOnRouteChange,
      isExpandable: section.isExpandable ?? providerWithSection.provider.isExpandable,
    });
  }

  private removeNonPersistentSections(menuSectionsPerMenu) {
    menuSectionsPerMenu.forEach((menu) => {
      menu.sections.forEach((section) => {
        this.menuService.removeSection(menu.menuId, section.id);
      });
    });
  }
}
