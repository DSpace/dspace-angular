import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DSOSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component';
import { CreateCollectionParentSelectorComponent as BaseComponent } from '../../../../../../../app/shared/dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component';

@Component({
  selector: 'ds-themed-create-collection-parent-selector',
  // styleUrls: ['./create-collection-parent-selector.component.scss'],
  // templateUrl: './create-collection-parent-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/dso-selector-modal-wrapper.component.html',
  standalone: true,
  imports: [NgIf, DSOSelectorComponent, TranslateModule],
})
export class CreateCollectionParentSelectorComponent extends BaseComponent {
}
