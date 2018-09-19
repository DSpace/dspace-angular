import { FormService } from '../form/form.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from 'rxjs/operators';

export function getMockFormService(
  id$: string = 'random_id',
  errors = new BehaviorSubject([])
): FormService {
  return jasmine.createSpyObj('FormService', {
    getUniqueId: id$,
    resetForm: {},
    validateAllFormFields: {},
    getForm: errors.pipe(
      map((err) => {
          return { data: {}, valid: true, errors: err }
        }
      )
    ),
    removeForm: undefined,
    removeError: undefined,
    changeForm: undefined,
    setStatusChanged: undefined,
    initForm: undefined,
    getFormErrors: errors,
    addErrorToField: undefined
  });

}
