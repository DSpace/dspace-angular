import {
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MetadataFieldWrapperComponent } from '../../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ItemDetailPreviewFieldComponent as BaseComponent } from '../../../../../../../../app/shared/object-detail/my-dspace-result-detail-element/item-detail-preview/item-detail-preview-field/item-detail-preview-field.component';

@Component({
  selector: 'ds-themed-item-detail-preview-field',
  // templateUrl: './item-detail-preview-field.component.html',
  templateUrl: '../../../../../../../../app/shared/object-detail/my-dspace-result-detail-element/item-detail-preview/item-detail-preview-field/item-detail-preview-field.component.html',
  standalone: true,
  imports: [
    MetadataFieldWrapperComponent,
    NgFor,
    NgIf,
    TranslateModule,
  ],
})
export class ItemDetailPreviewFieldComponent extends BaseComponent {
}
