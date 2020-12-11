import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { RestResponse } from '../../../core/cache/response.models';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ItemDataService } from '../../../core/data/item-data.service';

@Component({
  selector: 'ds-item-withdraw',
  templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
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
    this.itemDataService.setWithDrawn(this.item.id, true).pipe(first()).subscribe(
      (response: RestResponse) => {
        this.processRestResponse(response);
      }
    );
  }
}
