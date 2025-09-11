// Load the implementations that should be tested
import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NgbModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  DYNAMIC_FORM_CONTROL_MAP_FN,
  DynamicFormLayoutService,
  DynamicFormValidationService,
} from '@ng-dynamic-forms/core';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from 'src/config/app-config.interface';
import { environment } from 'src/environments/environment.test';

import { FormRowModel } from '../../../../../../core/config/models/config-submission-form.model';
import { SubmissionFormsModel } from '../../../../../../core/config/models/config-submission-forms.model';
import { SubmissionObjectDataService } from '../../../../../../core/submission/submission-object-data.service';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { XSRFService } from '../../../../../../core/xsrf/xsrf.service';
import { SubmissionService } from '../../../../../../submission/submission.service';
import { createTestComponent } from '../../../../../testing/utils.test';
import { VocabularyServiceStub } from '../../../../../testing/vocabulary-service.stub';
import { Chips } from '../../../../chips/models/chips.model';
import { FormComponent } from '../../../../form.component';
import { FormService } from '../../../../form.service';
import { FormBuilderService } from '../../../form-builder.service';
import { FormFieldModel } from '../../../models/form-field.model';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { dsDynamicFormControlMapFn } from '../../ds-dynamic-form-control-map-fn';
import { DsDynamicTypeBindRelationService } from '../../ds-dynamic-type-bind-relation.service';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';
import { DsDynamicRelationGroupComponent } from './dynamic-relation-group.components';
import {
  DynamicRelationGroupModel,
  DynamicRelationGroupModelConfig,
} from './dynamic-relation-group.model';

export let FORM_GROUP_TEST_MODEL_CONFIG;

export let FORM_GROUP_TEST_GROUP;

const submissionId = '1234';
const initialState: any = {
  core: {
    'bitstreamFormats': {},
    'cache/object': {},
    'cache/syncbuffer': {},
    'cache/object-updates': {},
    'data/request': {},
    'history': {},
    'index': {},
    'auth': {},
    'json/patch': {},
    'metaTag': {},
    'route': {},
  },
};
function init() {
  FORM_GROUP_TEST_MODEL_CONFIG = {
    disabled: false,
    errorMessages: { required: 'You must specify at least one author.' },
    formConfiguration: [{
      fields: [{
        hints: 'Enter the name of the author.',
        input: { type: 'onebox' },
        label: 'Author',
        languageCodes: [],
        mandatory: 'true',
        mandatoryMessage: 'Required field!',
        repeatable: false,
        selectableMetadata: [{
          controlledVocabulary: 'RPAuthority',
          closed: false,
          metadata: 'dc.contributor.author',
        }],
      } as FormFieldModel],
    } as FormRowModel, {
      fields: [{
        hints: 'Enter the affiliation of the author.',
        input: { type: 'onebox' },
        label: 'Affiliation',
        languageCodes: [],
        mandatory: 'false',
        repeatable: false,
        selectableMetadata: [{
          controlledVocabulary: 'OUAuthority',
          closed: false,
          metadata: 'local.contributor.affiliation',
        }],
      } as FormFieldModel],
    } as FormRowModel],
    submissionId,
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
    validators: { required: null },
    repeatable: false,
    metadataFields: [],
    hasSelectableMetadata: false,
  } as DynamicRelationGroupModelConfig;

  FORM_GROUP_TEST_GROUP = new UntypedFormGroup({
    dc_contributor_author: new UntypedFormControl(),
  });

}

