import { AbstractControl, ValidationErrors } from '@angular/forms';

export function customValidator(control: AbstractControl): ValidationErrors | null {

    const hasError = control.value ? (control.value as string).startsWith('abc') : false;

    return hasError ? {customValidator: true} : null;
}
