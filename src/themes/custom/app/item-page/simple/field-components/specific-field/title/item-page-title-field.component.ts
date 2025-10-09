import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ItemPageTitleFieldComponent as BaseComponent } from '../../../../../../../../app/item-page/simple/field-components/specific-field/title/item-page-title-field.component';

@Component({
  selector: 'ds-themed-item-page-title-field',
  // templateUrl: './item-page-title-field.component.html',
  templateUrl: '../../../../../../../../app/item-page/simple/field-components/specific-field/title/item-page-title-field.component.html',
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class ItemPageTitleFieldComponent extends BaseComponent {
}
