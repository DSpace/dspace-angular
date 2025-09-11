import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ItemDataService,
  RemoteData,
  NotificationsService,
  Item,
  getFirstCompletedRemoteData,
} from '@dspace/core'
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  ModifyItemOverviewComponent,
} from '../modify-item-overview/modify-item-overview.component';
import {
  AbstractSimpleItemActionComponent,
} from '../simple-item-action/abstract-simple-item-action.component';

@Component({
  selector: 'ds-item-withdraw',
  templateUrl: '../simple-item-action/abstract-simple-item-action.component.html',
  standalone: true,
  imports: [
    ModifyItemOverviewComponent,
    RouterLink,
    TranslateModule,
  ],
})
/**
 * Component responsible for rendering the Item Withdraw page
 */
export class ItemWithdrawComponent extends AbstractSimpleItemActionComponent {

  protected messageKey = 'withdraw';
  protected predicate = (rd: RemoteData<Item>) => rd.payload.isWithdrawn;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected itemDataService: ItemDataService,
              protected translateService: TranslateService) {
    super(route, router, notificationsService, itemDataService, translateService);
  }

  /**
   * Perform the withdraw action to the item
   */
  performAction() {
    this.itemDataService.setWithDrawn(this.item, true).pipe(getFirstCompletedRemoteData()).subscribe(
      (response: RemoteData<Item>) => {
        this.processRestResponse(response);
      },
    );
  }
}
