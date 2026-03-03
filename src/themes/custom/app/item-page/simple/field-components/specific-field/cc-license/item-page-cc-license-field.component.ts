import {
  AsyncPipe,
  NgClass,
  NgStyle,
} from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ItemPageCcLicenseFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { MetadataFieldWrapperComponent } from '../../../../../../../../app/shared/metadata-field-wrapper/metadata-field-wrapper.component';

@Component({
  selector: 'ds-themed-item-page-cc-license-field',
  // templateUrl: './item-page-cc-license-field.component.html',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component.html',
  imports: [
    AsyncPipe,
    MetadataFieldWrapperComponent,
    NgClass,
    NgStyle,
    TranslateModule,
  ],
})
export class ItemPageCcLicenseFieldComponent extends BaseComponent {
}
