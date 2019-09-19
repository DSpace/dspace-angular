import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbDatepicker, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  DynamicDatePickerModel,
  DynamicFormControlComponent,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService
} from '@ng-dynamic-forms/core';

@Component({
  selector: 'ds-dynamic-date-picker-inline',
  styleUrls: ['./dynamic-date-picker-inline.component.scss'],
  templateUrl: './dynamic-date-picker-inline.component.html'
})
export class DsDatePickerInlineComponent extends DynamicFormControlComponent {

  @Input() bindId = true;
  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicDatePickerModel;

  @Output() blur: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() focus: EventEmitter<any> = new EventEmitter();

  @ViewChild(NgbDatepicker) ngbDatePicker: NgbDatepicker;

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              public config: NgbDatepickerConfig) {

    super(layoutService, validationService);
  }
}
