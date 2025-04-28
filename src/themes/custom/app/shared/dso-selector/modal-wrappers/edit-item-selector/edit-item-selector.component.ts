import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditItemSelectorComponent as BaseComponent } from 'src/app/shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';

import { ThemedDSOSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/themed-dso-selector.component';

@Component({
  selector: 'ds-themed-edit-item-selector',
  // styleUrls: ['./edit-item-selector.component.scss'],
  // templateUrl: './edit-item-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/dso-selector-modal-wrapper.component.html',
  standalone: true,
  imports: [ThemedDSOSelectorComponent, TranslateModule],
})
export class EditItemSelectorComponent extends BaseComponent {
}
