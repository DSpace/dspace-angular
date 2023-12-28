/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';
import { hasNoValue } from '../../empty.util';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider';
import { AbstractRouteContextMenuProvider } from './route-context.menu';

interface StatisticsLink {
  id: string,
  link: string,
}

@Injectable()
export class StatisticsMenuProvider extends AbstractRouteContextMenuProvider<string> {
  allRoutes = false;

  public getRouteContext(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> {
    // todo: this won't work for entities!
    let page = state.url.split('/')[1];
    const uuid = route.params.id;

    // todo: wow
    if (page === 'entities') {
      page = 'items';
    }

    if (
      !['home', 'items', 'communities', 'collections'].includes(page) ||
      (hasNoValue(uuid) && page !== 'home')
    ) {
      return of(undefined);
    }

    if (page === 'home') {
      return of(`statistics`);
    } else {
      return of(`statistics/${page}/${uuid}`);
    }
  }

  public getSectionsForContext(link: string): Observable<PartialMenuSection[]> {
    return of([
      {
        visible: true,
        model: {
          type: MenuItemType.LINK,
          text: 'menu.section.statistics',
          link,
        },
        icon: 'chart-line',
      },
    ] as PartialMenuSection[]);
  }

}
