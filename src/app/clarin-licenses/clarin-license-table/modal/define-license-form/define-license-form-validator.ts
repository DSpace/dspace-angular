import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * One non extended License Label must be selected in defining the new License.
 * If non license label is selected -> the `submit` button is disabled
 */
export function validateLicenseLabel(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return { licenseLabel: true };
    }

    return null;
  };
}
