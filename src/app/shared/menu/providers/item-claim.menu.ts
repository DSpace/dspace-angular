/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { DSpaceObjectDataService } from '../../../core/data/dspace-object-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ResearcherProfileDataService } from '../../../core/profile/researcher-profile-data.service';
import { Item } from '../../../core/shared/item.model';
import { isNotEmpty } from '../../empty.util';
import { NotificationsService } from '../../notifications/notifications.service';
import { MenuID } from '../menu-id.model';
import { MenuItemType } from '../menu-item-type.model';
import { OnClickMenuItemModel } from '../menu-item/models/onclick.model';
import { PartialMenuSection } from '../menu-provider';
import { MenuService } from '../menu.service';
import { DSpaceObjectPageMenuProvider } from './dso.menu';

@Injectable()
// todo: the "Item-ness" of this class is basically unenforced though...
export class ClaimMenuProvider extends DSpaceObjectPageMenuProvider<Item> {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected menuService: MenuService,
    protected dsoDataService: DSpaceObjectDataService,
    protected translate: TranslateService,
    protected notificationsService: NotificationsService,
    protected researcherProfileService: ResearcherProfileDataService,
    protected modalService: NgbModal,
  ) {
    super(dsoDataService);
  }


  protected isApplicable(item: Item): boolean {
    return this.getDsoType(item) === 'person';
  }

  public getSectionsForContext(item: Item): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.CanClaimItem, item.self),
    ]).pipe(
      map(([canClaimItem]) => {
        return [
          {
            visible: canClaimItem,
            model: {
              type: MenuItemType.ONCLICK,
              text: 'item.page.claim.button',
              function: () => {
                this.claimResearcher(item);
              },
            } as OnClickMenuItemModel,
            icon: 'hand-paper',
          },
        ] as PartialMenuSection[];
      }),
    );
  }

  /**
   * Claim a researcher by creating a profile
   * Shows notifications and/or hides the menu section on success/error
   */
  protected claimResearcher(item: Item) {
    this.researcherProfileService.createFromExternalSourceAndReturnRelatedItemId(item.self).subscribe((id: string) => {
      if (isNotEmpty(id)) {
        this.notificationsService.success(
          this.translate.get('researcherprofile.success.claim.title'),
          this.translate.get('researcherprofile.success.claim.body'),
        );
        this.authorizationService.invalidateAuthorizationsRequestCache();
        this.menuService.hideMenuSection(MenuID.DSO_EDIT, 'claim-dso-' + item.uuid);
      } else {
        this.notificationsService.error(
          this.translate.get('researcherprofile.error.claim.title'),
          this.translate.get('researcherprofile.error.claim.body'),
        );
      }
    });
  }
}
