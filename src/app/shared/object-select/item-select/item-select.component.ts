import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { ObjectSelectService } from '../object-select.service';
import { ObjectSelectComponent } from '../object-select/object-select.component';
import { isNotEmpty } from '../../empty.util';

@Component({
  selector: 'ds-item-select',
  templateUrl: './item-select.component.html'
})

/**
 * A component used to select items from a specific list and returning the UUIDs of the selected items
 */
export class ItemSelectComponent extends ObjectSelectComponent<Item> {

  /**
   * Whether or not to hide the collection column
   */
  @Input()
  hideCollection = false;

  constructor(protected objectSelectService: ObjectSelectService) {
    super(objectSelectService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!isNotEmpty(this.confirmButton)) {
      this.confirmButton = 'item.select.confirm';
    }
  }

}
