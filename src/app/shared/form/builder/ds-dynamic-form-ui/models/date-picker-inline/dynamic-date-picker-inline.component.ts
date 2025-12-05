import { NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import {
  NgbDatepicker,
  NgbDatepickerConfig,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormControlComponent } from '@ng-dynamic-forms/core/component/dynamic-form-control.component';
import { DynamicDatePickerModel } from '@ng-dynamic-forms/core/model/datepicker/dynamic-datepicker.model';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model';
import { DynamicFormLayoutService } from '@ng-dynamic-forms/core/service/dynamic-form-layout.service';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core/service/dynamic-form-validation.service';

import { BtnDisabledDirective } from '../../../../../btn-disabled.directive';

@Component({
  selector: 'ds-dynamic-date-picker-inline',
  templateUrl: './dynamic-date-picker-inline.component.html',
  imports: [
    BtnDisabledDirective,
    NgbDatepickerModule,
    NgClass,
    ReactiveFormsModule,
  ],
})
export class DsDatePickerInlineComponent extends DynamicFormControlComponent {

  @Input() bindId = true;
  @Input() group: UntypedFormGroup;
  @Input() layout: DynamicFormControlLayout;
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
