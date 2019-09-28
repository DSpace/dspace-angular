import { Component, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormArrayComponent,
  DynamicFormArrayModel,
  DynamicFormControlCustomEvent, DynamicFormControlEvent, DynamicFormControlModel,
  DynamicFormLayout,
  DynamicFormLayoutService,
  DynamicFormValidationService,
  DynamicTemplateDirective
} from '@ng-dynamic-forms/core';

@Component({
    selector: 'ds-dynamic-form-array',
    templateUrl: './dynamic-form-array.component.html'
})
export class DsDynamicFormArrayComponent extends DynamicFormArrayComponent {

  @Input() bindId = true;
  @Input() formModel: DynamicFormControlModel[];
  @Input() group: FormGroup;
  @Input() layout: DynamicFormLayout;
  @Input() model: DynamicFormArrayModel;
  @Input() templates: QueryList<DynamicTemplateDirective> | undefined;

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('ngbEvent') customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();
  /* tslint:enable:no-output-rename */

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService) {

    super(layoutService, validationService);
  }

}
