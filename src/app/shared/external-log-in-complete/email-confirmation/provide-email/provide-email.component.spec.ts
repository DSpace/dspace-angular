import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvideEmailComponent } from './provide-email.component';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../shared/mocks/translate-loader.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProvideEmailComponent', () => {
  let component: ProvideEmailComponent;
  let fixture: ComponentFixture<ProvideEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvideEmailComponent ],
      providers: [
        FormBuilder,
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
    fixture = TestBed.createComponent(ProvideEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
