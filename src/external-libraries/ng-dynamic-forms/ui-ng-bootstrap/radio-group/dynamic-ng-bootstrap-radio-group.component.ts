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
import { DynamicRadioGroupModel } from '@ng-dynamic-forms/core/model/radio/dynamic-radio-group.model';
import {
  DynamicFormLayout,
  DynamicFormLayoutService,
} from '@ng-dynamic-forms/core/service/dynamic-form-layout.service';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core/service/dynamic-form-validation.service';



@Component({
  selector: 'dynamic-ng-bootstrap-radio-group',
  templateUrl: './dynamic-ng-bootstrap-radio-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    NgClass,
    ReactiveFormsModule,
  ],
})
export class DynamicNGBootstrapRadioGroupComponent extends DynamicFormControlComponent {
    @Input() formLayout?: DynamicFormLayout;
    @Input() group!: UntypedFormGroup;
    @Input() layout?: DynamicFormControlLayout;
    @Input() model!: DynamicRadioGroupModel<string>;

    @Output() blur: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();

    constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
      super(layoutService, validationService);
    }
}
