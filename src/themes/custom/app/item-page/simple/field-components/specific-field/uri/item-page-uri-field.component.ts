import { Component } from '@angular/core';

import { MetadataUriValuesComponent } from '../../../../../../../../app/item-page/field-components/metadata-uri-values/metadata-uri-values.component';
import { ItemPageUriFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component';

@Component({
  selector: 'ds-themed-item-page-uri-field',
  // templateUrl: './item-page-uri-field.component.html',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/uri/item-page-uri-field.component.html',
  standalone: true,
  imports: [
    MetadataUriValuesComponent,
  ],
})
export class ItemPageUriFieldComponent extends BaseComponent {
}
