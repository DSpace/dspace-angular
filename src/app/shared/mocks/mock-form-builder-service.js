import { FormControl, FormGroup } from '@angular/forms';
export function getMockFormBuilderService() {
    return jasmine.createSpyObj('FormBuilderService', {
        modelFromConfiguration: [],
        createFormGroup: new FormGroup({}),
        getValueFromModel: {},
        getFormControlById: new FormControl(),
        hasMappedGroupValue: false,
        findById: {},
        getPath: ['test', 'path'],
        getId: 'path',
        clearAllModelsValue: {},
        insertFormArrayGroup: {},
        isQualdrop: false,
        isQualdropGroup: false,
        isModelInCustomGroup: true,
        isRelationGroup: true,
        hasArrayGroupValue: true
    });
}
//# sourceMappingURL=mock-form-builder-service.js.map