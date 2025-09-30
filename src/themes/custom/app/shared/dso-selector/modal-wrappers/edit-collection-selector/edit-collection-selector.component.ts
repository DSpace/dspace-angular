import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DSOSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component';
import { EditCollectionSelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component';

@Component({
  selector: 'ds-themed-edit-collection-selector',
  // styleUrls: ['./edit-collection-selector.component.scss'],
  // templateUrl: './edit-collection-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/dso-selector-modal-wrapper.component.html',
  standalone: true,
  imports: [
    DSOSelectorComponent,
    TranslateModule,
  ],
})
export class EditCollectionSelectorComponent extends BaseComponent {
}
