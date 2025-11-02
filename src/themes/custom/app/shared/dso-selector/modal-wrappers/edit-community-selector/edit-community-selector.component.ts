import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AuthorizedCommunitySelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/authorized-community-selector/authorized-community-selector.component';
import { EditCommunitySelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';

@Component({
  selector: 'ds-themed-edit-item-selector',
  // styleUrls: ['./edit-community-selector.component.scss'],
  // templateUrl: './edit-community-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component.html',
  imports: [
    AuthorizedCommunitySelectorComponent,
    TranslateModule,
  ],
})
export class EditCommunitySelectorComponent extends BaseComponent {
}
