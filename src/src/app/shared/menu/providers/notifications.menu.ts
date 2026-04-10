/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { PUBLICATION_CLAIMS_PATH } from '../../../admin/admin-notifications/admin-notifications-routing-paths';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AbstractExpandableMenuProvider } from './helper-providers/expandable-menu-provider';

/**
 * Menu provider to create the "Notifications" menu (and subsections) in the admin sidebar
 */
@Injectable()
export class NotificationsMenuProvider extends AbstractExpandableMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
  ) {
    super();
  }

  getSubSections(): Observable<PartialMenuSection[]> {
    return observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.CanSeeQA),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([canSeeQa, isSiteAdmin]: [boolean, boolean]) => {
        return [
          {
            visible: canSeeQa,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.quality-assurance',
              link: '/notifications/quality-assurance',
            } as LinkMenuItemModel,
          },
          {
            visible: isSiteAdmin,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.notifications_publication-claim',
              link: '/admin/notifications/' + PUBLICATION_CLAIMS_PATH,
            } as LinkMenuItemModel,
          },
        ];
      }));
  }

  getTopSection(): Observable<PartialMenuSection> {
    return observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.CanSeeQA),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([canSeeQa, isSiteAdmin]: [boolean, boolean]) => {
        return {
          visible: canSeeQa || isSiteAdmin,
          model: {
            type: MenuItemType.TEXT,
            text: 'menu.section.notifications',
          } as TextMenuItemModel,
          icon: 'bell',
        };
      }));
  }
}
