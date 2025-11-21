/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { RemoteData } from '@dspace/core/data/remote-data';
import { getDSORoute } from '@dspace/core/router/utils/dso-route.utils';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';

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
    return combineLatest([
      this.authorizationDataService.isAuthorized(FeatureID.AdministratorOf),
      this.configurationDataService.findByPropertyName('audit.context-menu-entry.enabled').pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<ConfigurationProperty>) => {
          return response.hasSucceeded ? (response.payload.values.length > 0 && response.payload.values[0] === 'true') : false;
        }),
      ),
    ]).pipe(
      map(([isAdmin, isAuditEnabled]: [boolean, boolean]) => {
        return [{
          model: {
            type: MenuItemType.LINK,
            text: 'context-menu.actions.audit-item.btn',
            link: new URLCombiner(getDSORoute(dso), 'auditlogs').toString(),
          } as LinkMenuItemModel,
          icon: 'clipboard-check',
          visible: true,
        }] as PartialMenuSection[];
      }),
    );
  }
}
