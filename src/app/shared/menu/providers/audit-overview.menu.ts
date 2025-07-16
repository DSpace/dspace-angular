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
  combineLatest,
  map,
  Observable,
} from 'rxjs';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../config/app-config.interface';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
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
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    console.log('AuditOverviewMenuProvider');
    super();
  }

  public getSections(): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([isSiteAdmin]) => {
        return [
          {
            visible: isSiteAdmin && this.appConfig.enableAuditLogsOverview,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.audit',
              link: '/auditlogs',
            },
            icon: 'key',
          },
        ] as PartialMenuSection[];
      }),
    );
  }
}
