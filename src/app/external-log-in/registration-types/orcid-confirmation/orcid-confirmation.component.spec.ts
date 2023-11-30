import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcidConfirmationComponent } from './orcid-confirmation.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { mockRegistrationDataModel } from '../../models/registration-data.mock.model';
import { BrowserOnlyMockPipe } from './../../../shared/testing/browser-only-mock.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoaderMock } from './../../../shared/mocks/translate-loader.mock';

describe('OrcidConfirmationComponent', () => {
  let component: OrcidConfirmationComponent;
  let fixture: ComponentFixture<OrcidConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrcidConfirmationComponent,
        BrowserOnlyMockPipe
      ],
      providers: [
        FormBuilder,
        { provide: 'registrationDataProvider', useValue: mockRegistrationDataModel },
      ],
      imports: [
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
    component.registratioData.email = null;
    component.ngOnInit();
    fixture.detectChanges();
    const emailFormControl = component.form.get('email');
    expect(emailFormControl.value).toBe('');
  });

});
