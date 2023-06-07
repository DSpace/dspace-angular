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
    accessControls: [emptyAccessControlItem()] // Start with one empty access control item
  };

  formDisabled = true;

  ngOnInit(): void {
    this.disable(); // Disable the form by default
  }

  get allControlsAreEmpty() {
    return this.form.accessControls
      .every(x => x.itemName === null || x.itemName === '');
  }

  get showWarning() {
    return this.mode === 'replace' && this.allControlsAreEmpty && !this.formDisabled;
  }

  /**
   * Add a new access control item to the form.
   * Start and end date are disabled by default.
   * @param itemName The name of the item to add
   */
  addAccessControlItem(itemName: string = null) {
    this.form.accessControls = [
      ...this.form.accessControls,
      {...emptyAccessControlItem(), itemName}
    ];
  }

  /**
   * Remove an access control item from the form.
   * @param ngModelGroup
   * @param index
   */
  removeAccessControlItem(id: number) {
    this.form.accessControls = this.form.accessControls.filter(item => item.id !== id);
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

    // Add an empty access control item by default
    this.addAccessControlItem();

    this.disable();
  }

  /**
   * Disable the form.
   * This will be used to disable the form from the parent component.
   */
  disable = () => {
    this.ngForm.form.disable();
    this.formDisabled = true;
  };

  /**
   * Enable the form.
   * This will be used to enable the form from the parent component.
   */
  enable = () => {
    this.ngForm.form.enable();
    this.formDisabled = false;
  };

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

  trackById(index: number, item: AccessControlItem) {
    return item.id;
  }

}


export interface AccessControlItem {
  id: number; // will be used only locally

  itemName: string | null;

  hasStartDate?: boolean;
  startDate: string | null;
  maxStartDate?: string | null;

  hasEndDate?: boolean;
  endDate: string | null;
  maxEndDate?: string | null;
}

const emptyAccessControlItem = (): AccessControlItem => ({
  id: randomID(),
  itemName: null,
  startDate: null,
  hasStartDate: false,
  maxStartDate: null,
  endDate: null,
  hasEndDate: false,
  maxEndDate: null,
});

const randomID = () => Math.floor(Math.random() * 1000000);
