import {
  fakeAsync,
  waitForAsync,
} from '@angular/core/testing';
import {
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';

import { ConfirmedValidator } from './confirmed.validator';

describe('ConfirmedValidator', () => {
  let passwordForm;

  beforeEach(waitForAsync(() => {

    passwordForm = (new UntypedFormBuilder()).group({
      password: new UntypedFormControl('', {}),
      confirmPassword: new UntypedFormControl('', {}),
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword'),
    });
  }));

  it('should validate that the password and confirm password match', fakeAsync(() => {

    passwordForm.get('password').patchValue('test-password');
    passwordForm.get('confirmPassword').patchValue('test-password-mismatch');

    expect(passwordForm.valid).toBe(false);
  }));

  it('should invalidate that the password and confirm password match', fakeAsync(() => {
    passwordForm.get('password').patchValue('test-password');
    passwordForm.get('confirmPassword').patchValue('test-password');

    expect(passwordForm.valid).toBe(true);
  }));
});
