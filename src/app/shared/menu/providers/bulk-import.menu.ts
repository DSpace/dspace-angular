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
import { Collection } from '@dspace/core/shared/collection.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import {
  map,
  Observable,
} from 'rxjs';
import { getBulkImportRoute } from 'src/app/app-routing-paths';

import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Bulk import" option in the collection menu
 */
@Injectable()
export class BulkImportMenuProvider extends DSpaceObjectPageMenuProvider {
  constructor(
    protected authorizationDataService: AuthorizationDataService,
  ) {
    super();
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return this.authorizationDataService.isAuthorized(FeatureID.AdministratorOf, dso.self, undefined, false).pipe(
      map((isAuthorized: boolean) => {
        return [{
          model: {
            type: MenuItemType.LINK,
            text: 'context-menu.actions.bulk-import.btn',
            link: getBulkImportRoute(dso as Collection),
          } as LinkMenuItemModel,
          visible: isAuthorized,
        }] as PartialMenuSection[];
      }),
    );
  }
}
