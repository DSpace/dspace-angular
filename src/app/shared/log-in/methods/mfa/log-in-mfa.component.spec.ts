import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MfaResetAction,
  MfaVerifyAction,
} from '@dspace/core/auth/mfa.actions';
import {
  getMfaError,
  isMfaVerifying,
} from '@dspace/core/auth/selectors';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

import { LogInMfaComponent } from './log-in-mfa.component';

describe('LogInMfaComponent', () => {
  let component: LogInMfaComponent;
  let fixture: ComponentFixture<LogInMfaComponent>;
  let store: MockStore;

  const initialState = {
    core: {
      auth: {
        mfaRequired: true,
        mfaVerifying: false,
        mfaError: null,
        mfaPendingToken: { accessToken: 'test' },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), LogInMfaComponent],
      providers: [
        provideMockStore({
          initialState,
          selectors: [
            { selector: isMfaVerifying, value: false },
            { selector: getMfaError, value: null },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(LogInMfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate 6-digit code pattern', () => {
    component.form.get('code').setValue('123456');
    expect(component.form.valid).toBeTruthy();

    component.form.get('code').setValue('12345');
    expect(component.form.valid).toBeFalsy();

    component.form.get('code').setValue('abcdef');
    expect(component.form.valid).toBeFalsy();
  });

  it('should dispatch MfaVerifyAction with code on submit', () => {
    spyOn(store, 'dispatch');
    component.form.get('code').setValue('123456');
    component.submit();
    expect(store.dispatch).toHaveBeenCalledWith(new MfaVerifyAction({ code: '123456' }));
  });

  it('should dispatch MfaVerifyAction with recoveryCode when in recovery mode', () => {
    spyOn(store, 'dispatch');
    component.toggleRecovery();
    component.form.get('code').setValue('abc12345');
    component.submit();
    expect(store.dispatch).toHaveBeenCalledWith(new MfaVerifyAction({ recoveryCode: 'abc12345' }));
  });

  it('should dispatch MfaResetAction on cancel', () => {
    spyOn(store, 'dispatch');
    component.cancel();
    expect(store.dispatch).toHaveBeenCalledWith(new MfaResetAction());
  });

  it('should toggle between TOTP and recovery input', () => {
    expect(component.showRecoveryInput).toBeFalsy();
    component.toggleRecovery();
    expect(component.showRecoveryInput).toBeTruthy();
    component.toggleRecovery();
    expect(component.showRecoveryInput).toBeFalsy();
  });

  it('should relax validation pattern in recovery mode', () => {
    component.toggleRecovery();
    component.form.get('code').setValue('abc12345');
    expect(component.form.valid).toBeTruthy();
  });
});
