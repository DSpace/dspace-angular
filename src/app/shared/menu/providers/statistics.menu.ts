/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import { hasValue } from '../../empty.util';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { getDSORoute } from '../../../app-routing-paths';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the statistics menu section depending on the page it is on
 * When the user is on a DSO page or a derivative, this menu section will contain a link to the statistics of that DSO
 * In all other cases the menu section will contain a link to the repository wide statistics
 */
@Injectable()
export class StatisticsMenuProvider extends DSpaceObjectPageMenuProvider {

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {

    let link = `statistics`;

    let dsoRoute;
    if (hasValue(dso)) {
      dsoRoute = getDSORoute(dso);
      if (hasValue(dsoRoute)) {
        link = `statistics${dsoRoute}`;
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

  protected isApplicable(dso: DSpaceObject): boolean {
    return true;
  }

}
