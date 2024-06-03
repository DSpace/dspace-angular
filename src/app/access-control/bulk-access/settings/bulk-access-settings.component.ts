import { Component, ViewChild } from '@angular/core';
import {
  AccessControlFormContainerComponent
} from '../../../shared/access-control-form-container/access-control-form-container.component';

@Component({
  selector: 'ds-bulk-access-settings',
  templateUrl: 'bulk-access-settings.component.html',
  styleUrls: ['./bulk-access-settings.component.scss'],
  exportAs: 'dsBulkSettings'
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
}
