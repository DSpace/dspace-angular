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
  Optional,
} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveEnd,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';
import {
  filter,
  find,
  switchMap,
  take,
} from 'rxjs/operators';

import {
  hasValue,
  isNotEmpty,
} from '../empty.util';
import { MenuService } from './menu.service';
import { MENU_PROVIDER } from './menu.structure';
import { MenuID } from './menu-id.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from './menu-provider.model';
import { MenuRoute } from './menu-route.model';
import { MenuState } from './menu-state.model';

/**
 * Service that is responsible for adding and removing the menu sections created by the providers, both for
 * persistent and non-persistent menu sections
 */
@Injectable({
  providedIn: 'root',
})
export class MenuProviderService {
  constructor(
    @Inject(MENU_PROVIDER) @Optional() protected providers: ReadonlyArray<AbstractMenuProvider>,
    protected menuService: MenuService,
    protected router: Router,
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

  /**
   * Listen for route changes and resolve the route dependent menu sections on route change
   */
  listenForRouteChanges(isServerRendering) {
    this.router.events.pipe(
      filter(event => event instanceof ResolveEnd),
      switchMap((event: ResolveEnd) => {
        const currentRoute = this.getCurrentRoute(event.state.root);
        return this.resolveRouteMenus(currentRoute, event.state, isServerRendering);
      }),
    ).subscribe();
  }

  /**
   * Get the full current route
   */
  private getCurrentRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }


  /**
   * Initialise the persistent menu sections
   */
  public initPersistentMenus(isServerRendering) {
    combineLatest([
      ...this.providers
        .map((provider) => {
          return provider;
        })
        .filter(provider => !(isServerRendering && provider.renderBrowserOnly))
        .filter(provider => provider.shouldPersistOnRouteChange)
        .map(provider => provider.getSections()
          .pipe(
            map((sections) => {
              return { provider: provider, sections: sections };
            }),
          ),
        )])
      .pipe(
        switchMap((providerWithSections: { provider: AbstractMenuProvider, sections: PartialMenuSection[] }[]) => {
          const waitForMenus = providerWithSections.map((providerWithSection: {
            provider: AbstractMenuProvider,
            sections: PartialMenuSection[]
          }, sectionIndex) => {
            providerWithSection.sections.forEach((section, index) => {
              this.addSection(providerWithSection.provider, section, index);
            });
            return this.waitForMenu$(providerWithSection.provider.menuID);
          });
          return [waitForMenus];
        }),
        map(done => done.every(Boolean)),
        take(1),
      ).subscribe();
  }

  /**
   * Resolve the non-persistent route based menu sections
   * @param route - the current route
   * @param state - the current router state
   * @param isServerRendering - whether server side rendering is true
   */
  public resolveRouteMenus(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    isServerRendering,
  ): Observable<boolean> {
    const currentNonPersistentMenuSections$ = combineLatest([
      ...Object.values(MenuID).map((menuID) => {
        return this.menuService.getNonPersistentMenuSections(menuID).pipe(
          take(1),
          map((sections) => {
            return { menuId: menuID, sections: sections };
          }));
      })]);

    const routeDependentMenuSections$ = combineLatest([
      ...this.providers
        .filter(provider => !(isServerRendering && provider.renderBrowserOnly))
        .filter(provider => {
          let shouldUpdate = false;
          if (!provider.shouldPersistOnRouteChange && isNotEmpty(provider.activePaths)) {
            provider.activePaths.forEach((path: MenuRoute) => {
              if (route.data.menuRoute === path) {
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
              return { provider: provider, sections: sections };
            }),
          ),
        ),
    ]);

    return combineLatest([
      currentNonPersistentMenuSections$,
      routeDependentMenuSections$,
    ]).pipe(
      switchMap(([currentMenusWithSections, providerWithSections]) => {
        this.removeNonPersistentSections(currentMenusWithSections);
        const waitForMenus = providerWithSections.map((providerWithSection: {
          provider: AbstractMenuProvider,
          sections: PartialMenuSection[]
        }) => {
          providerWithSection.sections.forEach((section, index) => {
            this.addSection(providerWithSection.provider, section, index);
          });
          return this.waitForMenu$(providerWithSection.provider.menuID);
        });
        return [waitForMenus];
      }),
      map(done => done.every(Boolean)),
    );
  }

  /**
   * Add the provided section combined with information from the menu provider to the menus
   * @param provider - The provider of the section which will be used to provide extra data to the section
   * @param section  - The partial section to be added to the menus
   */
  private addSection(provider: AbstractMenuProvider, section: PartialMenuSection, index: number) {
    this.menuService.addSection(provider.menuID, {
      ...section,
      id: section.id ?? `${provider.menuProviderId}_${index}`,
      parentID: section.parentID ?? provider.parentID,
      index: provider.index,
      active: section.active ?? false,
      shouldPersistOnRouteChange: section.shouldPersistOnRouteChange ?? provider.shouldPersistOnRouteChange,
      alwaysRenderExpandable: section.alwaysRenderExpandable ?? provider.alwaysRenderExpandable,
    });
  }

  /**
   * Remove all non-persistent sections from the menus
   * @param menuWithSections - The menu with its sections to be removed
   */
  private removeNonPersistentSections(menuWithSections) {
    menuWithSections.forEach((menu) => {
      menu.sections.forEach((section) => {
        this.menuService.removeSection(menu.menuId, section.id);
      });
    });
  }
}
