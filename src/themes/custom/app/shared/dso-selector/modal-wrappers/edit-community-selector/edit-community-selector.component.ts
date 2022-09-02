import { Component } from '@angular/core';
import {
    EditCommunitySelectorComponent as BaseComponent
} from 'src/app/shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';

@Component({
  selector: 'ds-edit-item-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class EditCommunitySelectorComponent extends BaseComponent {
}