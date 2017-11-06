// Load the implementations that should be tested
import { CommonModule } from '@angular/common';

import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement
} from '@angular/core';

import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from '@angular/core/testing';

import { StoreModule } from '@ngrx/store';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import Spy = jasmine.Spy;

import { FormComponent } from './form.component';
import { FormService } from './form.service';
import { DynamicFormControlModel, DynamicFormValidationService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilderService } from './builder/form-builder.service';
import { SubmissionFormsConfigService } from '../../core/config/submission-forms-config.service';
import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { RequestService } from '../../core/data/request.service';
import { ObjectCacheService } from '../../core/cache/object-cache.service';
import { Observable } from 'rxjs/Observable';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: { template: html }
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

export const TEST_FORM_MODEL = [

  new DynamicInputModel(
    {
      id: 'dc_title',
      label: 'Title',
      placeholder: 'Title',
      validators: {
        required: null
      },
      errorMessages: {
        required: 'You must enter a main title for this item.'
      }
    }
  ),

  new DynamicInputModel(
    {
      id: 'dc_title_alternative',
      label: 'Other Titles',
      placeholder: 'Other Titles',
    }
  ),

  new DynamicInputModel(
    {
      id: 'dc_publisher',
      label: 'Publisher',
      placeholder: 'Publisher',
    }
  ),

  new DynamicInputModel(
    {
      id: 'dc_identifier_citation',
      label: 'Citation',
      placeholder: 'Citation',
    }
  ),

  new DynamicInputModel(
    {
      id: 'dc_identifier_issn',
      label: 'Identifiers',
      placeholder: 'Identifiers',
    }
  ),
];

export const TEST_FORM_GROUP = {
  dc_title: new FormControl(),
  dc_title_alternative: new FormControl(),
  dc_publisher: new FormControl(),
  dc_identifier_citation: new FormControl(),
  dc_identifier_issn: new FormControl()
}

describe('Form component', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let html;
  const formServiceStub = {
    getFormData: (formId) => Observable.of([])
  }
  const formBuilderServiceStub = {
    createFormGroup: (formModel) => new FormGroup(TEST_FORM_GROUP)
  }
  const submissionFormsConfigServiceStub = { }

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        NgbModule.forRoot(),
      ],
      declarations: [
        FormComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        FormComponent,
        { provide: FormService, useValue: formServiceStub },
        { provide: FormBuilderService, useValue: formBuilderServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-form #formRef="formComponent"
               [formId]="formId"
               [formModel]="formModel"
               [displaySubmit]="false"></ds-form>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;

  });

  it('should create Form Component', inject([FormComponent], (app: FormComponent) => {
    expect(app).toBeDefined();
  }));

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  public formId;
  public formModel: DynamicFormControlModel[];

  constructor() {
    this.formId = 'testForm';
    this.formModel = TEST_FORM_MODEL;
  }

}
