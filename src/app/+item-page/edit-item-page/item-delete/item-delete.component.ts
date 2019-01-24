import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';
import { getItemEditPath } from '../../item-page-routing.module';
import { RestResponse } from '../../../core/cache/response.models';

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
    this.itemDataService.delete(this.item).pipe(first()).subscribe(
      (succeeded: boolean) => {
        this.notify(succeeded);
      }
    );
  }

  /**
   * When the item is successfully delete, navigate to the homepage, otherwise navigate back to the item edit page
   * @param response
   */
  notify(succeeded: boolean) {
    if (succeeded) {
      this.notificationsService.success(this.translateService.get('item.edit.' + this.messageKey + '.success'));
      this.router.navigate(['']);
    } else {
      this.notificationsService.error(this.translateService.get('item.edit.' + this.messageKey + '.error'));
      this.router.navigate([getItemEditPath(this.item.id)]);
    }
  }
}
