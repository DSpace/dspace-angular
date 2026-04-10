/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';

import { getDSORoute } from '../../../app-routing-paths';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { hasValue } from '../../empty.util';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Statistics" menu section in the public navbar. The menu depends on the page it is on.
 * When the user is on a DSO page or a derivative, this menu section will contain a link to the statistics of that DSO
 * In all other cases the menu section will contain a link to the repository wide statistics page.
 */
@Injectable()
export class StatisticsMenuProvider extends DSpaceObjectPageMenuProvider {

  constructor(
    protected authorizationService: AuthorizationDataService,
  ) {
    super();
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.CanViewUsageStatistics, dso?._links.self.href),
    ]).pipe(
      map(([authorized]) => {
        let link = `statistics`;

        let dsoRoute;
        if (hasValue(dso)) {
          dsoRoute = getDSORoute(dso);
          if (hasValue(dsoRoute)) {
            link = `statistics${dsoRoute}`;
          }
        }

        return [
          {
            visible: authorized,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.statistics',
              link,
            },
            icon: 'chart-line',
          },
        ];
      }),
    );
  }

  protected isApplicable(dso: DSpaceObject): boolean {
    return true;
  }

}
