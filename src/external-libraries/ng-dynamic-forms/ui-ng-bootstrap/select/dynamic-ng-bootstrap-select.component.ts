import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { DynamicFormControlComponent } from '@ng-dynamic-forms/core/component/dynamic-form-control.component';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model';
import { DynamicSelectModel } from '@ng-dynamic-forms/core/model/select/dynamic-select.model';
import {
  DynamicFormLayout,
  DynamicFormLayoutService,
} from '@ng-dynamic-forms/core/service/dynamic-form-layout.service';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core/service/dynamic-form-validation.service';

@Component({
  selector: 'dynamic-ng-bootstrap-select',
  templateUrl: './dynamic-ng-bootstrap-select.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
  ],
})
export class DynamicNGBootstrapSelectComponent extends DynamicFormControlComponent {
    @Input() formLayout?: DynamicFormLayout;
    @Input() group!: UntypedFormGroup;
    @Input() layout?: DynamicFormControlLayout;
    @Input() model!: DynamicSelectModel<string>;

    @Output() blur: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();

    constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
      super(layoutService, validationService);
    }
}
