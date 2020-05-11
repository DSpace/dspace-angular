import { FormBuilder, FormControl } from '@angular/forms';
import { async, fakeAsync } from '@angular/core/testing';
import { ConfirmedValidator } from './confirmed.validator';

describe('ConfirmedValidator', () => {
  let passwordForm;

  beforeEach(async(() => {

    passwordForm = (new FormBuilder()).group({
      password: new FormControl('', {}),
      confirmPassword: new FormControl('', {})
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }));

  it('should validate a language according to the iso-639-1 standard', fakeAsync(() => {

    passwordForm.get('password').patchValue('test-password');
    passwordForm.get('confirmPassword').patchValue('test-password-mismatch');

    expect(passwordForm.valid).toBe(false);
  }));

  it('should invalidate a language that does not comply to the iso-639-1 standard', fakeAsync(() => {
    passwordForm.get('password').patchValue('test-password');
    passwordForm.get('confirmPassword').patchValue('test-password');

    expect(passwordForm.valid).toBe(true);
  }));
});
