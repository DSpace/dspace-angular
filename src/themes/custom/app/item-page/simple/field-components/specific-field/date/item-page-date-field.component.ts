import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { MetadataValuesComponent } from '../../../../../../../../app/item-page/field-components/metadata-values/metadata-values.component';
import { ItemPageDateFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/date/item-page-date-field.component';

@Component({
  selector: 'ds-themed-item-page-date-field',
  // templateUrl: './item-page-date-field.component.html',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/item-page-field.component.html',
  imports: [
    AsyncPipe,
    MetadataValuesComponent,
  ],
})
export class ItemPageDateFieldComponent extends BaseComponent {
}
