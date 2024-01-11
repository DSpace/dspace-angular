import {Directive} from '@angular/core';
import {NG_VALIDATORS, Validator, UntypedFormControl} from '@angular/forms';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ipV4format]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: IpV4Validator, multi: true },
  ]
})
/**
 * Validator to validate if an Ip is in the right format
 */
export class IpV4Validator implements Validator {
  validate(formControl: UntypedFormControl): {[key: string]: boolean} | null {
    const ipv4Regex = /^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipValue = formControl.value;
    const ipParts = ipValue?.split('.');
    const numberOfParts = ipParts.length;

    if (ipValue && (numberOfParts !== 4 || !ipv4Regex.test(ipValue))) {
      return {isValidIp: false};
    }

    return null;
  }
}
