/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import {
  map,
  Observable,
} from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { MenuItemType } from '../menu-item-type.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../menu-provider.model';

/**
 * Menu provider to create the "Admin Search" menu in the admin sidebar
 */
@Injectable()
export class AdminSearchMenuProvider extends AbstractMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
  ) {
    super();
  }

  public getSections(): Observable<PartialMenuSection[]> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
      map((isSiteAdmin) => {
        return [
          {
            visible: isSiteAdmin,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.admin_search',
              link: '/admin/search',
            },
            icon: 'search',
          },
        ];
      }),
    );
  }
}
