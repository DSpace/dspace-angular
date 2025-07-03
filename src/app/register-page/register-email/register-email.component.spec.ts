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
import { RegisterEmailComponent } from './register-email.component';

describe('RegisterEmailComponent', () => {

  let comp: RegisterEmailComponent;
  let fixture: ComponentFixture<RegisterEmailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot(), ReactiveFormsModule, RegisterEmailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(RegisterEmailComponent, {
        remove: {
          imports: [ThemedRegisterEmailFormComponent],
        },
      })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEmailComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(comp).toBeDefined();
  });
});
