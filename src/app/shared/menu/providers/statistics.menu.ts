/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, } from '@angular/router';
import { Observable, of, } from 'rxjs';
import { hasNoValue, hasValue } from '../../empty.util';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider';
import { AbstractRouteContextMenuProvider } from './helper-providers/route-context.menu';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { RemoteData } from '../../../core/data/remote-data';
import { getDSORoute } from '../../../app-routing-paths';

interface StatisticsLink {
  id: string,
  link: string,
}

@Injectable()
export class StatisticsMenuProvider extends AbstractRouteContextMenuProvider<DSpaceObject> {

  public getRouteContext(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DSpaceObject> {
    let dsoRD: RemoteData<DSpaceObject> = route.data.dso;
    // Check if one of the parent routes has a DSO
    while (hasValue(route.parent) && hasNoValue(dsoRD)) {
      route = route.parent;
      dsoRD = route.data.dso;
    }

    if (hasValue(dsoRD) && dsoRD.hasSucceeded && hasValue(dsoRD.payload)) {
      return of(dsoRD.payload);
    } else {
      return of(undefined);
    }
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {

    let link = `statistics`;

    let dsoRoute;
    if (hasValue(dso)) {
      dsoRoute = getDSORoute(dso);
      if (hasValue(dsoRoute)) {
        link = `statistics/${dsoRoute}`;
      }
    }

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
