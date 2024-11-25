/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, map, Observable, of as observableOf, } from 'rxjs';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import {
  ThemedCreateCollectionParentSelectorComponent
} from '../../dso-selector/modal-wrappers/create-collection-parent-selector/themed-create-collection-parent-selector.component';
import {
  ThemedCreateCommunityParentSelectorComponent
} from '../../dso-selector/modal-wrappers/create-community-parent-selector/themed-create-community-parent-selector.component';
import {
  ThemedCreateItemParentSelectorComponent
} from '../../dso-selector/modal-wrappers/create-item-parent-selector/themed-create-item-parent-selector.component';
import { MenuItemType } from '../menu-item-type.model';
import { TextMenuItemModel } from '../menu-item/models/text.model';
import { AbstractExpandableMenuProvider, } from './helper-providers/expandable-menu-provider';
import { PartialMenuSection } from '../menu-provider.model';

/**
 * Menu provider to create the admin sidebar new menu sections
 */
@Injectable()
export class NewMenuProvider extends AbstractExpandableMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
  ) {
    super();
  }

  public getTopSection(): Observable<PartialMenuSection> {
    return observableOf(
      {
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.new'
        } as TextMenuItemModel,
        icon: 'plus',
        visible: true,
      },
    );
  }

  public getSubSections(): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
      this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
      this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
      this.authorizationService.isAuthorized(FeatureID.CanSubmit),
    ]).pipe(map(([isCollectionAdmin, isCommunityAdmin, isSiteAdmin, canSubmit]) => {

      return [
        {
          visible: isCommunityAdmin,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.new_community',
            function: () => {
              this.modalService.open(ThemedCreateCommunityParentSelectorComponent);
            }
          },
        },
        {
          visible: isCollectionAdmin,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.new_collection',
            function: () => {
              this.modalService.open(ThemedCreateCollectionParentSelectorComponent);
            }
          },
        },
        {
          visible: canSubmit,
          model: {
            type: MenuItemType.ONCLICK,
            text: 'menu.section.new_item',
            function: () => {
              this.modalService.open(ThemedCreateItemParentSelectorComponent);
            }
          },
        },
        {
          visible: isSiteAdmin,
          model: {
            type: MenuItemType.LINK,
            text: 'menu.section.new_process',
            link: '/processes/new'
          },
        },
      ];
    }));
  }
}
