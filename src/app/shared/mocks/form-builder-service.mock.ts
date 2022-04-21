import { FormBuilderService } from '../form/builder/form-builder.service';
import { FormControl, FormGroup } from '@angular/forms';
import {DynamicFormControlModel, DynamicInputModel} from "@ng-dynamic-forms/core";
import {DsDynamicInputModel} from "../form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model";

export function getMockFormBuilderService(): FormBuilderService {

  const inputWithTypeBindConfig = {
    name: 'testWithTypeBind',
    id: 'testWithTypeBind',
    readOnly: false,
    disabled: false,
    repeatable: false,
    value: {
      value: 'testWithTypeBind',
      display: 'testWithTypeBind'
    },
    submissionId: '1234',
    metadataFields: [],
    hasSelectableMetadata: false,
    typeBindRelations: [
      {match: 'VISIBLE', operator: 'OR', when: [{'id': 'dc.type', 'value': 'boundType'}]}
    ]
  };

  const thing = new DsDynamicInputModel(inputWithTypeBindConfig);

  return jasmine.createSpyObj('FormBuilderService', {
    modelFromConfiguration: [],
    createFormGroup: new FormGroup({}),
    getValueFromModel: {},
    getFormControlById: new FormControl(),
    hasMappedGroupValue: false,
    findById: {},
    getPath: ['test', 'path'],
    getId: 'path',
    clearAllModelsValue : {},
    insertFormArrayGroup: {},
    isQualdrop: false,
    isQualdropGroup: false,
    isModelInCustomGroup: true,
    isRelationGroup: true,
    hasArrayGroupValue: true,
    getTypeBindModel: new DsDynamicInputModel({
        name: 'testWithTypeBind',
        id: 'testWithTypeBind',
        readOnly: false,
        disabled: false,
        repeatable: false,
        value: {
          value: 'testWithTypeBind',
          display: 'testWithTypeBind',
          authority: 'bound-auth-key'
        },
        submissionId: '1234',
        metadataFields: [],
        hasSelectableMetadata: false,
        typeBindRelations: [
          {match: 'VISIBLE', operator: 'OR', when: [{'id': 'dc.type', 'value': 'boundType'}]}
        ]
      }
    )
  });

}
