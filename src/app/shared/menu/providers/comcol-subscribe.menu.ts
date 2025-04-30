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
  Subject,
} from 'rxjs';
import {
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/auth.service';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { SubscriptionModalComponent } from '../../subscriptions/subscription-modal/subscription-modal.component';
import { SubscriptionsDataService } from '../../subscriptions/subscriptions-data.service';
import { OnClickMenuItemModel } from '../menu-item/models/onclick.model';
import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Subscribe" option in the DSO edit menu
 */
@Injectable()
export class SubscribeMenuProvider extends DSpaceObjectPageMenuProvider {

  private refresh$ = new Subject<void>();

  constructor(
    protected authService: AuthService,
    protected authorizationService: AuthorizationDataService,
    protected subscriptionService: SubscriptionsDataService,
    protected modalService: NgbModal,
    protected translateService: TranslateService,
  ) {
    super();
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    return this.refresh$.pipe(
      startWith(undefined),
      switchMap(() =>
        combineLatest([
          this.authorizationService.isAuthorized(FeatureID.CanSubscribe, dso.self),
          this.authService.getAuthenticatedUserFromStore(),
        ]),
      ),
      switchMap(([canSubscribe, user]) =>
        this.subscriptionService.getSubscriptionsByPersonDSO(user.id, dso.uuid).pipe(
          map((subscriptionRD) => {
            const subscription = subscriptionRD.payload?.page[0];
            const isSubscribed = subscription != null;
            const key = isSubscribed
              ? 'subscriptions.unsubscribe'
              : 'subscriptions.tooltip';
            return [
              {
                visible: canSubscribe,
                model: {
                  type: MenuItemType.ONCLICK,
                  text: key,
                  function: () => {
                    if (isSubscribed) {
                      this.subscriptionService.deleteSubscription(subscription.id).subscribe(() => {
                        this.refresh$.next();
                      });
                    } else {
                      const modalRef = this.modalService.open(SubscriptionModalComponent);
                      modalRef.componentInstance.dso = dso;
                      modalRef.componentInstance.updated.subscribe(() => {
                        this.refresh$.next();
                      });
                      modalRef.closed.subscribe(() => {
                      });
                    }
                  },
                } as OnClickMenuItemModel,
                icon: 'bell',
              },
            ] as PartialMenuSection[];
          }),
        ),
      ),
    );
  }
}
