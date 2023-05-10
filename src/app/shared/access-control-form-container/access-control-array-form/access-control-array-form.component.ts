import { Component, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedBrowseByModule } from '../../browse-by/shared-browse-by.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlMaxStartDatePipe } from './control-max-start-date.pipe';
import { ControlMaxEndDatePipe } from './control-max-end-date.pipe';

import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AccessesConditionOption } from '../../../core/config/models/config-accesses-conditions-options.model';


@Component({
  selector: 'ds-access-control-array-form',
  templateUrl: './access-control-array-form.component.html',
  styleUrls: [ './access-control-array-form.component.scss' ],
  exportAs: 'accessControlArrayForm'
})
export class AccessControlArrayFormComponent implements OnInit, OnDestroy {
  @Input() dropdownOptions: AccessesConditionOption[] = [];

  private destroy$ = new Subject<void>();

  form = this.fb.group({
    accessControl: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addAccessControlItem();
    this.handleValidationOnFormArrayChanges();
  }

  /**
   * Get the access control form array.
   */
  get accessControl() {
    return this.form.get('accessControl') as FormArray;
  }

  /**
   * Add a new access control item to the form.
   * Start and end date are disabled by default.
   * @param itemName The name of the item to add
   */
  addAccessControlItem(itemName: string = null) {
    this.accessControl.push(this.fb.group({
      itemName,
      startDate: new FormControl({ value: null, disabled: true }),
      endDate: new FormControl({ value: null, disabled: true })
    }));
  }

  /**
   * Remove an access control item from the form.
   * @param index
   */
  removeAccessControlItem(index: number) {
    this.accessControl.removeAt(index);
  }

  /**
   * Get the value of the form.
   * This will be used to read the form value from the parent component.
   * @return The form value
   */
  getValue() {
    return this.form.value.accessControl
      .filter(x => x.itemName !== null && x.itemName !== '')
      .map(x => ({ name: x.itemName, startDate: x.startDate || null, endDate: x.endDate || null }));
  }

  /**
   * Set the value of the form from the parent component.
   */
  reset() {
    this.accessControl.reset([]);
  }

  /**
   * Disable the form.
   * This will be used to disable the form from the parent component.
   * This will also disable all date controls.
   */
  disable() {
    this.form.disable();

    // disable all date controls
    for (const control of this.accessControl.controls) {
      control.get('startDate').disable();
      control.get('endDate').disable();
    }
  }

  /**
   * Enable the form.
   * This will be used to enable the form from the parent component.
   * This will also enable all date controls.
   */
  enable() {
    this.form.enable();

    // enable date controls
    for (const control of this.accessControl.controls) {
      control.get('startDate').enable();
      control.get('endDate').enable();
    }
  }

  /**
   * Handle validation on form array changes.
   * This will be used to enable/disable date controls based on the selected item.
   * @private
   */
  private handleValidationOnFormArrayChanges() {
    this.accessControl.valueChanges
      .pipe(
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        for (const [ index, controlValue ] of value.entries()) {
          if (controlValue.itemName) {
            const item = this.dropdownOptions.find((x) => x.name === controlValue.itemName);
            const startDateCtrl = this.accessControl.controls[index].get('startDate');
            const endDateCtrl = this.accessControl.controls[index].get('endDate');

            if (item?.hasStartDate) {
              startDateCtrl.enable({ emitEvent: false });
            } else {
              startDateCtrl.patchValue(null);
              startDateCtrl.disable({ emitEvent: false });
            }
            if (item?.hasEndDate) {
              endDateCtrl.enable({ emitEvent: false });
            } else {
              endDateCtrl.patchValue(null);
              endDateCtrl.disable({ emitEvent: false });
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

@NgModule({
  imports: [ CommonModule, ReactiveFormsModule, SharedBrowseByModule, TranslateModule, NgbDatepickerModule ],
  declarations: [ AccessControlArrayFormComponent, ControlMaxStartDatePipe, ControlMaxEndDatePipe ],
  exports: [ AccessControlArrayFormComponent ],
})
export class AccessControlArrayFormModule {
}