describe('DsDynamicRelationGroupComponent test suite', () => {
  let testComp: TestComponent;
  let groupComp: DsDynamicRelationGroupComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let groupFixture: ComponentFixture<DsDynamicRelationGroupComponent>;
  let vocabularyServiceStub: any;
  let modelValue: any;
  let html;
  let control1: UntypedFormControl;
  let model1: DsDynamicInputModel;
  let control2: UntypedFormControl;
  let model2: DsDynamicInputModel;

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    init();
    vocabularyServiceStub = new VocabularyServiceStub();
    /* TODO make sure these files use mocks instead of real services/components https://github.com/DSpace/dspace-angular/issues/281 */
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        TranslateModule.forRoot(),
        FormComponent,
        DsDynamicRelationGroupComponent,
        TestComponent,
      ],
      providers: [
        ChangeDetectorRef,
        DsDynamicRelationGroupComponent,
        DynamicFormValidationService,
        DynamicFormLayoutService,
        FormBuilderService,
        FormComponent,
        FormService,
        provideMockStore({ initialState }),
        { provide: VocabularyService, useValue: vocabularyServiceStub },
        { provide: DsDynamicTypeBindRelationService, useClass: DsDynamicTypeBindRelationService },
        { provide: SubmissionObjectDataService, useValue: {} },
        { provide: SubmissionService, useValue: {} },
        { provide: XSRFService, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: DYNAMIC_FORM_CONTROL_MAP_FN, useValue: dsDynamicFormControlMapFn },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      html = `<ds-dynamic-relation-group [model]="model"
                            [formId]="formId"
                            [group]="group"
                            (blur)="onBlur($event)"
                            (change)="onValueChange($event)"
                            (focus)="onFocus($event)"></ds-dynamic-relation-group>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
      testComp = null;
    });

    it('should create DsDynamicRelationGroupComponent', inject([DsDynamicRelationGroupComponent], (app: DsDynamicRelationGroupComponent) => {

      expect(app).toBeDefined();
    }));
  });

  describe('when init model value is empty', () => {
    beforeEach(inject([FormBuilderService], (service: FormBuilderService) => {
      groupFixture = TestBed.createComponent(DsDynamicRelationGroupComponent);
      groupComp = groupFixture.componentInstance; // FormComponent test instance
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      groupFixture.detectChanges();
      control1 = service.getFormControlById('dc_contributor_author', (groupComp as any).formRef.formGroup, groupComp.formModel) as UntypedFormControl;
      model1 = service.findById('dc_contributor_author', groupComp.formModel) as DsDynamicInputModel;
      control2 = service.getFormControlById('local_contributor_affiliation', (groupComp as any).formRef.formGroup, groupComp.formModel) as UntypedFormControl;
      model2 = service.findById('local_contributor_affiliation', groupComp.formModel) as DsDynamicInputModel;

      // spyOn(store, 'dispatch');
    }));

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    it('should init component properly', inject([FormBuilderService], (service: FormBuilderService) => {
      const formConfig = { rows: groupComp.model.formConfiguration } as SubmissionFormsModel;
      const formModel = service.modelFromConfiguration(submissionId, formConfig, groupComp.model.scopeUUID, {}, groupComp.model.submissionScope, groupComp.model.readOnly);
      const chips = new Chips([], 'value', 'dc.contributor.author');
      groupComp.formCollapsed.subscribe((value) => {
        expect(value).toEqual(false);
      });
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
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation'),
      }];
      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      const btnEl = buttons[0];
      btnEl.click();

      expect(groupComp.chips.getChipsItems()).toEqual(modelValue);
      groupComp.formCollapsed.subscribe((value) => {
        expect(value).toEqual(true);
      });
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
      groupComp.formCollapsed.subscribe((value) => {
        expect(value).toEqual(false);
      });
    });
  });

  describe('when init model value is not empty', () => {
    beforeEach(() => {

      groupFixture = TestBed.createComponent(DsDynamicRelationGroupComponent);
      groupComp = groupFixture.componentInstance; // FormComponent test instance
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation'),
      }];
      groupComp.model.value = modelValue;
      groupFixture.detectChanges();

    });

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    it('should init component properly', inject([FormBuilderService], (service: FormBuilderService) => {
      const formConfig = { rows: groupComp.model.formConfiguration } as SubmissionFormsModel;
      const formModel = service.modelFromConfiguration(submissionId, formConfig, groupComp.model.scopeUUID, {}, groupComp.model.submissionScope, groupComp.model.readOnly);
      const chips = new Chips(modelValue, 'value', 'dc.contributor.author');
      groupComp.formCollapsed.subscribe((value) => {
        expect(value).toEqual(true);
      });
      expect(groupComp.formModel.length).toEqual(formModel.length);
      expect(groupComp.chips.getChipsItems()).toEqual(chips.getChipsItems());
    }));

    it('should modify existing chips item', inject([FormBuilderService], (service: FormBuilderService) => {
      groupComp.onChipSelected(0);
      groupFixture.detectChanges();

      control1 = service.getFormControlById('dc_contributor_author', (groupComp as any).formRef.formGroup, groupComp.formModel) as UntypedFormControl;
      model1 = service.findById('dc_contributor_author', groupComp.formModel) as DsDynamicInputModel;

      control1.setValue('test author modify');
      (model1 as any).value = new FormFieldMetadataValueObject('test author modify');

      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author modify'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation'),
      }];
      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      const btnEl = buttons[0];
      btnEl.click();

      groupFixture.detectChanges();

      expect(groupComp.chips.getChipsItems()).toEqual(modelValue);
      groupComp.formCollapsed.subscribe((value) => {
        expect(value).toEqual(true);
      });
    }));

    it('should delete existing chips item', () => {
      groupComp.onChipSelected(0);
      groupFixture.detectChanges();

      const buttons = groupFixture.debugElement.nativeElement.querySelectorAll('button');
      const btnEl = buttons[1];
      btnEl.click();

      expect(groupComp.chips.getChipsItems()).toEqual([]);
      groupComp.formCollapsed.subscribe((value) => {
        expect(value).toEqual(false);
      });
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [
    AsyncPipe,
    DsDynamicRelationGroupComponent,
    NgbTooltipModule,
    NgClass,
    TranslateModule,
  ],
})
class TestComponent {

  group = FORM_GROUP_TEST_GROUP;

  groupModelConfig = FORM_GROUP_TEST_MODEL_CONFIG;

  model = new DynamicRelationGroupModel(this.groupModelConfig);

  showErrorMessages = false;

}
