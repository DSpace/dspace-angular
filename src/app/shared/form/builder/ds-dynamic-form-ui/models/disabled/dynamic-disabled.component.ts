import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicDisabledModel } from './dynamic-disabled.model';

@Component({
  selector: 'ds-dynamic-disabled',
  templateUrl: './dynamic-disabled.component.html'
})
export class DsDynamicDisabledComponent extends DynamicFormControlComponent {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicDisabledModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();


  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }
}
