import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';


import { DsDynamicFormControlContainerComponent } from '../../ds-dynamic-form-control-container.component';
import { DynamicFormControlComponent } from "@ng-dynamic-forms/core/component/dynamic-form-control.component";
import { DynamicFormControlModel } from "@ng-dynamic-forms/core/model/dynamic-form-control.model";
import {
  DynamicFormLayout,
  DynamicFormLayoutService,
} from "@ng-dynamic-forms/core/service/dynamic-form-layout.service";
import { DynamicFormControlLayout } from "@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model";
import { DynamicFormGroupModel } from "@ng-dynamic-forms/core/model/form-group/dynamic-form-group.model";
import { DynamicTemplateDirective } from "@ng-dynamic-forms/core/directive/dynamic-template.directive";
import {
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent,
} from "@ng-dynamic-forms/core/component/dynamic-form-control-event";
import { DynamicFormValidationService } from "@ng-dynamic-forms/core/service/dynamic-form-validation.service";

@Component({
  selector: 'ds-dynamic-form-group',
  templateUrl: './dynamic-form-group.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [
    forwardRef(() => DsDynamicFormControlContainerComponent),
    NgClass,
    ReactiveFormsModule,
  ],
})
export class DsDynamicFormGroupComponent extends DynamicFormControlComponent {

  @Input() formModel: DynamicFormControlModel[];
  @Input() formLayout: DynamicFormLayout;
  @Input() group: UntypedFormGroup;
  @Input() layout: DynamicFormControlLayout;
  @Input() model: DynamicFormGroupModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | DynamicTemplateDirective[] | undefined;

  /* eslint-disable @angular-eslint/no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();
  /* eslint-enable @angular-eslint/no-output-rename */

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }

}
