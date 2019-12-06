import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormComponent,
  DynamicFormControlContainerComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';
import { DsDynamicFormControlContainerComponent } from './ds-dynamic-form-control-container.component';
import { FormBuilderService } from '../form-builder.service';

@Component({
  selector: 'ds-dynamic-form',
  templateUrl: './ds-dynamic-form.component.html'
})
export class DsDynamicFormComponent extends DynamicFormComponent {

  @Input() formId: string;
  @Input() formGroup: FormGroup;
  @Input() formModel: DynamicFormControlModel[];
  @Input() formLayout = null as DynamicFormLayout;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* tslint:enable:no-output-rename */

  @ContentChildren(DynamicTemplateDirective) templates: QueryList<DynamicTemplateDirective>;

  @ViewChildren(DsDynamicFormControlContainerComponent) components: QueryList<DynamicFormControlContainerComponent>;

  constructor(protected formService: FormBuilderService, protected layoutService: DynamicFormLayoutService) {
    super(formService, layoutService);
  }
}
