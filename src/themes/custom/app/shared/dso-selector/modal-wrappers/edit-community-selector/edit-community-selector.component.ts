import { Component } from '@angular/core';

 import { EditCommunitySelectorComponent as BaseComponent
} from '../../../../../../../app/shared/dso-selector/modal-wrappers/edit-community-selector/edit-community-selector.component';
import { NgIf } from '@angular/common';
import { DSOSelectorComponent } from '../../../../../../../app/shared/dso-selector/dso-selector/dso-selector.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-edit-item-selector',
  // styleUrls: ['./edit-community-selector.component.scss'],
  // templateUrl: './edit-community-selector.component.html',
  templateUrl: '../../../../../../../app/shared/dso-selector/modal-wrappers/dso-selector-modal-wrapper.component.html',
  standalone: true,
  imports: [NgIf, DSOSelectorComponent, TranslateModule]
})
export class EditCommunitySelectorComponent extends BaseComponent {
}
