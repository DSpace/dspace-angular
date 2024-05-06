import { NgIf } from '@angular/common';
import {
  Component,
  ViewChild,
} from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { AccessControlFormContainerComponent } from '../../../shared/access-control-form-container/access-control-form-container.component';

@Component({
  selector: 'ds-bulk-access-settings',
  templateUrl: 'bulk-access-settings.component.html',
  styleUrls: ['./bulk-access-settings.component.scss'],
  exportAs: 'dsBulkSettings',
  imports: [
    NgbAccordionModule,
    TranslateModule,
    NgIf,
    AccessControlFormContainerComponent,
  ],
  standalone: true,
})
export class BulkAccessSettingsComponent {

  /**
   * The SectionsDirective reference
   */
  @ViewChild('dsAccessControlForm') controlForm: AccessControlFormContainerComponent<any>;

  /**
   * Will be used from a parent component to read the value of the form
   */
  getValue() {
    return this.controlForm.getFormValue();
  }

  /**
   * Reset the form to its initial state
   * This will also reset the state of the child components (bitstream and item access)
   */
  reset() {
    this.controlForm.reset();
  }

}
