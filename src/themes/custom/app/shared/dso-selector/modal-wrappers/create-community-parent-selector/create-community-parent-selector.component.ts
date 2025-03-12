import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DSOSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component';
import { CreateCommunityParentSelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component';

@Component({
  selector: 'ds-themed-create-community-parent-selector',
  // styleUrls: ['./create-community-parent-selector.component.scss'],
  styleUrls: ['../../../../../../../app/shared/dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component.scss'],
  // templateUrl: './create-community-parent-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    DSOSelectorComponent,
    TranslateModule,
  ],
})
export class CreateCommunityParentSelectorComponent extends BaseComponent {
}
