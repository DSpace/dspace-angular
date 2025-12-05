import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
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
  NgbTimepicker,
  NgbTimepickerConfig,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormControlComponent } from '@ng-dynamic-forms/core/component/dynamic-form-control.component';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model';
import { DynamicTimePickerModel } from '@ng-dynamic-forms/core/model/timepicker/dynamic-timepicker.model';
import {
  DynamicFormLayout,
  DynamicFormLayoutService,
} from '@ng-dynamic-forms/core/service/dynamic-form-layout.service';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core/service/dynamic-form-validation.service';


@Component({
  selector: 'dynamic-ng-bootstrap-timepicker',
  templateUrl: './dynamic-ng-bootstrap-timepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbTimepickerModule,
    NgClass,
    ReactiveFormsModule,
  ],
})
export class DynamicNGBootstrapTimePickerComponent extends DynamicFormControlComponent {
    @Input() formLayout?: DynamicFormLayout;
    @Input() group!: UntypedFormGroup;
    @Input() layout?: DynamicFormControlLayout;
    @Input() model!: DynamicTimePickerModel;

    @Output() blur: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();

    @ViewChild(NgbTimepicker, { static: true }) ngbTimePicker!: NgbTimepicker;

    constructor(protected layoutService: DynamicFormLayoutService,
                protected validationService: DynamicFormValidationService,
                public config: NgbTimepickerConfig) {
      super(layoutService, validationService);
    }
}
