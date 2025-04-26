import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { ExternalLoginService } from '../../services/external-login.service';
import { ProvideEmailComponent } from './provide-email.component';

describe('ProvideEmailComponent', () => {
  let component: ProvideEmailComponent;
  let fixture: ComponentFixture<ProvideEmailComponent>;
  let externalLoginServiceSpy: jasmine.SpyObj<ExternalLoginService>;

  beforeEach(async () => {
    const externalLoginService = jasmine.createSpyObj('ExternalLoginService', ['patchUpdateRegistration']);

    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: ExternalLoginService, useValue: externalLoginService },
      ],
      imports: [
        CommonModule,
        ProvideEmailComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvideEmailComponent);
    component = fixture.componentInstance;
    externalLoginServiceSpy = TestBed.inject(ExternalLoginService) as jasmine.SpyObj<ExternalLoginService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call externalLoginService.patchUpdateRegistration when form is submitted with valid email', () => {
    const email = 'test@example.com';
    component.emailForm.setValue({ email });
    component.registrationId = '123';
    component.token = '456';
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    button.click();

    expect(externalLoginServiceSpy.patchUpdateRegistration).toHaveBeenCalledWith([email], 'email', component.registrationId, component.token, 'add');
  });
});
