import { Component } from '@angular/core';
import {
    CreateCommunityParentSelectorComponent as BaseComponent
} from 'src/app/shared/dso-selector/modal-wrappers/create-community-parent-selector/create-community-parent-selector.component';

@Component({
  selector: 'ds-create-community-parent-selector',
  styleUrls: ['./create-community-parent-selector.component.scss'],
  templateUrl: './create-community-parent-selector.component.html',
})
export class CreateCommunityParentSelectorComponent extends BaseComponent {
}
