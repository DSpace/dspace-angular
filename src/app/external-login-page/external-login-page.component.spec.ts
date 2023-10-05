import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLoginPageComponent } from './external-login-page.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { Registration } from '../core/shared/registration.model';

describe('ExternalLoginPageComponent', () => {
  let component: ExternalLoginPageComponent;
  let fixture: ComponentFixture<ExternalLoginPageComponent>;

  const registrationDataMock = {
    registrationType: 'orcid',
    email: 'test@test.com',
    netId: '0000-0000-0000-0000',
    user: 'a44d8c9e-9b1f-4e7f-9b1a-5c9d8a0b1f1a',
    registrationMetadata: {
      'email': [{ value: 'test@test.com' }],
      'eperson.lastname': [{ value: 'Doe' }],
      'eperson.firstname': [{ value: 'John' }],
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLoginPageComponent ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                token: '1234567890',
              },
            },
            data: of(registrationDataMock),
          },
        },
      ],
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the token from the query params', () => {
    expect(component.token).toEqual('1234567890');
  });

  it('should display the DsExternalLogIn component when there are no errors', () => {
    const registrationData = Object.assign(new Registration(), registrationDataMock);
    component.registrationData$ = of(registrationData);
    component.token = '1234567890';
    component.hasErrors = false;
    fixture.detectChanges();
    const dsExternalLogInComponent = fixture.nativeElement.querySelector('ds-external-log-in');
    expect(dsExternalLogInComponent).toBeTruthy();
  });
});
