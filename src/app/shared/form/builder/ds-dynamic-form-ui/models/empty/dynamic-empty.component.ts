import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { FormGroup } from '@angular/forms';
import { DynamicEmptyModel } from './dynamic-empty.model';

/* TODO take a look at this when the REST entities submission is finished: we will probably need to get the fixed filter from the REST instead of filtering is out from the metadata field */
const RELATION_TYPE_METADATA_PREFIX = 'relation.isPublicationOf';

@Component({
  selector: 'ds-dynamic-empty',
  templateUrl: './dynamic-empty.component.html'
})
export class DsDynamicEmptyComponent extends DynamicFormControlComponent {

  @Input() formId: string;
  @Input() group: FormGroup;
  @Input() model: DynamicEmptyModel;

  @Output() blur: EventEmitter<any> = new EventEmitter<any>();
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output() focus: EventEmitter<any> = new EventEmitter<any>();


  constructor(protected layoutService: DynamicFormLayoutService,
              protected validationService: DynamicFormValidationService
  ) {
    super(layoutService, validationService);
  }


}
