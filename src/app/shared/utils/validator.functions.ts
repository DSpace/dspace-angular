import { AbstractControl, ValidatorFn } from '@angular/forms';

export function inListValidator(list: string[]): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const contains = list.indexOf(control.value) > 0;
    return contains ? null : {inList: {value: control.value}}  };
}
