import { FormService } from '../form/form.service';

export function getMockFormService(
  id$: string = 'random_id'
): FormService {
  return jasmine.createSpyObj('FormService', {
    getUniqueId: id$,
    resetForm: {},
    validateAllFormFields: {}
  });

}
