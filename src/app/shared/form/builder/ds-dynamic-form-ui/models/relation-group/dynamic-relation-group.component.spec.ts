// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync, } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';

import { DsDynamicRelationGroupComponent } from './dynamic-relation-group.components';
import { DynamicRelationGroupModel, DynamicRelationGroupModelConfig } from './dynamic-relation-group.model';
import { SubmissionFormsModel } from '../../../../../../core/config/models/config-submission-forms.model';
import { FormFieldModel } from '../../../models/form-field.model';
import { FormBuilderService } from '../../../form-builder.service';
import { FormService } from '../../../../form.service';
import { FormComponent } from '../../../../form.component';
import { Chips } from '../../../../../chips/models/chips.model';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
import { DsDynamicInputModel } from '../ds-dynamic-input.model';
import { createTestComponent } from '../../../../../testing/utils.test';
import { VocabularyService } from '../../../../../../core/submission/vocabularies/vocabulary.service';
import { VocabularyServiceStub } from '../../../../../testing/vocabulary-service.stub';
import { StoreMock } from '../../../../../testing/store.mock';
import { FormRowModel } from '../../../../../../core/config/models/config-submission-form.model';
import { storeModuleConfig } from '../../../../../../app.reducer';
import { createSuccessfulRemoteDataObject$ } from '../../../../../remote-data.utils';
import { By } from '@angular/platform-browser';
import { SubmissionService } from '../../../../../../submission/submission.service';
import { SubmissionServiceStub } from '../../../../../testing/submission-service.stub';
import { SubmissionScopeType } from '../../../../../../core/submission/submission-scope-type';
import { Vocabulary } from '../../../../../../core/submission/vocabularies/models/vocabulary.model';
import { VocabularyEntryDetail } from '../../../../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';

export let FORM_GROUP_TEST_MODEL_CONFIG;

export let FORM_GROUP_TEST_GROUP;

const submissionId = '1234';

const vocabulary: any = Object.assign(new Vocabulary(), {
  id: 'types',
  name: 'types',
  scrollable: true,
  hierarchical: false,
  preloadLevel: 1,
  entity: null,
  externalSource: null,
  type: 'vocabulary',
  uuid: 'vocabulary-types',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/submission/vocabularies/types'
    },
    entries: {
      href: 'https://rest.api/rest/api/submission/vocabularies/types/entries'
    },
  }
});

const vocabularyExternal: any = Object.assign(new Vocabulary(), {
  id: 'author',
  name: 'author',
  scrollable: true,
  hierarchical: false,
  preloadLevel: 1,
  entity: 'test',
  externalSource: {
    'dc.contributor.author': 'authorExternalSource'
  },
  type: 'vocabulary',
  uuid: 'vocabulary-author',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/submission/vocabularies/types'
    },
    entries: {
      href: 'https://rest.api/rest/api/submission/vocabularies/types/entries'
    },
  }
});

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
          metadata: 'dc.contributor.author'
        }],
      } as FormFieldModel]
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
          metadata: 'local.contributor.affiliation'
        }]
      } as FormFieldModel]
    } as FormRowModel],
    submissionId,
    id: 'dc_contributor_author',
    label: 'Authors',
    isInlineGroup: false,
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
    hasSelectableMetadata: false
  } as DynamicRelationGroupModelConfig;

  FORM_GROUP_TEST_GROUP = new FormGroup({
    dc_contributor_author: new FormControl(),
  });

}

