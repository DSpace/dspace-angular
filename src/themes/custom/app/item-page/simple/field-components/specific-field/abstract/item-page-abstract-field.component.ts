import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { MetadataValuesComponent } from '../../../../../../../../app/item-page/field-components/metadata-values/metadata-values.component';
import { ItemPageAbstractFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/abstract/item-page-abstract-field.component';

@Component({
  selector: 'ds-themed-item-page-abstract-field',
  // templateUrl: './item-page-abstract-field.component.html',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/item-page-field.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MetadataValuesComponent,
  ],
})
export class ItemPageAbstractFieldComponent extends BaseComponent {
}
