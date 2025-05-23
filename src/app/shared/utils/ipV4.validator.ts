import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  UntypedFormControl,
  Validator,
} from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ipV4format]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: IpV4Validator, multi: true },
  ],
  standalone: true,
})
/**
 * Validator to validate if an Ip is in the right format
 */
export class IpV4Validator implements Validator {
  validate(formControl: UntypedFormControl): {[key: string]: boolean} | null {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipValue = formControl.value;
    const ipParts = ipValue?.split('.');

    if (ipv4Regex.test(ipValue) && ipParts.every(part => parseInt(part, 10) <= 255)) {
      return null;
    }

    return { isValidIp: false };
  }
}
