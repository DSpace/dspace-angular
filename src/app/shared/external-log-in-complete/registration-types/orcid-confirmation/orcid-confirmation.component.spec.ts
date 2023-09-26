import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcidConfirmationComponent } from './orcid-confirmation.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { mockRegistrationDataModel } from '../../models/registration-data.mock.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserOnlyMockPipe } from '../../../../shared/testing/browser-only-mock.pipe';

describe('OrcidConfirmationComponent', () => {
  let component: OrcidConfirmationComponent;
  let fixture: ComponentFixture<OrcidConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        OrcidConfirmationComponent,
        BrowserOnlyMockPipe,
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcidConfirmationComponent);
    component = fixture.componentInstance;
    component.registratioData = mockRegistrationDataModel;
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
    fixture.detectChanges();
    component.ngOnInit();
    const emailFormControl = component.form.get('email');
    expect(emailFormControl.value).toBe('');
  });

  it('should not render email input when email is null', () => {
    component.registratioData.email = null;
    fixture.detectChanges();
    component.ngOnInit();
    const emailInput = fixture.nativeElement.querySelector('input[type="email"]');
    expect(emailInput).toBeFalsy();
  });
});
