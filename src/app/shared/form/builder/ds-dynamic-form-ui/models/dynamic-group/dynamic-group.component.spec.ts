// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DsDynamicGroupComponent } from './dynamic-group.components';
import { DynamicGroupModel, DynamicGroupModelConfig } from './dynamic-group.model';
import { FormRowModel, SubmissionFormsModel } from '../../../../../../core/shared/config/config-submission-forms.model';
import { FormFieldModel } from '../../../models/form-field.model';
import { FormBuilderService } from '../../../form-builder.service';
import { FormService } from '../../../../form.service';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { FormComponent } from '../../../../form.component';
import { AppState } from '../../../../../../app.reducer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Chips } from '../../../../../chips/models/chips.model';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

export const FORM_GROUP_TEST_MODEL_CONFIG = {
  disabled: false,
  errorMessages: {required: 'You must specify at least one author.'},
  formConfiguration: [{
    fields: [{
      hints: 'Enter the name of the author.',
      input: {type: 'onebox'},
      label: 'Author',
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
  id: 'dc_contributor_author',
  label: 'Authors',
  mandatoryField: 'dc.contributor.author',
  name: 'dc.contributor.author',
  placeholder: 'Authors',
  readOnly: false,
  relationFields: ['local.contributor.affiliation'],
  required: true,
  scopeUUID: '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f',
  submissionScope: undefined,
  validators: {required: null}
} as DynamicGroupModelConfig;

export const FORM_GROUP_TEST_GROUP = new FormGroup({
  dc_contributor_author: new FormControl(),
});

fdescribe('DsDynamicGroupComponent test suite', () => {
  const config = {
    form: {
      validatorMap: {
        required: 'required',
        regex: 'pattern'
      }
    }
  } as any;
  let testComp: TestComponent;
  let groupComp: DsDynamicGroupComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let groupFixture: ComponentFixture<DsDynamicGroupComponent>;
  let modelValue: any;
  let html;
  let control1: FormControl;
  let model1: DsDynamicInputModel;
  let control2: FormControl;
  let model2: DsDynamicInputModel;

  const store: Store<AppState> = jasmine.createSpyObj('store', {
    dispatch: {},
    select: Observable.of(true)
  });

  // async beforeEach
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
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
        {provide: GLOBAL_CONFIG, useValue: config},
        {provide: Store, useValue: store},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `
          <ds-dynamic-group [model]="model"
                            [formId]="formId"
                            [group]="group"
                            [showErrorMessages]="showErrorMessages"
                            (blur)="onBlur($event)"
                            (change)="onValueChange($event)"
                            (focus)="onFocus($event)"></ds-dynamic-group>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    it('should create DsDynamicGroupComponent', inject([DsDynamicGroupComponent], (app: DsDynamicGroupComponent) => {

      expect(app).toBeDefined();
    }));
  });

  describe('when init model value is empty', () => {
    beforeEach(inject([FormBuilderService], (service: FormBuilderService) => {

      groupFixture = TestBed.createComponent(DsDynamicGroupComponent);
      groupComp = groupFixture.componentInstance; // FormComponent test instance
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      groupComp.showErrorMessages = false;
      groupFixture.detectChanges();

      control1 = service.getFormControlById('dc_contributor_author', (groupComp as any).formRef.formGroup, groupComp.formModel) as FormControl;
      model1 = service.findById('dc_contributor_author', groupComp.formModel) as DsDynamicInputModel;
      control2 = service.getFormControlById('local_contributor_affiliation', (groupComp as any).formRef.formGroup, groupComp.formModel) as FormControl;
      model2 = service.findById('local_contributor_affiliation', groupComp.formModel) as DsDynamicInputModel;

      // spyOn(store, 'dispatch');
    }));

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    it('should init component properly', inject([FormBuilderService], (service: FormBuilderService) => {
      const formConfig = {rows: groupComp.model.formConfiguration} as SubmissionFormsModel;
      const formModel = service.modelFromConfiguration(formConfig, groupComp.model.scopeUUID, {}, groupComp.model.submissionScope, groupComp.model.readOnly);
      const chips = new Chips([], 'value', 'dc.contributor.author');

      expect(groupComp.formCollapsed).toEqual(Observable.of(false));
      expect(groupComp.formModel.length).toEqual(formModel.length);
      expect(groupComp.chips.getChipsItems()).toEqual(chips.getChipsItems());
    }));

    it('should save a new chips item', () => {
      control1.setValue('test author');
      (model1 as any).value = new FormFieldMetadataValueObject('test author');
      control2.setValue('test affiliation');
      (model2 as any).value = new FormFieldMetadataValueObject('test affiliation');
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }];
      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      const btnEl = buttons[0];
      btnEl.click();

      expect(groupComp.chips.getChipsItems()).toEqual(modelValue);
      expect(groupComp.formCollapsed).toEqual(Observable.of(true));
    });

    it('should clear form inputs', () => {
      control1.setValue('test author');
      (model1 as any).value = new FormFieldMetadataValueObject('test author');
      control2.setValue('test affiliation');
      (model2 as any).value = new FormFieldMetadataValueObject('test affiliation');

      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      const btnEl = buttons[2];
      btnEl.click();

      expect(control1.value).toBeNull();
      expect(control2.value).toBeNull();
      expect(groupComp.formCollapsed).toEqual(Observable.of(false));
    });
  });

  describe('when init model value is not empty', () => {
    beforeEach(() => {

      groupFixture = TestBed.createComponent(DsDynamicGroupComponent);
      groupComp = groupFixture.componentInstance; // FormComponent test instance
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }];
      groupComp.model.value = modelValue;
      groupComp.showErrorMessages = false;
      groupFixture.detectChanges();

    });

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    it('should init component properly', inject([FormBuilderService], (service: FormBuilderService) => {
      const formConfig = {rows: groupComp.model.formConfiguration} as SubmissionFormsModel;
      const formModel = service.modelFromConfiguration(formConfig, groupComp.model.scopeUUID, {}, groupComp.model.submissionScope, groupComp.model.readOnly);
      const chips = new Chips(modelValue, 'value', 'dc.contributor.author');

      expect(groupComp.formCollapsed).toEqual(Observable.of(true));
      expect(groupComp.formModel.length).toEqual(formModel.length);
      expect(groupComp.chips.getChipsItems()).toEqual(chips.getChipsItems());
    }));

    it('should modify existing chips item', inject([FormBuilderService], (service: FormBuilderService) => {
      groupComp.onChipSelected(0);
      groupFixture.detectChanges();

      control1 = service.getFormControlById('dc_contributor_author', (groupComp as any).formRef.formGroup, groupComp.formModel) as FormControl;
      model1 = service.findById('dc_contributor_author', groupComp.formModel) as DsDynamicInputModel;

      control1.setValue('test author modify');
      (model1 as any).value = new FormFieldMetadataValueObject('test author modify');

      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author modify'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }];
      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      const btnEl = buttons[0];
      btnEl.click();

      groupFixture.detectChanges();

      expect(groupComp.chips.getChipsItems()).toEqual(modelValue);
      expect(groupComp.formCollapsed).toEqual(Observable.of(true));
    }));

    it('should delete existing chips item', () => {
      groupComp.onChipSelected(0);
      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      const btnEl = buttons[1];
      btnEl.click();

      expect(groupComp.chips.getChipsItems()).toEqual([]);
      expect(groupComp.formCollapsed).toEqual(Observable.of(false));
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group = FORM_GROUP_TEST_GROUP;

  groupModelConfig = FORM_GROUP_TEST_MODEL_CONFIG;

  model = new DynamicGroupModel(this.groupModelConfig);

  showErrorMessages = false;

}
