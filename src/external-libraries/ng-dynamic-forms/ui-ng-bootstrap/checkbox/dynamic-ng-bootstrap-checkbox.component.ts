import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { UntypedFormGroup, ReactiveFormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";
import { DynamicFormControlComponent } from "@ng-dynamic-forms/core/component/dynamic-form-control.component";
import {
  DynamicFormLayout,
  DynamicFormLayoutService,
} from "@ng-dynamic-forms/core/service/dynamic-form-layout.service";
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";
import { DynamicCheckboxModel } from "@ng-dynamic-forms/core/model/checkbox/dynamic-checkbox.model";
import { DynamicFormValidationService } from "@ng-dynamic-forms/core/service/dynamic-form-validation.service";


@Component({
    selector: "dynamic-ng-bootstrap-checkbox",
    templateUrl: "./dynamic-ng-bootstrap-checkbox.component.html",
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: true,
    imports: [ReactiveFormsModule, NgClass]
})
export class DynamicNGBootstrapCheckboxComponent extends DynamicFormControlComponent {
    @Input() formLayout?: DynamicFormLayout;
    @Input() group!: UntypedFormGroup;
    @Input() layout?: DynamicFormControlLayout;
    @Input() model!: DynamicCheckboxModel;

    @Output() blur: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();

    constructor(protected layoutService: DynamicFormLayoutService, protected validationService: DynamicFormValidationService) {
        super(layoutService, validationService);
    }
}
