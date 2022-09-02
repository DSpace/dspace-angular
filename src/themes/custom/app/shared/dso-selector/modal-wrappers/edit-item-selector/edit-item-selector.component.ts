import { Component } from '@angular/core';
import {
    EditItemSelectorComponent as BaseComponent
} from 'src/app/shared/dso-selector/modal-wrappers/edit-item-selector/edit-item-selector.component';

@Component({
  selector: 'ds-edit-item-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class EditItemSelectorComponent extends BaseComponent {
}
