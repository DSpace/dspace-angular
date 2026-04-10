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
  of,
} from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ThemedEditCollectionSelectorComponent } from '../../dso-selector/modal-wrappers/edit-collection-selector/themed-edit-collection-selector.component';
import { ThemedEditCommunitySelectorComponent } from '../../dso-selector/modal-wrappers/edit-community-selector/themed-edit-community-selector.component';
import { ThemedEditItemSelectorComponent } from '../../dso-selector/modal-wrappers/edit-item-selector/themed-edit-item-selector.component';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { AbstractExpandableMenuProvider } from './helper-providers/expandable-menu-provider';

/**
 * Menu provider to create the "Edit" menu (and subsections) in the admin sidebar
 */
@Injectable()
export class EditMenuProvider extends AbstractExpandableMenuProvider {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
  ) {
    super();
  }

  public getTopSection(): Observable<PartialMenuSection> {
    return of(
      {
        accessibilityHandle: 'edit',
        model: {
          type: MenuItemType.TEXT,
          text: 'menu.section.edit',
        },
        icon: 'pencil',
        visible: true,
      },
    );
  }

  public getSubSections(): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
      this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
      this.authorizationService.isAuthorized(FeatureID.CanEditItem),
    ]).pipe(
      map(([isCollectionAdmin, isCommunityAdmin, canEditItem]: [boolean, boolean, boolean]) => {
        return [
          {
            visible: isCommunityAdmin,
            model: {
              type: MenuItemType.ONCLICK,
              text: 'menu.section.edit_community',
              function: () => {
                this.modalService.open(ThemedEditCommunitySelectorComponent);
              },
            },
          },
          {
            visible: isCollectionAdmin,
            model: {
              type: MenuItemType.ONCLICK,
              text: 'menu.section.edit_collection',
              function: () => {
                this.modalService.open(ThemedEditCollectionSelectorComponent);
              },
            },
          },
          {
            visible: canEditItem,
            model: {
              type: MenuItemType.ONCLICK,
              text: 'menu.section.edit_item',
              function: () => {
                this.modalService.open(ThemedEditItemSelectorComponent);
              },
            },
          },
        ];
      }),
    );
  }
}
