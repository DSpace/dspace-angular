import { of as observableOf } from 'rxjs';
/**
 * Mock for [[FormService]]
 */
export function getMockFormService(id$) {
    if (id$ === void 0) { id$ = 'random_id'; }
    return jasmine.createSpyObj('FormService', {
        getFormData: jasmine.createSpy('getFormData'),
        initForm: jasmine.createSpy('initForm'),
        removeForm: jasmine.createSpy('removeForm'),
        getForm: observableOf({}),
        getUniqueId: id$,
        resetForm: {},
        validateAllFormFields: jasmine.createSpy('validateAllFormFields'),
        isValid: jasmine.createSpy('isValid'),
        isFormInitialized: observableOf(true)
    });
}
//# sourceMappingURL=mock-form-service.js.map