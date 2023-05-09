import { Component, Input, NgModule, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SharedBrowseByModule } from '../browse-by/shared-browse-by.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlMaxStartDatePipe } from './control-max-start-date.pipe';
import { ControlMaxEndDatePipe } from './control-max-end-date.pipe';
import { AccessControlItem } from '../../core/shared/bulk-access-condition-options.model';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


// will be used on the form value
export interface AccessControlItemValue {
  itemName: string | null; // item name
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'ds-access-control-array-form',
  templateUrl: './access-control-array-form.component.html',
  styleUrls: [ './access-control-array-form.component.scss' ],
  exportAs: 'accessControlArrayForm'
})
export class AccessControlArrayFormComponent implements OnInit, OnDestroy {
  @Input() dropdownOptions: AccessControlItem[] = [];
  @Input() accessControlItems: AccessControlItemValue[] = [];

  private destroy$ = new Subject<void>();

  form = this.fb.group({
    accessControl: this.fb.array([])
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.accessControlItems.length === 0) {
      this.addAccessControlItem();
    } else {
      for (const item of this.accessControlItems) {
        this.addAccessControlItem(item.itemName);
      }
    }

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

  get accessControl() {
    return this.form.get('accessControl') as FormArray;
  }

  addAccessControlItem(itemName: string = null) {
    this.accessControl.push(this.fb.group({
      itemName,
      startDate: new FormControl({ value: null, disabled: true }),
      endDate: new FormControl({ value: null, disabled: true })
    }));
  }

  removeAccessControlItem(index: number) {
    this.accessControl.removeAt(index);
  }

  getValue() {
    return this.form.value;
  }

  reset() {
    this.accessControl.reset([]);
  }

  disable() {
    this.form.disable();

    // disable all date controls
    for (const control of this.accessControl.controls) {
      control.get('startDate').disable();
      control.get('endDate').disable();
    }
  }

  enable() {
    this.form.enable();

    // enable date controls
    for (const control of this.accessControl.controls) {
      control.get('startDate').enable();
      control.get('endDate').enable();
    }
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
