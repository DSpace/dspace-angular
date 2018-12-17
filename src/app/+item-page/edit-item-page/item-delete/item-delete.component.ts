import {Component} from '@angular/core';
import {first} from 'rxjs/operators';
import {RestResponse} from '../../../core/cache/response-cache.models';
import {AbstractSimpleItemActionComponent} from '../simple-item-action/abstract-simple-item-action.component';
import {RemoteData} from '../../../core/data/remote-data';
import {Item} from '../../../core/shared/item.model';
import {findSuccessfulAccordingTo} from '../edit-item-operators';
import {getItemEditPath} from '../../item-page-routing.module';
import {getCommunityModulePath} from '../../../app-routing.module';

@Component({
  selector: 'ds-item-delete',
  templateUrl: '../simple-item-action/abstract-simple-item-action.component.html'
})
/**
 * Component responsible for rendering the item delete page
 */
export class ItemDeleteComponent extends AbstractSimpleItemActionComponent {

  protected messageKey = 'delete';

  /**
   * Perform the delete action to the item
   */
  performAction() {
    this.itemDataService.delete(this.item.id).pipe(first()).subscribe(
      (response: RestResponse) => {
        this.processRestResponse(response);
      }
    );
  }

  /**
   * Process the RestResponse retrieved from the server.
   * When the item is successfully delete, navigate to the homepage, otherwise navigate back to the item edit page
   * @param response
   */
  processRestResponse(response: RestResponse) {
    if (response.isSuccessful) {
        this.notificationsService.success(this.translateService.get('item.edit.' + this.messageKey + '.success'));
        this.router.navigate(['']);
    } else {
      this.notificationsService.error(this.translateService.get('item.edit.' + this.messageKey + '.error'));
      this.router.navigate([getItemEditPath(this.item.id)]);
    }  }
}
