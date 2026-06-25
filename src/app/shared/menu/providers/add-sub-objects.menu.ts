/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Edit" option in the DSO edit menu
 */
@Injectable()
export class AddSubObjectsMenuProvider extends DSpaceObjectPageMenuProvider {
  constructor(
    protected authorizationDataService: AuthorizationDataService,
  ) {
    super();
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationDataService.isAuthorized(FeatureID.CanEditMetadata, dso.self),
    ]).pipe(
      map(([canEditObject]) => {
        return [
          {
            visible: canEditObject,
            model: {
              type: MenuItemType.LINK,
              text: 'community.add.sub-community',
              link: '/communities/create',
              queryParams: {
                parent: dso.uuid,
              },
            } as LinkMenuItemModel,
            icon: 'plus',
          },
          {
            visible: canEditObject,
            model: {
              type: MenuItemType.LINK,
              text: 'community.add.sub-collection',
              link: '/collections/create',
              queryParams: {
                parent: dso.uuid,
              },
            } as LinkMenuItemModel,
            icon: 'plus',
          },
        ] as PartialMenuSection[];
      }),
    );
  }
}
