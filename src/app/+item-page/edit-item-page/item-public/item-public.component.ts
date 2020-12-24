import { Component } from '@angular/core';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';

@Component({
  selector: 'ds-item-public',
  templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
})
/**
 * Component responsible for rendering the make item public page
 */
export class ItemPublicComponent extends AbstractSimpleItemActionComponent {

  protected messageKey = 'public';
  protected predicate = (rd: RemoteData<Item>) => rd.payload.isDiscoverable;

  /**
   * Perform the make public action to the item
   */
  performAction() {
    this.itemDataService.setDiscoverable(this.item, true).pipe(getFirstCompletedRemoteData()).subscribe(
      (response: RemoteData<Item>) => {
        this.processRestResponse(response);
      }
    );
  }
}
