import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  DynamicFormComponent,
  DynamicFormControlEvent,
  DynamicFormControlModel,
    DynamicFormLayout,
    DynamicFormLayoutService,
    DynamicFormService,
    DynamicTemplateDirective,
} from '@ng-dynamic-forms/core';
import { DsDynamicFormControlComponent } from './ds-dynamic-form-control.component';

@Component({
  selector: 'ds-dynamic-form',
  templateUrl: './ds-dynamic-form.component.html'
})
export class DsDynamicFormComponent extends DynamicFormComponent {

  /* tslint:disable:no-input-rename */
  @Input('group') formGroup: FormGroup;
  @Input('model') formModel: DynamicFormControlModel[];
  @Input('layout') formLayout: DynamicFormLayout;
  /* tslint:enable:no-input-rename */

  /* tslint:disable:no-output-rename */
  @Output('dfBlur') blur: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfChange') change: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  @Output('dfFocus') focus: EventEmitter<DynamicFormControlEvent> = new EventEmitter<DynamicFormControlEvent>();
  /* tslint:enable:no-output-rename */

  @ContentChildren(DynamicTemplateDirective) templates: QueryList<DynamicTemplateDirective>;

  @ViewChildren(DsDynamicFormControlComponent) components: QueryList<DsDynamicFormControlComponent>;

    constructor(protected formService: DynamicFormService, protected layoutService: DynamicFormLayoutService) {
        super(formService, layoutService);
    }
}
