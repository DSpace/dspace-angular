
import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DynamicFormComponent } from '@ng-dynamic-forms/core/component/dynamic-form.component';
import { DynamicFormControlContainerComponent } from '@ng-dynamic-forms/core/component/dynamic-form-control-container.component';
import { DynamicFormControlEvent } from '@ng-dynamic-forms/core/component/dynamic-form-control-event';
import { DynamicTemplateDirective } from '@ng-dynamic-forms/core/directive/dynamic-template.directive';
import { DynamicFormControlModel } from '@ng-dynamic-forms/core/model/dynamic-form-control.model';
import { DynamicFormComponentService } from '@ng-dynamic-forms/core/service/dynamic-form-component.service';
import { DynamicFormLayout } from '@ng-dynamic-forms/core/service/dynamic-form-layout.service';

import { DsDynamicFormControlContainerComponent } from './ds-dynamic-form-control-container.component';

@Component({
  selector: 'ds-dynamic-form',
  templateUrl: './ds-dynamic-form.component.html',
  imports: [
    forwardRef(() => DsDynamicFormControlContainerComponent),
  ],
})
export class DsDynamicFormComponent extends DynamicFormComponent {

  @Input() formId: string;
  @Input() formGroup: UntypedFormGroup;
  @Input() formModel: DynamicFormControlModel[];
  @Input() formLayout: DynamicFormLayout;

  /* eslint-disable @angular-eslint/no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* eslint-enable @angular-eslint/no-output-rename */

  @Output() ngbEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();

  @ContentChildren(DynamicTemplateDirective) templates: QueryList<DynamicTemplateDirective>;

  @ViewChildren(DsDynamicFormControlContainerComponent) components: QueryList<DynamicFormControlContainerComponent>;

  constructor(changeDetectorRef: ChangeDetectorRef, componentService: DynamicFormComponentService) {
    super(changeDetectorRef, componentService);
  }
}
