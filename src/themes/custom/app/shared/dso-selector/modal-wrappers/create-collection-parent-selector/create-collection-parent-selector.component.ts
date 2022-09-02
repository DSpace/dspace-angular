import { Component } from '@angular/core';
import {
    CreateCollectionParentSelectorComponent as BaseComponent
} from 'src/app/shared/dso-selector/modal-wrappers/create-collection-parent-selector/create-collection-parent-selector.component';

@Component({
  selector: 'ds-create-collection-parent-selector',
  templateUrl: '../dso-selector-modal-wrapper.component.html',
})
export class CreateCollectionParentSelectorComponent extends BaseComponent {
}
