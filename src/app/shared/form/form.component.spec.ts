// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { DynamicFormControlModel, DynamicFormValidationService, DynamicInputModel } from '@ng-dynamic-forms/core';
import { Store } from '@ngrx/store';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FormComponent } from './form.component';
import { FormService } from './form.service';
import { FormBuilderService } from './builder/form-builder.service';
import { FormState } from './form.reducers';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
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
  const submissionFormsConfigServiceStub = {};

  const store: Store<FormState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of({})
  });

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [
        FormComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DynamicFormValidationService,
        FormBuilderService,
        FormComponent,
        FormService,
        {
          provide: Store, useValue: store
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-form *ngIf="formModel" #formRef="formComponent"
               [formId]="formId"
               [formModel]="formModel"
               [displaySubmit]="displaySubmit"></ds-form>`;

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
  public displaySubmit = false;

  constructor() {
    this.formId = 'testForm';
    this.formModel = TEST_FORM_MODEL;
  }

}
