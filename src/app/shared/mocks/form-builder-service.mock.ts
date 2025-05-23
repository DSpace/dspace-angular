import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { DsDynamicInputModel } from '../form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { FormBuilderService } from '../form/builder/form-builder.service';

export function getMockFormBuilderService(): FormBuilderService {

  return jasmine.createSpyObj('FormBuilderService', {
    modelFromConfiguration: [],
    createFormGroup: new UntypedFormGroup({}),
    getValueFromModel: {},
    getFormControlById: new UntypedFormControl(),
    hasMappedGroupValue: false,
    findById: {},
    fromJSON: {},
    getPath: ['test', 'path'],
    getId: 'path',
    clearAllModelsValue : {},
    insertFormArrayGroup: {},
    isQualdrop: false,
    isQualdropGroup: false,
    isModelInCustomGroup: true,
    isRelationGroup: true,
    isConcatGroup: false,
    hasArrayGroupValue: true,
    getTypeBindModel: new DsDynamicInputModel({
      name: 'dc.type',
      id: 'dc_type',
      readOnly: false,
      disabled: false,
      repeatable: false,
      value: {
        value: 'boundType',
        display: 'Bound Type',
        authority: 'bound-auth-key',
      },
      submissionId: '1234',
      metadataFields: ['dc.type'],
      hasSelectableMetadata: false,
      typeBindRelations: [
        { match: 'VISIBLE', operator: 'OR', when: [{ id: 'dc.type', value: 'boundType' }] },
      ],
    },
    ),
  });
}
