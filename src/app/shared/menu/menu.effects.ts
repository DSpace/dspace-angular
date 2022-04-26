import { ActivatedRoute } from '@angular/router';
import { hasNoValue, hasValue } from '../empty.util';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MenuService } from './menu.service';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { Injectable } from '@angular/core';
import { map, take, tap } from 'rxjs/operators';
import { MenuSection } from './menu-section.model';
import { MenuID } from './menu-id.model';

/**
 * Effects modifying the state of menus
 */
@Injectable()
export class MenuEffects {

  /**
   * On route change, build menu sections for every menu type depending on the current route data
   */
  public buildRouteMenuSections$: Observable<Action> = createEffect(() => this.actions$
    .pipe(
      ofType(ROUTER_NAVIGATED),
      tap(() => {
        Object.values(MenuID).forEach((menuID) => {
          this.buildRouteMenuSections(menuID);
        });
      })
    ), { dispatch: false });

  constructor(private actions$: Actions,
    private menuService: MenuService,
    private route: ActivatedRoute) {
  }

  /**
   * Build menu sections depending on the current route
   * - Adds sections found in the current route data that aren't active yet
   * - Removes sections that are active, but not present in the current route data
   * @param menuID  The menu to add/remove sections to/from
   */
  buildRouteMenuSections(menuID: MenuID) {
    this.menuService.getNonPersistentMenuSections(menuID).pipe(
      map((sections) => sections.map((section) => section.id)),
      take(1)
    ).subscribe((shouldNotPersistIDs: string[]) => {
      const resolvedSections = this.resolveRouteMenuSections(this.route.root, menuID);
      resolvedSections.forEach((section) => {
        const index = shouldNotPersistIDs.indexOf(section.id);
        if (index > -1) {
          shouldNotPersistIDs.splice(index, 1);
        } else {
          this.menuService.addSection(menuID, section);
        }
      });
      shouldNotPersistIDs.forEach((id) => {
        this.menuService.removeSection(menuID, id);
      });
    });
  }

  /**
   * Resolve menu sections defined in the current route data (including parent routes)
   * @param route   The route to resolve data for
   * @param menuID  The menu to resolve data for
   */
  resolveRouteMenuSections(route: ActivatedRoute, menuID: MenuID): MenuSection[] {
    const data = route.snapshot.data;
    const params = route.snapshot.params;
    const last: boolean = hasNoValue(route.firstChild);

    if (hasValue(data) && hasValue(data.menu) && hasValue(data.menu[menuID])) {
      let menuSections: MenuSection[] | MenuSection = data.menu[menuID];
      menuSections = this.resolveSubstitutions(menuSections, params);

      if (!Array.isArray(menuSections)) {
        menuSections = [menuSections];
      }

      if (!last) {
        return [...menuSections, ...this.resolveRouteMenuSections(route.firstChild, menuID)];
      } else {
        return [...menuSections];
      }
    }

    return !last ? this.resolveRouteMenuSections(route.firstChild, menuID) : [];
  }

  private resolveSubstitutions(object, params) {

    let resolved;
    if (typeof object === 'string') {
      resolved = object;
      let match: RegExpMatchArray;
      do {
        match = resolved.match(/:(\w+)/);
        if (match) {
          const substitute = params[match[1]];
          if (hasValue(substitute)) {
            resolved = resolved.replace(match[0], `${substitute}`);
          }
        }
      } while (match);
    } else if (Array.isArray(object)) {
      resolved = [];
      object.forEach((entry, index) => {
        resolved[index] = this.resolveSubstitutions(object[index], params);
      });
    } else if (typeof object === 'object') {
      resolved = {};
      Object.keys(object).forEach((key) => {
        resolved[key] = this.resolveSubstitutions(object[key], params);
      });
    } else {
      resolved = object;
    }
    return resolved;
  }

}
