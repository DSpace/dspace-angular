import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

import { MetadataValuesComponent } from '../../../../../../../../app/item-page/field-components/metadata-values/metadata-values.component';
import { GenericItemPageFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/generic/generic-item-page-field.component';

@Component({
  selector: 'ds-themed-generic-item-page-field',
  // templateUrl: './generic-item-page-field.component.html',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/item-page-field.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MetadataValuesComponent,
  ],
})
export class GenericItemPageFieldComponent extends BaseComponent {
}
