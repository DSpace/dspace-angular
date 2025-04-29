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

import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Audit" option in the DSO audit menu
 */
@Injectable()
export class AuditLogsMenuProvider extends DSpaceObjectPageMenuProvider {
  constructor(
    protected authorizationDataService: AuthorizationDataService,
    protected configurationDataService: ConfigurationDataService,
  ) {
    super();
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return this.configurationDataService.findByPropertyName('context-menu-entry.audit.enabled').pipe(
      getFirstCompletedRemoteData(),
      map((rd) => {
        return rd.hasSucceeded ? rd.payload.values.length > 0 && rd.payload.values[0] === 'true' : false;
        debugger;
      }),
      map((isAuditEnabled) => {
        return [{
          model: {
            type: MenuItemType.TEXT,
            text: 'context-menu.actions.audit-item.btn',
            link: '/auditlogs/object',
          } as LinkMenuItemModel,
          icon: 'key',
          visible: true,
        }];
      }),
    );
  }
}
