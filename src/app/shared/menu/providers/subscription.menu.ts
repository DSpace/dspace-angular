/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  Observable,
  take,
} from 'rxjs';

import { SubscriptionModalComponent } from '../../subscriptions/subscription-modal/subscription-modal.component';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Subscription" menu section for DSO.
 */
@Injectable()
export class SubscriptionMenuProvider extends DSpaceObjectPageMenuProvider {

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  constructor(
    protected authorizationService: AuthorizationDataService,
    protected route: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    super();
  }


  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return this.authorizationService.isAuthorized(FeatureID.CanSubscribe, dso.self).pipe(
      take(1),
      map((canSubscribe) => {
        if (canSubscribe) {
          return [
            {
              id: 'subscription',
              active: false,
              visible: true,
              icon: 'rss',
              model: {
                type: MenuItemType.ONCLICK,
                text: 'menu.section.subscription',
                function: () => {
                  this.modalRef = this.modalService.open(SubscriptionModalComponent);
                  if (this.modalRef.componentInstance) {
                    this.modalRef.componentInstance.dso = dso;
                  }
                },
              },
            },
          ];
        }
        return [];
      },
      ));
  }

  protected isApplicable(dso: DSpaceObject): boolean {
    return dso instanceof Item;
  }

}