describe('DsDynamicRelationGroupComponent test suite', () => {
  let testComp: TestComponent;
  let groupComp: DsDynamicRelationGroupComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let groupFixture: ComponentFixture<DsDynamicRelationGroupComponent>;
  let debugElement: DebugElement;
  let modelValue: any;
  let html;
  let control1: FormControl;
  let model1: DsDynamicInputModel;
  let control2: FormControl;
  let model2: DsDynamicInputModel;

  const vocabularyService: any = new VocabularyServiceStub();

  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    init();

    /* TODO make sure these files use mocks instead of real services/components https://github.com/DSpace/dspace-angular/issues/281 */
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        StoreModule.forRoot({}, storeModuleConfig),
        TranslateModule.forRoot()
      ],
      declarations: [
        FormComponent,
        DsDynamicRelationGroupComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicRelationGroupComponent,
        DynamicFormValidationService,
        DynamicFormLayoutService,
        FormBuilderService,
        FormComponent,
        FormService,
        NgbModal,
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: Store, useClass: StoreMock },
        { provide: SubmissionService, useClass: SubmissionServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  describe('', () => {
    // synchronous beforeEach
    beforeEach(() => {
      spyOn(vocabularyService, 'findVocabularyById').and.returnValue(createSuccessfulRemoteDataObject$(vocabulary));
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

  describe('when vocabulary has no external source option', () => {
    beforeEach(() => {
      spyOn(vocabularyService, 'findVocabularyById').and.returnValue(createSuccessfulRemoteDataObject$(vocabulary));
    });

    describe('when init model value is empty', () => {
      beforeEach(inject([FormBuilderService], (service: FormBuilderService) => {

        groupFixture = TestBed.createComponent(DsDynamicRelationGroupComponent);
        debugElement = groupFixture.debugElement;
        groupComp = groupFixture.componentInstance; // FormComponent test instance
        groupComp.formId = 'testForm';
        groupComp.group = FORM_GROUP_TEST_GROUP;
        groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
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
        const testElement = debugElement.query(By.css('i.fa-share-square'));
        const formConfig = { rows: groupComp.model.formConfiguration } as SubmissionFormsModel;
        const formModel = service.modelFromConfiguration(submissionId, formConfig, groupComp.model.scopeUUID, {}, groupComp.model.submissionScope, groupComp.model.readOnly);
        const chips = new Chips([], 'value', 'dc.contributor.author');
        groupComp.formCollapsed.subscribe((value) => {
          expect(value).toEqual(false);
        });
        expect(groupComp.formModel.length).toEqual(formModel.length);
        expect(groupComp.chips.getChipsItems()).toEqual(chips.getChipsItems());
        expect(testElement).toBeNull();
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
        debugElement = groupFixture.debugElement;
        groupComp = groupFixture.componentInstance; // FormComponent test instance
        groupComp.formId = 'testForm';
        groupComp.group = FORM_GROUP_TEST_GROUP;
        groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
        modelValue = [{
          'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
          'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
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

  describe('when vocabulary has an external source option', () => {
    beforeEach(() => {
      spyOn(vocabularyService, 'findVocabularyById').and.returnValue(createSuccessfulRemoteDataObject$(vocabularyExternal));
      groupFixture = TestBed.createComponent(DsDynamicRelationGroupComponent);
      debugElement = groupFixture.debugElement;
      groupComp = groupFixture.componentInstance; // FormComponent test instance
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }];
      groupComp.model.value = modelValue;
    });

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    describe('and submission scope is workspaceitem', () => {
      beforeEach(() => {
        groupComp.model.submissionScope = SubmissionScopeType.WorkspaceItem;
        groupFixture.detectChanges();
        groupComp.onChipSelected(0);
        groupFixture.detectChanges();
      });

      it('should not display external source button', inject([FormBuilderService], (service: FormBuilderService) => {
        const testElement = debugElement.query(By.css('i.fa-share-square'));
        expect(testElement).toBeNull();
      }));
    });

    describe('and submission scope is workflowitem', () => {
      beforeEach(() => {
        groupComp.model.submissionScope = SubmissionScopeType.WorkflowItem;
        groupFixture.detectChanges();
        groupComp.onChipSelected(0);
        groupFixture.detectChanges();
      });

      it('should display external source button', inject([FormBuilderService], (service: FormBuilderService) => {
        const testElement = debugElement.query(By.css('i.fa-share-square'));
        expect(testElement).not.toBeNull();
        expect(testElement.parent.nativeElement.disabled).toBeFalsy();
      }));
    });
  });

  describe('when init model value has authority and submission scope is workflowitem', () => {
    beforeEach(() => {
      const entryValue = Object.assign(new VocabularyEntryDetail(), {
        value: 'test author',
        dispaly: 'test author',
        authority: 'authorityTest'
      });
      spyOn(vocabularyService, 'findVocabularyById').and.returnValue(createSuccessfulRemoteDataObject$(vocabularyExternal));
      spyOn(vocabularyService, 'findEntryDetailById').and.returnValue(createSuccessfulRemoteDataObject$(entryValue));
      groupFixture = TestBed.createComponent(DsDynamicRelationGroupComponent);
      debugElement = groupFixture.debugElement;
      groupComp = groupFixture.componentInstance; // FormComponent test instance
      groupComp.formId = 'testForm';
      groupComp.group = FORM_GROUP_TEST_GROUP;
      groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
      groupComp.model.submissionScope = SubmissionScopeType.WorkflowItem;
      modelValue = [{
        'dc.contributor.author': new FormFieldMetadataValueObject('test author', null, 'authorityTest'),
        'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation')
      }];
      groupComp.model.value = modelValue;
      groupFixture.detectChanges();
      groupComp.onChipSelected(0);
      groupFixture.detectChanges();

    });

    afterEach(() => {
      groupFixture.destroy();
      groupComp = null;
    });

    it('should display external source button', inject([FormBuilderService], (service: FormBuilderService) => {
      const testElement = debugElement.query(By.css('i.fa-share-square'));
      expect(testElement).not.toBeNull();
      expect(testElement.parent.nativeElement.disabled).toBeTruthy();
    }));

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

  model = new DynamicRelationGroupModel(this.groupModelConfig);

  showErrorMessages = false;

}
