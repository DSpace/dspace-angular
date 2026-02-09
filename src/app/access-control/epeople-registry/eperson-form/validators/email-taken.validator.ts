import {
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { EPersonDataService } from '@dspace/core/eperson/eperson-data.service';
import { getFirstSucceededRemoteData } from '@dspace/core/shared/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ValidateEmailNotTaken {

  /**
   * This method will create the validator with the ePersonDataService requested from component
   * @param ePersonDataService the service with DI in the component that this validator is being utilized.
   */
  static createValidator(ePersonDataService: EPersonDataService) {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return ePersonDataService.getEPersonByEmail(control.value)
        .pipe(
          getFirstSucceededRemoteData(),
          map(res => {
            return res.payload ? { emailTaken: true } : null;
          }),
        );
    };
  }
}
