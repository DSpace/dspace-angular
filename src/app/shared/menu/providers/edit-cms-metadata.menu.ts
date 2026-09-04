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
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
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
 * Menu provider to create the "Edit CMS Metadata" menu in the admin sidebar
 */
@Injectable()
export class EditCMSMetadataMenuProvider extends AbstractMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super();
  }

  public getSections(): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([isSiteAdmin]) => {
        return [
          {
            visible: isSiteAdmin && (this.appConfig.homePage.editHomeHeader || this.appConfig.homePage.editHomeHeader || this.appConfig.homePage.showTopFooter),
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.edit-cms-metadata',
              link: '/admin/edit-cms-metadata',
            },
            icon: 'edit',
          },
        ] as PartialMenuSection[];
      }),
    );
  }
}
