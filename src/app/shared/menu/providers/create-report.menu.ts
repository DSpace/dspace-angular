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

import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { RemoteData } from '../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { LinkMenuItemModel } from '../menu-item/models/link.model';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AbstractExpandableMenuProvider } from './helper-providers/expandable-menu-provider';

/**
 * Menu provider to create the "Reports" menu (and subsections) in the admin sidebar
 */
@Injectable()
export class CreateReportMenuProvider extends AbstractExpandableMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected configurationDataService: ConfigurationDataService,
  ) {
    super();
  }

  getSubSections(): Observable<PartialMenuSection[]> {
    return observableCombineLatest([
      this.configurationDataService.findByPropertyName('contentreport.enable').pipe(
        getFirstCompletedRemoteData(),
        map((res: RemoteData<ConfigurationProperty>) => res.hasSucceeded && res.payload && res.payload.values[0] === 'true'),
      ),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([reportEnabled, isSiteAdmin]: [boolean, boolean]) => {
        return [
          /* Collections Report */
          {
            visible: isSiteAdmin && reportEnabled,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.reports.collections',
              link: '/admin/reports/collections',
            } as LinkMenuItemModel,
            icon: 'user-check',
          },
          /* Queries Report */
          {
            visible: isSiteAdmin && reportEnabled,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.reports.queries',
              link: '/admin/reports/queries',
            } as LinkMenuItemModel,
            icon: 'user-check',
          },
        ];
      }));
  }

  getTopSection(): Observable<PartialMenuSection> {
    return observableCombineLatest([
      this.configurationDataService.findByPropertyName('contentreport.enable').pipe(
        getFirstCompletedRemoteData(),
        map((res: RemoteData<ConfigurationProperty>) => res.hasSucceeded && res.payload && res.payload.values[0] === 'true'),
      ),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
    ]).pipe(
      map(([reportEnabled, isSiteAdmin]: [boolean, boolean]) => {
        return {
          visible: isSiteAdmin && reportEnabled,
          model: {
            type: MenuItemType.TEXT,
            text: 'menu.section.reports',
          } as TextMenuItemModel,
          icon: 'file-alt',
        };
      }));
  }
}
