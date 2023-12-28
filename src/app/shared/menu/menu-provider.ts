/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Omit } from '@material-ui/core';
import flatten from 'lodash/flatten';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuID } from './menu-id.model';
import { MenuSection } from './menu-section.model';

export type PartialMenuSection = Omit<MenuSection, 'id' | 'active'>;

export interface MenuProvider {
  allRoutes?: boolean,
  menuID?: MenuID;
  index?: number;

  getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<PartialMenuSection[]>;
}

export abstract class AbstractMenuProvider implements MenuProvider {
  public allRoutes = true;
  menuID?: MenuID;
  index?: number;

  abstract getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<PartialMenuSection[]>;

  protected concat(...sections$: Observable<PartialMenuSection[]>[]): Observable<PartialMenuSection[]> {
    return combineLatest(sections$).pipe(
      map(sections => flatten(sections)),
    );
  }
}


