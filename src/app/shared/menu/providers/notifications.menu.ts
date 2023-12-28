/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  combineLatest,
  map,
  Observable,
  of as observableOf,
} from 'rxjs';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { MenuItemType } from '../menu-item-type.model';
import {
  AbstractExpandableMenuProvider,
  MenuSubSection,
  MenuTopSection,
} from './expandable-menu-provider';

@Injectable()
export class NotificationsMenuProvider extends AbstractExpandableMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected scriptDataService: ScriptDataService,
    protected modalService: NgbModal,
  ) {
    super();
  }

  public getTopSection(): Observable<MenuTopSection> {
    return observableOf(
      {
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.notifications',
        },
        icon: 'bell',
      },
    );
  }

  public getSubSections(): Observable<MenuSubSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.authorizationService.isAuthorized(FeatureID.CanSeeQA),
    ]).pipe(
      map(([authorized, canSeeQA]) => {
        return [
          {
            visible: authorized && canSeeQA,
            model: {
              type: MenuItemType.LINK,
              text: 'menu.section.quality-assurance',
              link: '/admin/notifications/quality-assurance',
            },
          },
        ] as MenuSubSection[];
      }),
    );
  }
}
