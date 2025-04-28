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

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AbstractExpandableMenuProvider } from './helper-providers/expandable-menu-provider';

/**
 * Menu provider to create the "COAR Notify" menu (and subsections) in the admin sidebar
 */
@Injectable()
export class CoarNotifyMenuProvider extends AbstractExpandableMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
  ) {
    super();
  }

  getSubSections(): Observable<PartialMenuSection[]> {
    return observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.CoarNotifyEnabled),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([isCoarNotifyEnabled, isSiteAdmin]: [boolean, boolean]) => {
        return [{
          visible: isSiteAdmin && isCoarNotifyEnabled,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.notify_dashboard',
            link: '/admin/notify-dashboard',
          } as LinkMenuItemModel,
        },
        /* LDN Services */
        {
          visible: isSiteAdmin && isCoarNotifyEnabled,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.services',
            link: '/admin/ldn/services',
          } as LinkMenuItemModel,
        }];
      }));
  }

  getTopSection(): Observable<PartialMenuSection> {
    return observableCombineLatest([
      this.authorizationService.isAuthorized(FeatureID.CoarNotifyEnabled),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([isCoarNotifyEnabled, isSiteAdmin]: [boolean, boolean]) => {
        return {
          visible: isSiteAdmin && isCoarNotifyEnabled,
          model: {
            type: MenuItemType.TEXT,
            text: 'menu.section.coar_notify',
          } as TextMenuItemModel,
          icon: 'inbox',
        };
      }));
  }
}
