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
import { hasNoValue, hasValue } from '../../empty.util';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider';
import { AbstractRouteContextMenuProvider } from './route-context.menu';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { RemoteData } from '../../../core/data/remote-data';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { getDSORoute } from '../../../app-routing-paths';
import { Community } from '../../../core/shared/community.model';
import { getCommunityPageRoute } from '../../../community-page/community-page-routing-paths';
import { Collection } from '../../../core/shared/collection.model';
import { getCollectionPageRoute } from '../../../collection-page/collection-page-routing-paths';
import { Item } from '../../../core/shared/item.model';
import { getItemModuleRoute, getItemPageRoute } from '../../../item-page/item-page-routing-paths';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';

interface StatisticsLink {
  id: string,
  link: string,
}

@Injectable()
export class StatisticsMenuProvider extends AbstractRouteContextMenuProvider<DSpaceObject> {

  public getRouteContext(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DSpaceObject> {

    let dsoRD: RemoteData<DSpaceObject> = route.data.dso
    while (hasValue(route.parent) && hasNoValue(dsoRD) ) {
      route = route.parent;
      dsoRD = route.data.dso;
    }

    if (hasValue(dsoRD) && dsoRD.hasSucceeded && hasValue(dsoRD.payload)) {
      return of(dsoRD.payload);
    } else {
      return of(undefined);
    }

    // let page = state.url.split('/')[1];
    // let uuid = route.params.id;
    //


    //
    // // todo: wow
    // if (page === 'entities') {
    //   page = 'items';
    // }
    //
    // if (['items', 'communities', 'collections'].includes(page)) {
    //     while (hasValue(route.parent) && hasNoValue(uuid) ) {
    //       route = route.parent;
    //       uuid = route.params.id;
    //     }
    //
    //   if (hasNoValue(uuid)) {
    //     return of(undefined);
    //   } else {
    //     return of(`statistics/${page}/${uuid}`);
    //   }
    // }
    //
    // return of(`statistics`);
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {

    let link = `statistics`;

    let dsoRoute;
    if (hasValue(dso)) {
      // const dsoRoute = getDSORoute(dso) todo maybe have the stats page work on entity url so we can just use the getDSORoute thing 🙄
      if (hasValue(dso)) {
        console.log('DSO',dso);
        switch ((dso as any).type) {
          case Community.type.value:
            dsoRoute = getCommunityPageRoute(dso.uuid);
            break;
          case Collection.type.value:
            dsoRoute = getCollectionPageRoute(dso.uuid);
            break;
          case Item.type.value:
            dsoRoute =  new URLCombiner(getItemModuleRoute(), dso.uuid).toString();
            break;
        }
      }


      if (hasValue(dsoRoute)) {
        link = `statistics/${dsoRoute}`
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
