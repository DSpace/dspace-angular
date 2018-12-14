import {Component} from '@angular/core';
import {first} from 'rxjs/operators';
import {RestResponse} from '../../../core/cache/response-cache.models';
import {AbstractSimpleItemActionComponent} from '../simple-item-action/abstract-simple-item-action.component';
import {RemoteData} from '../../../core/data/remote-data';
import {Item} from '../../../core/shared/item.model';

@Component({
  selector: 'ds-item-private',
  templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
})
/**
 * Component responsible for rendering the Item Reinstate page
 */
export class ItemPrivateComponent extends AbstractSimpleItemActionComponent {

  protected messageKey = 'private';
  protected predicate = (rd: RemoteData<Item>) => !rd.payload.isDiscoverable;

  /**
   * Perform the make private action to the item
   */
  performAction() {
    this.itemDataService.setDiscoverable(this.item.id, false).pipe(first()).subscribe(
      (response: RestResponse) => {
        this.processRestResponse(response);
      }
    );
  }
}
