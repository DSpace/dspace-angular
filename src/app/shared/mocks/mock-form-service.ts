import { of as observableOf } from 'rxjs';

import { FormService } from '../form/form.service';

export function getMockFormService(
  id$: string = 'random_id'
): FormService {
  return jasmine.createSpyObj('FormService', {
    getFormData: jasmine.createSpy('getFormData'),
    getUniqueId: id$,
    resetForm: {},
    validateAllFormFields: {},
    isValid: observableOf(true),
    isFormInitialized: observableOf(true)
  });

}
