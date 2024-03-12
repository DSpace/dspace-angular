import { Component } from '@angular/core';

 import { CreateItemParentSelectorComponent as BaseComponent
} from '../../../../../../../app/shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import { NgIf } from '@angular/common';
import {
  AuthorizedCollectionSelectorComponent
} from '../../../../../../../app/shared/dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-create-item-parent-selector',
  // styleUrls: ['./create-item-parent-selector.component.scss'],
  // templateUrl: './create-item-parent-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component.html',
  standalone: true,
  imports: [NgIf, AuthorizedCollectionSelectorComponent, TranslateModule]
})
export class CreateItemParentSelectorComponent extends BaseComponent {
}
