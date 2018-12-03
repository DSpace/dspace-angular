import { FormBuilderService } from '../form/builder/form-builder.service';
import { FormControl, FormGroup } from '@angular/forms';

export function getMockFormBuilderService(): FormBuilderService {
  return jasmine.createSpyObj('FormBuilderService', {
    modelFromConfiguration: [],
    createFormGroup: new FormGroup({}),
    getValueFromModel: {},
    getFormControlById: new FormControl(),
    findById: {},
    getPath: ['test', 'path'],
    clearAllModelsValue : {},
    insertFormArrayGroup: {},
    isQualdrop: false

  });

}
