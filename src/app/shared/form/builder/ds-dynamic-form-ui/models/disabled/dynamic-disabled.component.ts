import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicDisabledModel } from './dynamic-disabled.model';
import { RelationshipTypeService } from '../../../../../../core/data/relationship-type.service';

@Component({
  selector: 'ds-dynamic-disabled',
  templateUrl: './dynamic-disabled.component.html'
})
/**
 * Component for displaying a form input with a disabled property
 */
export class DsDynamicDisabledComponent extends DynamicFormControlComponent {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicDisabledModel;
  modelValuesString = '';

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();

  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService,
              protected relationshipTypeService: RelationshipTypeService
  ) {
    super(layoutService, validationService);
  }
}
