import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AuthorizedCollectionSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { EditCollectionSelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component';

@Component({
  selector: 'ds-themed-edit-collection-selector',
  // styleUrls: ['./edit-collection-selector.component.scss'],
  // templateUrl: './edit-collection-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component.html',
  imports: [
    AuthorizedCollectionSelectorComponent,
    TranslateModule,
  ],
})
export class EditCollectionSelectorComponent extends BaseComponent {
}
