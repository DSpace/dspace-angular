import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailComponent } from './confirm-email.component';
import { FormBuilder } from '@angular/forms';
import { EpersonRegistrationService } from '../../../../core/data/eperson-registration.service';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEmailComponent ],
      providers: [
        FormBuilder,
        { provide: EpersonRegistrationService, useValue: {} },
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
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
