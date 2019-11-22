import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { RestResponse } from '../../../core/cache/response.models';

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
