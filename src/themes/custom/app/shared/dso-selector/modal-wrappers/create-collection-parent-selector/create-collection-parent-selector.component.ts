import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AuthorizedCommunitySelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/authorized-community-selector/authorized-community-selector.component';
import { CreateCollectionParentSelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component';

@Component({
  selector: 'ds-themed-create-collection-parent-selector',
  // styleUrls: ['./create-collection-parent-selector.component.scss'],
  // templateUrl: './create-collection-parent-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component.html',
  imports: [
    AuthorizedCommunitySelectorComponent,
    TranslateModule,
  ],
})
export class CreateCollectionParentSelectorComponent extends BaseComponent {
}
