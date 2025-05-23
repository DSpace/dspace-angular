
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
import {
  DynamicFormComponent,
  DynamicFormComponentService,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';

import { DsDynamicFormControlContainerComponent } from './ds-dynamic-form-control-container.component';

@Component({
  selector: 'ds-dynamic-form',
  templateUrl: './ds-dynamic-form.component.html',
  imports: [
    forwardRef(() => DsDynamicFormControlContainerComponent),
  ],
  standalone: true,
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
