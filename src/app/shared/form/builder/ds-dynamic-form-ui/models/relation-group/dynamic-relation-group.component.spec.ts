import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement,
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
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { FormRowModel } from '@dspace/core/config/models/config-submission-form.model';
import { APP_DATA_SERVICES_MAP } from '@dspace/core/data-services-map-type';
import { FormFieldModel } from '@dspace/core/shared/form/models/form-field.model';
import { FormFieldMetadataValueObject } from '@dspace/core/shared/form/models/form-field-metadata-value.model';
import { Vocabulary } from '@dspace/core/submission/vocabularies/models/vocabulary.model';
import { VocabularyService } from '@dspace/core/submission/vocabularies/vocabulary.service';
import { SubmissionServiceStub } from '@dspace/core/testing/submission-service.stub';
import { createTestComponent } from '@dspace/core/testing/utils.test';
import { VocabularyServiceStub } from '@dspace/core/testing/vocabulary-service.stub';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { XSRFService } from '@dspace/core/xsrf/xsrf.service';
import {
  NgbModal,
  NgbModule,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { DYNAMIC_FORM_CONTROL_MAP_FN } from '@ng-dynamic-forms/core';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent } from 'ng-mocks';
import { ChipsComponent } from 'src/app/shared/form/chips/chips.component';
import { ThemedLoadingComponent } from 'src/app/shared/loading/themed-loading.component';

import { environment } from '../../../../../../../environments/environment.test';
import { SubmissionService } from '../../../../../../submission/submission.service';
import { SubmissionObjectService } from '../../../../../../submission/submission-object.service';
import { Chips } from '../../../../chips/models/chips.model';
import { FormComponent } from '../../../../form.component';
import { FormService } from '../../../../form.service';
import { FormBuilderService } from '../../../form-builder.service';
import { dsDynamicFormControlMapFn } from '../../ds-dynamic-form-control-map-fn';
import { DsDynamicTypeBindRelationService } from '../../ds-dynamic-type-bind-relation.service';
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
      href: 'https://rest.api/rest/api/submission/vocabularies/types',
    },
    entries: {
      href: 'https://rest.api/rest/api/submission/vocabularies/types/entries',
    },
  },
});

const vocabularyExternal: any = Object.assign(new Vocabulary(), {
  id: 'author',
  name: 'author',
  scrollable: true,
  hierarchical: false,
  preloadLevel: 1,
  entity: 'test',
  externalSource: {
    'dc.contributor.author': 'authorExternalSource',
  },
  type: 'vocabulary',
  uuid: 'vocabulary-author',
  _links: {
    self: {
      href: 'https://rest.api/rest/api/submission/vocabularies/types',
    },
    entries: {
      href: 'https://rest.api/rest/api/submission/vocabularies/types/entries',
    },
  },
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
  let debugElement: DebugElement;
  let vocabularyServiceStub: any;
  let modelValue: any;
  let html;
  let submissionServiceStub: SubmissionServiceStub;
  const vocabularyService: any = new VocabularyServiceStub();

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
        MockComponent(ChipsComponent),
      ],
      providers: [
        ChangeDetectorRef,
        DsDynamicRelationGroupComponent,
        FormBuilderService,
        FormComponent,
        FormService,
        NgbModal,
        provideMockStore({ initialState }),
        { provide: VocabularyService, useValue: vocabularyService },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: VocabularyService, useValue: vocabularyServiceStub },
        { provide: DsDynamicTypeBindRelationService, useClass: DsDynamicTypeBindRelationService },
        { provide: SubmissionObjectService, useValue: {} },
        { provide: SubmissionService, useValue: {} },
        { provide: XSRFService, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: DYNAMIC_FORM_CONTROL_MAP_FN, useValue: dsDynamicFormControlMapFn },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DsDynamicRelationGroupComponent, {
        remove: {
          imports: [
            ThemedLoadingComponent,
          ],
        },
      })
      .compileComponents();

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
        submissionServiceStub = TestBed.inject(SubmissionService as any);
        groupComp.group = FORM_GROUP_TEST_GROUP;
        groupComp.model = new DynamicRelationGroupModel(FORM_GROUP_TEST_MODEL_CONFIG);
        groupFixture.detectChanges();

      }));

      afterEach(() => {
        groupFixture.destroy();
        groupComp = null;
      });

      it('should init component properly', inject([FormBuilderService], (service: FormBuilderService) => {
        const chips = new Chips([], 'value', 'dc.contributor.author');
        expect(groupComp.chips.getChipsItems()).toEqual(chips.getChipsItems());
      }));

      it('should save a new chips item', () => {
        modelValue = [{
          'dc.contributor.author': new FormFieldMetadataValueObject('test author'),
          'local.contributor.affiliation': new FormFieldMetadataValueObject('test affiliation'),
        }];

        const modalRef = groupComp.openModal();
        groupFixture.detectChanges();

        modalRef.componentInstance.add.emit(modelValue[0]);

        expect(groupComp.chips.getChipsItems()).toEqual(modelValue);

      });
    });

    describe('when init model value is not empty', () => {
      beforeEach(() => {

        groupFixture = TestBed.createComponent(DsDynamicRelationGroupComponent);
        debugElement = groupFixture.debugElement;
        groupComp = groupFixture.componentInstance; // FormComponent test instance
        submissionServiceStub = TestBed.inject(SubmissionService as any);
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
        const chips = new Chips(modelValue, 'value', 'dc.contributor.author');
        expect(groupComp.chips.getChipsItems()).toEqual(chips.getChipsItems());
      }));

      it('should modify existing chips item', inject([FormBuilderService], (service: FormBuilderService) => {
        const modalRef = groupComp.onChipSelected(0);
        groupFixture.detectChanges();

        expect(modalRef.componentInstance.editMode).toBe(true);
        expect(modalRef.componentInstance.itemIndex).toBe(0);
        expect(modalRef.componentInstance.item).toBe(groupComp.chips.getChipByIndex(0).item);

        spyOn(groupComp.chips, 'update').and.callThrough();

        const newItemValue = {
          'dc.contributor.author': 'test author modified',
          'local.contributor.affiliation': 'test affiliation',
        };
        modalRef.componentInstance.edit.emit(newItemValue);

        groupFixture.detectChanges();

        expect(groupComp.chips.update).toHaveBeenCalledWith(groupComp.selectedChipItem.id, newItemValue);

      }));

    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  imports: [
    NgbTooltip,
    TranslateModule,
  ],
})
class TestComponent {

  group = FORM_GROUP_TEST_GROUP;

  groupModelConfig = FORM_GROUP_TEST_MODEL_CONFIG;

  model = new DynamicRelationGroupModel(this.groupModelConfig);

  showErrorMessages = false;

}
