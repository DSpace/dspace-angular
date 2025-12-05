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
import { DynamicListDirective } from '@ng-dynamic-forms/core/directive/dynamic-list.directive';
import { DynamicInputModel } from '@ng-dynamic-forms/core/model/input/dynamic-input.model';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model';
import {
  DynamicFormLayout,
  DynamicFormLayoutService,
} from '@ng-dynamic-forms/core/service/dynamic-form-layout.service';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core/service/dynamic-form-validation.service';
import { NgxMaskModule } from 'ngx-mask';


@Component({
  selector: 'dynamic-ng-bootstrap-input',
  templateUrl: './dynamic-ng-bootstrap-input.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    AsyncPipe,
    DynamicListDirective,
    NgClass,
    NgxMaskModule,
    ReactiveFormsModule,
  ],
})
export class DynamicNGBootstrapInputComponent extends DynamicFormControlComponent {
    @Input() formLayout?: DynamicFormLayout;
    @Input() group!: UntypedFormGroup;
    @Input() layout?: DynamicFormControlLayout;
    @Input() model!: DynamicInputModel;

    @Output() blur: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();

    constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
      super(layoutService, validationService);
    }
}
