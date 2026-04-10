import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Registration } from 'src/app/core/shared/registration.model';

import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { BrowserOnlyMockPipe } from '../../../shared/testing/browser-only-mock.pipe';
import { mockRegistrationDataModel } from '../../models/registration-data.mock.model';
import { OrcidConfirmationComponent } from './orcid-confirmation.component';

describe('OrcidConfirmationComponent', () => {
  let component: OrcidConfirmationComponent;
  let fixture: ComponentFixture<OrcidConfirmationComponent>;
  let model: Registration;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        { provide: 'registrationDataProvider', useValue: mockRegistrationDataModel },
      ],
      imports: [
        OrcidConfirmationComponent,
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        BrowserOnlyMockPipe,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcidConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with disabled fields', () => {
    expect(component.form).toBeInstanceOf(FormGroup);
    expect(component.form.controls.netId.disabled).toBeTrue();
    expect(component.form.controls.firstname.disabled).toBeTrue();
    expect(component.form.controls.lastname.disabled).toBeTrue();
    expect(component.form.controls.email.disabled).toBeTrue();
  });


  it('should initialize the form with null email as an empty string', () => {
    component.registrationData.email = null;
    component.ngOnInit();
    fixture.detectChanges();
    const emailFormControl = component.form.get('email');
    expect(emailFormControl.value).toBe('');
  });

});
