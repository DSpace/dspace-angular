import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AccessesConditionOption} from '../../../core/config/models/config-accesses-conditions-options.model';
import {dateToISOFormat} from '../../date.util';

@Component({
  selector: 'ds-access-control-array-form',
  templateUrl: './access-control-array-form.component.html',
  styleUrls: ['./access-control-array-form.component.scss'],
  exportAs: 'accessControlArrayForm'
})
export class AccessControlArrayFormComponent implements OnInit {
  @Input() dropdownOptions: AccessesConditionOption[] = [];
  @Input() mode!: 'add' | 'replace';
  @Input() type!: 'item' | 'bitstream';

  @ViewChild('ngForm', {static: true}) ngForm!: NgForm;

  form: { accessControls: AccessControlItem[] } = {
    accessControls: []
  };

  ngOnInit(): void {
    this.addAccessControlItem();

    // Disable the form by default
    setTimeout(() => this.disable(), 0);
  }

  get allControlsAreEmpty() {
    return this.form.accessControls
      .every(x => x.itemName === null || x.itemName === '');
  }

  /**
   * Add a new access control item to the form.
   * Start and end date are disabled by default.
   * @param itemName The name of the item to add
   */
  addAccessControlItem(itemName: string = null) {
    this.form.accessControls.push({
      itemName,
      startDate: null,
      hasStartDate: false,
      maxStartDate: null,
      endDate: null,
      hasEndDate: false,
      maxEndDate: null,
    });
  }

  /**
   * Remove an access control item from the form.
   * @param index
   */
  removeAccessControlItem(index: number) {
    this.form.accessControls.splice(index, 1);
  }

  /**
   * Get the value of the form.
   * This will be used to read the form value from the parent component.
   * @return The form value
   */
  getValue() {
    return this.form.accessControls
      .filter(x => x.itemName !== null && x.itemName !== '')
      .map(x => ({
        name: x.itemName,
        startDate: (x.startDate ? dateToISOFormat(x.startDate) : null),
        endDate: (x.endDate ? dateToISOFormat(x.endDate) : null)
      }));
  }

  /**
   * Set the value of the form from the parent component.
   */
  reset() {
    this.form.accessControls = [];
  }

  /**
   * Disable the form.
   * This will be used to disable the form from the parent component.
   */
  disable = () => this.ngForm.control.disable();

  /**
   * Enable the form.
   * This will be used to enable the form from the parent component.
   */
  enable = () => this.ngForm.control.enable();

  accessControlChanged(control: AccessControlItem, selectedItem: string) {
    const item = this.dropdownOptions
      .find((x) => x.name === selectedItem);

    control.startDate = null;
    control.endDate = null;

    control.hasStartDate = item?.hasStartDate || false;
    control.hasEndDate = item?.hasEndDate || false;

    control.maxStartDate = item?.maxStartDate || null;
    control.maxEndDate = item?.maxEndDate || null;
  }

}

export interface AccessControlItem {
  itemName: string | null;

  hasStartDate?: boolean;
  startDate: string | null;
  maxStartDate?: string | null;

  hasEndDate?: boolean;
  endDate: string | null;
  maxEndDate?: string | null;
}
