// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import 'rxjs/add/observable/of';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DsDynamicGroupComponent } from './dynamic-group.components';
import { DynamicGroupModel } from './dynamic-group.model';
import { FormRowModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { FormFieldModel } from '../../../models/form-field.model';
import { FormBuilderService } from '../../../form-builder.service';
import { FormService } from '../../../../form.service';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { FormComponent } from '../../../../form.component';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../app.reducer';
import { Observable } from 'rxjs/Observable';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

describe('Dynamic Group component', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let html;

  const mockStore: Store<AppState> = jasmine.createSpyObj('store', {
    dispatch: {},
    select: Observable.of(true)
  });

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [
        FormComponent,
        DsDynamicGroupComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicGroupComponent,
        DynamicFormValidationService,
        FormBuilderService,
        FormComponent,
        FormService,
        {provide: GLOBAL_CONFIG, useValue: {} as GlobalConfig},
        {provide: Store, useValue: mockStore},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
           <ds-date-picker
            [bindId]='bindId'
            [group]='group'
            [model]='model'
            [showErrorMessages]='showErrorMessages'
            (blur)='onBlur($event)'
            (change)='onValueChange($event)'
            (focus)='onFocus($event)'></ds-date-picker>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create DsDynamicGroupComponent', inject([DsDynamicGroupComponent], (app: DsDynamicGroupComponent) => {

    expect(app).toBeDefined();
  }));

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group = new FormGroup({
    date: new FormControl(),
  });

  groupModelConfig = {
    disabled: false,
    errorMessages: {required: 'You must specify at least one author.'},
    formConfiguration: [{
      fields: [{
        hints: 'Enter the name of the author.',
        input: {type: 'onebox'},
        label: 'Authors',
        languageCodes: [],
        mandatory: 'true',
        mandatoryMessage: 'Required field!',
        repeatable: false,
        selectableMetadata: [{
          authority: 'RPAuthority',
          closed: false,
          metadata: 'dc.contributor.author'
        }],
      } as FormFieldModel]
    } as FormRowModel, {
      fields: [{
        hints: 'Enter the affiliation of the author.',
        input: {type: 'onebox'},
        label: 'Affiliation',
        languageCodes: [],
        mandatory: 'false',
        repeatable: false,
        selectableMetadata: [{
          authority: 'OUAuthority',
          closed: false,
          metadata: 'local.contributor.affiliation'
        }]
      } as FormFieldModel]
    } as FormRowModel],
    id: 'date',
    label: 'Date',
    mandatoryField: 'dc.contributor.author',
    name: 'date',
    placeholder: 'Date',
    readOnly: false,
    relationFields: ['local.contributor.affiliation'],
    required: true,
    scopeUUID: '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f',
    submissionScope: undefined,
    validators: {required: null}
  };

  model = new DynamicGroupModel(this.groupModelConfig);

  showErrorMessages = false;

}
