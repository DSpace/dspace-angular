import { Component } from '@angular/core';
import {
    EditCollectionSelectorComponent as BaseComponent
} from 'src/app/shared/dso-selector/modal-wrappers/edit-collection-selector/edit-collection-selector.component'

@Component({
  selector: 'ds-edit-collection-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class EditCollectionSelectorComponent extends BaseComponent {
}