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
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { DSpaceObjectDataService } from '../../../core/data/dspace-object-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { Collection } from '../../../core/shared/collection.model';
import { COLLECTION } from '../../../core/shared/collection.resource-type';
import { Community } from '../../../core/shared/community.model';
import { COMMUNITY } from '../../../core/shared/community.resource-type';
import { SubscriptionModalComponent } from '../../subscriptions/subscription-modal/subscription-modal.component';
import { MenuItemType } from '../menu-item-type.model';
import { OnClickMenuItemModel } from '../menu-item/models/onclick.model';
import { PartialMenuSection } from '../menu-provider';
import { DSpaceObjectPageMenuProvider } from './dso.menu';

@Injectable()
export class SubscribeMenuProvider extends DSpaceObjectPageMenuProvider<Community | Collection> {
  constructor(
    protected authorizationService: AuthorizationDataService,
    protected modalService: NgbModal,
    protected dsoDataService: DSpaceObjectDataService,
  ) {
    super(dsoDataService);
  }

  protected isApplicable(dso: Community | Collection): boolean {
    // @ts-ignore
    return dso.type === COMMUNITY.value || dso.type.value === COLLECTION;
  }

  public getSectionsForContext(dso: Community | Collection): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.authorizationService.isAuthorized(FeatureID.CanSubscribe, dso.self),
    ]).pipe(
      map(([canSubscribe]) => {
        return [
          {
            visible: canSubscribe,
            model: {
              type: MenuItemType.ONCLICK,
              text: 'subscriptions.tooltip',
              function: () => {
                const modalRef = this.modalService.open(SubscriptionModalComponent);
                modalRef.componentInstance.dso = dso;
              }
            } as OnClickMenuItemModel,
            icon: 'bell',
          },
        ] as PartialMenuSection[];
      }),
    );
  }
}
