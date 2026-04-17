import { TestBed } from '@angular/core/testing';
import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import { IpV4Validator } from './ipV4.validator';

describe('IpV4 validator', () => {

  let ipV4Validator: IpV4Validator;
  const validIp = '192.168.0.1';
  const formGroup = new UntypedFormGroup({
    ip: new UntypedFormControl(''),
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        IpV4Validator,
      ],
    }).compileComponents();

    ipV4Validator = TestBed.inject(IpV4Validator);
  });

  it('should return null for valid ipV4',  () => {
    formGroup.controls.ip.setValue(validIp);
    expect(ipV4Validator.validate(formGroup.controls.ip as UntypedFormControl)).toBeNull();
  });

  it('should return {isValidIp: false} for invalid Ip',  () => {
    formGroup.controls.ip.setValue('100.260.45.1');
    expect(ipV4Validator.validate(formGroup.controls.ip as UntypedFormControl)).toEqual({ isValidIp: false });
    formGroup.controls.ip.setValue('100');
    expect(ipV4Validator.validate(formGroup.controls.ip as UntypedFormControl)).toEqual({ isValidIp: false });
    formGroup.controls.ip.setValue('testString');
    expect(ipV4Validator.validate(formGroup.controls.ip as UntypedFormControl)).toEqual({ isValidIp: false });
  });
});
