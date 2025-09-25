import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedRegisterEmailFormComponent } from '../../register-email-form/themed-registry-email-form.component';
import { ForgotEmailComponent } from './forgot-email.component';

describe('ForgotEmailComponent', () => {
  let comp: ForgotEmailComponent;
  let fixture: ComponentFixture<ForgotEmailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot(), ReactiveFormsModule, ForgotEmailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ForgotEmailComponent, {
        remove: {
          imports: [ThemedRegisterEmailFormComponent],
        },
      })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotEmailComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });
});
