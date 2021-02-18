import { Component, Input } from '@angular/core';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../core/shared/item.model';

@Component({
  selector: 'ds-item-export-alert',
  templateUrl: './item-export-alert.component.html'
})
export class ItemExportAlertComponent {

  @Input() item: Item;

  constructor(private dsoNameService: DSONameService) {
  }

  getItemName() {
    return this.dsoNameService.getName(this.item);
  }

}
