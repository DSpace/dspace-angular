import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AuthorizedCollectionSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { CreateItemParentSelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';

@Component({
  selector: 'ds-themed-create-item-parent-selector',
  // styleUrls: ['./create-item-parent-selector.component.scss'],
  // templateUrl: './create-item-parent-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component.html',
  standalone: true,
  imports: [
    AuthorizedCollectionSelectorComponent,
    TranslateModule,
  ],
})
export class CreateItemParentSelectorComponent extends BaseComponent {
}
