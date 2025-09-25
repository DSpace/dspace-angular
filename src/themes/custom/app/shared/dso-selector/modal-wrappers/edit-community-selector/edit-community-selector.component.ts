import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DSOSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component';
import { EditCommunitySelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';

@Component({
  selector: 'ds-themed-edit-item-selector',
  // styleUrls: ['./edit-community-selector.component.scss'],
  // templateUrl: './edit-community-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/dso-selector-modal-wrapper.component.html',
  standalone: true,
  imports: [
    DSOSelectorComponent,
    TranslateModule,
  ],
})
export class EditCommunitySelectorComponent extends BaseComponent {
}
