import { Component, Input } from '@angular/core';
import { ItemPageFieldComponent } from '../item-page-field.component';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-item-page-metrics-field',
  templateUrl: './item-page-metrics-field.component.html',
  styleUrls: [
    '../../../../../shared/metadata-field-wrapper/metadata-field-wrapper.component.scss',
  ],
})
export class ItemPageMetricsFieldComponent extends ItemPageFieldComponent {

  @Input() item: Item;

}
