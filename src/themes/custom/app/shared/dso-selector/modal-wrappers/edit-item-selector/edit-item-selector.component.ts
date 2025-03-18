import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EditItemSelectorComponent as BaseComponent } from 'src/app/shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';

import { DSOSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component';

@Component({
  selector: 'ds-themed-edit-item-selector',
  // styleUrls: ['./edit-item-selector.component.scss'],
  // templateUrl: './edit-item-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/dso-selector-modal-wrapper.component.html',
  standalone: true,
  imports: [NgIf, DSOSelectorComponent, TranslateModule],
})
export class EditItemSelectorComponent extends BaseComponent {
}
