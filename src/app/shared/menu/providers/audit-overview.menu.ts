/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';

import { MenuItemType } from '../menu-item-type.model';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../menu-provider.model';

/**
 * Menu provider to create the "Health" menu in the admin sidebar
 */
@Injectable()
export class AuditOverviewMenuProvider extends AbstractMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected configurationDataService: ConfigurationDataService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super();
  }

  public getSections(): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.configurationDataService.findByPropertyName('audit.enabled').pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<ConfigurationProperty>) => {
          return response.hasSucceeded ? (response.payload.values.length > 0 && response.payload.values[0] === 'true') : false;
        }),
      ),
    ]).pipe(
      map(([isSiteAdmin, isAuditEnabled]) => {
        return [
          {
            visible: isSiteAdmin && isAuditEnabled,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.audit',
              link: '/auditlogs',
            },
            icon: 'clipboard-check',
          },
        ] as PartialMenuSection[];
      }),
    );
  }
}
