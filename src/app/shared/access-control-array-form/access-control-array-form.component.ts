import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SharedBrowseByModule } from '../browse-by/shared-browse-by.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlMaxStartDatePipe } from './control-max-start-date.pipe';
import { ControlMaxEndDatePipe } from './control-max-end-date.pipe';
import { AccessControlItem } from '../../core/shared/bulk-access-condition-options.model';


// will be used on the form value
export interface AccessControlItemValue {
  itemName: string | null; // item name
  startDate?: string;
  endDate?: string;
}

@Component({
  selector: 'ds-access-control-array-form',
  templateUrl: './access-control-array-form.component.html',
  styleUrls: [ './access-control-array-form.component.scss' ]
})
export class AccessControlArrayFormComponent implements OnInit {
  @Input() dropdownOptions: AccessControlItem[] = [];
  @Input() accessControlItems: AccessControlItemValue[] = [];

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
  }

  get accessControl() {
    return this.form.get('accessControl') as FormArray;
  }

  addAccessControlItem(itemName: string = null) {
    this.accessControl.push(this.fb.group({
      itemName,
      startDate: null,
      endDate: null
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

}

@NgModule({
  imports: [ CommonModule, ReactiveFormsModule, SharedBrowseByModule, TranslateModule, NgbDatepickerModule ],
  declarations: [ AccessControlArrayFormComponent, ControlMaxStartDatePipe, ControlMaxEndDatePipe ],
  exports: [ AccessControlArrayFormComponent ],
})
export class AccessControlArrayFormModule {
}
