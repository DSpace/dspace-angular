// ... test imports
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';

import { CommonModule } from '@angular/common';

import { By } from '@angular/platform-browser';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';

// Load the implementations that should be tested
import { FooterComponent } from './footer.component';

import { TranslateLoaderMock } from '../shared/mocks/translate-loader.mock';
import { storeModuleConfig } from '../app.reducer';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { AuthorizationDataServiceStub } from '../shared/testing/authorization-service.stub';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';

let comp: FooterComponent;
let fixture: ComponentFixture<FooterComponent>;
let de: DebugElement;
let el: HTMLElement;
let mockConfigurationDataService: ConfigurationDataService;

describe('Footer component', () => {
  mockConfigurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'themed.by.url',
      values: [
        'some.url'
      ]
    }))
  });

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      imports: [CommonModule, StoreModule.forRoot({}, storeModuleConfig), TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [FooterComponent], // declare the test component
      providers: [
        FooterComponent,
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        FooterComponent,
        { provide: ConfigurationDataService, useValue: mockConfigurationDataService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);

    comp = fixture.componentInstance; // component test instance

    // query for the title <p> by CSS element selector
    de = fixture.debugElement.query(By.css('p'));
    el = de.nativeElement;
  });

  it('should create footer', inject([FooterComponent], (app: FooterComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));

});
