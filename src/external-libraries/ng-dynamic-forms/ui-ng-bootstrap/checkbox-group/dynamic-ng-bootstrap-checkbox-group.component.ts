import { NgClass } from '@angular/common';
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
import { DynamicCheckboxModel } from '@ng-dynamic-forms/core/model/checkbox/dynamic-checkbox.model';
import { DynamicCheckboxGroupModel } from '@ng-dynamic-forms/core/model/checkbox/dynamic-checkbox-group.model';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model';
import {
  DynamicFormLayout,
  DynamicFormLayoutService,
} from '@ng-dynamic-forms/core/service/dynamic-form-layout.service';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core/service/dynamic-form-validation.service';



@Component({
  selector: 'dynamic-ng-bootstrap-checkbox-group',
  templateUrl: './dynamic-ng-bootstrap-checkbox-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    ReactiveFormsModule,
  ],
})
export class DynamicNGBootstrapCheckboxGroupComponent extends DynamicFormControlComponent {
    @Input() formLayout?: DynamicFormLayout;
    @Input() group!: UntypedFormGroup;
    @Input() layout?: DynamicFormControlLayout;
    @Input() model!: DynamicCheckboxGroupModel;

    @Output() blur: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();

    constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
      super(layoutService, validationService);
    }

    getCheckboxId(model: DynamicCheckboxModel) {
      return this.layoutService.getElementId(model);
    }

    onCheckboxChange($event: Event, model: DynamicCheckboxModel) {
      this.onChange($event);
      model.value = ($event.target as HTMLInputElement).checked;
    }
}
