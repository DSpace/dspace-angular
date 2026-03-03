import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { MetadataValuesComponent } from '../../../../../../../../app/item-page/field-components/metadata-values/metadata-values.component';
import { ItemPageAuthorFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/author/item-page-author-field.component';

@Component({
  selector: 'ds-themed-item-page-author-field',
  // templateUrl: './item-page-author-field.component.html',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/item-page-field.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MetadataValuesComponent,
  ],
})
export class ItemPageAuthorFieldComponent extends BaseComponent {
}
