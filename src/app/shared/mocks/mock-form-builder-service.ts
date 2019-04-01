import { FormBuilderService } from '../form/builder/form-builder.service';
import { FormControl, FormGroup } from '@angular/forms';

export function getMockFormBuilderService(): FormBuilderService {
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
    hasArrayGroupValue: true

  });

}
