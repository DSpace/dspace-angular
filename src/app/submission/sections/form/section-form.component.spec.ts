import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { createTestComponent } from '../../../shared/testing/utils.test';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { SubmissionService } from '../../submission.service';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { getMockTranslateService } from '../../../shared/mocks/translate.service.mock';
import { SectionsService } from '../sections.service';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SubmissionSectionformComponent } from './section-form.component';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { getMockFormOperationsService } from '../../../shared/mocks/form-operations-service.mock';
import { SectionFormOperationsService } from './section-form-operations.service';
import { getMockFormService } from '../../../shared/mocks/form-service.mock';
import { FormService } from '../../../shared/form/form.service';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsType } from '../sections-type';
import {
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockUploadResponse1ParsedErrors
} from '../../../shared/mocks/submission.mock';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from '../../../shared/form/form.component';
import { FormFieldModel } from '../../../shared/form/builder/models/form-field.model';
import { ConfigData } from '../../../core/config/config-data';
import { PageInfo } from '../../../core/shared/page-info.model';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { DynamicRowGroupModel } from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-row-group-model';
import { DsDynamicInputModel } from '../../../shared/form/builder/ds-dynamic-form-ui/models/ds-dynamic-input.model';
import { SubmissionSectionError } from '../../objects/submission-objects.reducer';
import { DynamicFormControlEvent, DynamicFormControlEventType } from '@ng-dynamic-forms/core';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { FormRowModel } from '../../../core/config/models/config-submission-form.model';
import { RemoteData } from '../../../core/data/remote-data';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { SubmissionObjectDataService } from '../../../core/submission/submission-object-data.service';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RequestService } from '../../../core/data/request.service';

function getMockSubmissionFormsConfigService(): SubmissionFormsConfigService {
  return jasmine.createSpyObj('FormOperationsService', {
    getConfigAll: jasmine.createSpy('getConfigAll'),
    getConfigByHref: jasmine.createSpy('getConfigByHref'),
    getConfigByName: jasmine.createSpy('getConfigByName'),
    getConfigBySearch: jasmine.createSpy('getConfigBySearch')
  });
}

const sectionObject: SectionDataObject = {
  config: 'https://dspace7.4science.it/or2018/api/config/submissionforms/traditionalpageone',
  mandatory: true,
  data: {},
  errors: [],
  header: 'submit.progressbar.describe.stepone',
  id: 'traditionalpageone',
  sectionType: SectionsType.SubmissionForm
};

const testFormConfiguration = {
  name: 'testFormConfiguration',
  rows: [
    {
      fields: [
        {
          input: {
            type: 'onebox'
          },
          label: 'Title',
          mandatory: 'true',
          repeatable: false,
          hints: ' Enter Title.',
          selectableMetadata: [
            {
              metadata: 'dc.title'
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel,
    {
      fields: [
        {
          input: {
            type: 'onebox'
          },
          label: 'Author',
          mandatory: 'false',
          repeatable: false,
          hints: ' Enter Author.',
          selectableMetadata: [
            {
              metadata: 'dc.contributor'
            }
          ],
          languageCodes: []
        } as FormFieldModel
      ]
    } as FormRowModel,
  ],
  type: 'submissionform',
  _links: {
    self: {
      href: 'testFormConfiguration.url'
    }
  }
} as any;

const testFormModel = [
  new DynamicRowGroupModel({
    id: 'df-row-group-config-1',
    group: [new DsDynamicInputModel({ id: 'dc.title', metadataFields: [], repeatable: false, submissionId: '1234', hasSelectableMetadata: false })],
  }),
  new DynamicRowGroupModel({
    id: 'df-row-group-config-2',
    group: [new DsDynamicInputModel({ id: 'dc.contributor', metadataFields: [], repeatable: false, submissionId: '1234', hasSelectableMetadata: false })],
  })
];

const dynamicFormControlEvent: DynamicFormControlEvent = {
  $event: new Event('change'),
  context: null,
  control: null,
  group: testFormModel[0] as any,
  model: testFormModel[0].group[0],
  type: DynamicFormControlEventType.Change
};

describe('SubmissionSectionformComponent test suite', () => {

  let comp: SubmissionSectionformComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionformComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let sectionsServiceStub: SectionsServiceStub;
  let notificationsServiceStub: NotificationsServiceStub;
  let formService: any;
  let formConfigService: any;
  let formOperationsService: any;
  let formBuilderService: any;
  let translateService: any;

  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;
  const parsedSectionErrors: any = mockUploadResponse1ParsedErrors.traditionalpageone;
  const formConfigData = new ConfigData(new PageInfo(), testFormConfiguration);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        FormComponent,
        SubmissionSectionformComponent,
        TestComponent
      ],
      providers: [
        { provide: FormBuilderService, useValue: getMockFormBuilderService() },
        { provide: SectionFormOperationsService, useValue: getMockFormOperationsService() },
        { provide: FormService, useValue: getMockFormService() },
        { provide: SubmissionFormsConfigService, useValue: getMockSubmissionFormsConfigService() },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: TranslateService, useValue: getMockTranslateService() },
        { provide: ObjectCacheService, useValue: { remove: () => {/*do nothing*/}, hasBySelfLinkObservable: () => observableOf(false) } },
        { provide: RequestService, useValue: { removeByHrefSubstring: () => {/*do nothing*/}, hasByHrefObservable: () => observableOf(false) } },
        { provide: 'collectionIdProvider', useValue: collectionId },
        { provide: 'sectionDataProvider', useValue: sectionObject },
        { provide: 'submissionIdProvider', useValue: submissionId },
        { provide: SubmissionObjectDataService, useValue: { getHrefByID: () => observableOf('testUrl'), findById: () => observableOf(new RemoteData(false, false, true, null, new WorkspaceItem())) } },
        ChangeDetectorRef,
        SubmissionSectionformComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-submission-section-form></ds-submission-section-form>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionformComponent', inject([SubmissionSectionformComponent], (app: SubmissionSectionformComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionformComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.get(SubmissionService);
      sectionsServiceStub = TestBed.get(SectionsService);
      formService = TestBed.get(FormService);
      formConfigService = TestBed.get(SubmissionFormsConfigService);
      formBuilderService = TestBed.get(FormBuilderService);
      formOperationsService = TestBed.get(SectionFormOperationsService);
      translateService = TestBed.get(TranslateService);
      notificationsServiceStub = TestBed.get(NotificationsService);

      translateService.get.and.returnValue(observableOf('test'));
      compAsAny.pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionObject.id);
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should init section properly', () => {
      const sectionData = {};
      formService.isValid.and.returnValue(observableOf(true));
      formConfigService.getConfigByHref.and.returnValue(observableOf(formConfigData));
      sectionsServiceStub.getSectionData.and.returnValue(observableOf(sectionData));
      spyOn(comp, 'initForm');
      spyOn(comp, 'subscriptions');

      comp.onSectionInit();
      fixture.detectChanges();

      expect(compAsAny.formConfig).toEqual(formConfigData.payload);
      expect(comp.sectionData.errors).toEqual([]);
      expect(comp.sectionData.data).toEqual(sectionData);
      expect(comp.isLoading).toBeFalsy();
      expect(comp.initForm).toHaveBeenCalledWith(sectionData);
      expect(comp.subscriptions).toHaveBeenCalled();
    });

    it('should init form model properly', () => {
      formBuilderService.modelFromConfiguration.and.returnValue(testFormModel);
      const sectionData = {};

      comp.initForm(sectionData);

      expect(comp.formModel).toEqual(testFormModel);

    });

    it('should set a section Error when init form model fails', () => {
      formBuilderService.modelFromConfiguration.and.throwError('test');
      translateService.instant.and.returnValue('test');
      const sectionData = {};
      const sectionError: SubmissionSectionError = {
        message: 'test' + 'Error: test',
        path: '/sections/' + sectionObject.id
      };

      comp.initForm(sectionData);

      expect(comp.formModel).toBeUndefined();
      expect(sectionsServiceStub.setSectionError).toHaveBeenCalledWith(submissionId, sectionObject.id, sectionError);

    });

    it('should return true when has Metadata Enrichment', () => {
      const newSectionData = {
        'dc.title': [new FormFieldMetadataValueObject('test')]
      };
      compAsAny.formData = {};

      expect(comp.hasMetadataEnrichment(newSectionData)).toBeTruthy();
    });

    it('should return false when has not Metadata Enrichment', () => {
      const newSectionData = {
        'dc.title': [new FormFieldMetadataValueObject('test')]
      };
      compAsAny.formData = newSectionData;

      expect(comp.hasMetadataEnrichment(newSectionData)).toBeFalsy();
    });

    it('should update form properly', () => {
      spyOn(comp, 'initForm');
      spyOn(comp, 'checksForErrors');
      const sectionData: any = {
        'dc.title': [new FormFieldMetadataValueObject('test')]
      };
      const sectionError = [];
      comp.sectionData.data = {};
      comp.sectionData.errors = [];
      compAsAny.formData = {};

      comp.updateForm(sectionData, sectionError);

      expect(comp.isUpdating).toBeFalsy();
      expect(comp.initForm).toHaveBeenCalled();
      expect(comp.checksForErrors).toHaveBeenCalled();
      expect(comp.sectionData.data).toEqual(sectionData);

    });

    it('should update form error properly', () => {
      spyOn(comp, 'initForm');
      spyOn(comp, 'checksForErrors');
      const sectionData: any = {
        'dc.title': [new FormFieldMetadataValueObject('test')]
      };
      comp.sectionData.data = {};
      comp.sectionData.errors = [];
      compAsAny.formData = sectionData;

      comp.updateForm(sectionData, parsedSectionErrors);

      expect(comp.initForm).toHaveBeenCalled();
      expect(comp.checksForErrors).toHaveBeenCalled();
      expect(comp.sectionData.data).toEqual(sectionData);
    });

    it('should update form error properly', () => {
      spyOn(comp, 'initForm');
      spyOn(comp, 'checksForErrors');
      const sectionData: any = {};

      comp.updateForm(sectionData, parsedSectionErrors);

      expect(comp.initForm).not.toHaveBeenCalled();
      expect(comp.checksForErrors).toHaveBeenCalled();

    });

    it('should check for error', () => {
      comp.isUpdating = false;
      comp.formId = 'test';
      comp.sectionData.errors = [];

      comp.checksForErrors(parsedSectionErrors);

      expect(sectionsServiceStub.checkSectionErrors).toHaveBeenCalledWith(
        submissionId,
        sectionObject.id,
        'test',
        parsedSectionErrors,
        []
      );
      expect(comp.sectionData.errors).toEqual(parsedSectionErrors);
    });

    it('should subscribe to state properly', () => {
      spyOn(comp, 'updateForm');
      const formData = {
        'dc.title': [new FormFieldMetadataValueObject('test')]
      };
      const sectionData: any = {
        'dc.title': [new FormFieldMetadataValueObject('test')]
      };
      const sectionState = {
        data: sectionData,
        errors: parsedSectionErrors
      };

      formService.getFormData.and.returnValue(observableOf(formData));
      sectionsServiceStub.getSectionState.and.returnValue(observableOf(sectionState));

      comp.subscriptions();

      expect(compAsAny.subs.length).toBe(2);
      expect(compAsAny.formData).toEqual(formData);
      expect(comp.updateForm).toHaveBeenCalledWith(sectionState.data, sectionState.errors);

    });

    it('should call dispatchOperationsFromEvent on form change', () => {
      spyOn(comp, 'hasStoredValue').and.returnValue(false);
      formOperationsService.getFieldPathSegmentedFromChangeEvent.and.returnValue('path');
      formOperationsService.getFieldValueFromChangeEvent.and.returnValue('test');

      comp.onChange(dynamicFormControlEvent);

      expect(formOperationsService.dispatchOperationsFromEvent).toHaveBeenCalled();
      expect(formOperationsService.getFieldPathSegmentedFromChangeEvent).toHaveBeenCalledWith(dynamicFormControlEvent);
      expect(formOperationsService.getFieldValueFromChangeEvent).toHaveBeenCalledWith(dynamicFormControlEvent);
      expect(submissionServiceStub.dispatchSave).not.toHaveBeenCalledWith(submissionId);

    });

    it('should call dispatchSave on form change when metadata is in submission autosave configuration', () => {
      spyOn(comp, 'hasStoredValue').and.returnValue(false);
      formOperationsService.getFieldPathSegmentedFromChangeEvent.and.returnValue('dc.title');
      formOperationsService.getFieldValueFromChangeEvent.and.returnValue('test');

      comp.onChange(dynamicFormControlEvent);

      expect(formOperationsService.dispatchOperationsFromEvent).toHaveBeenCalled();
      expect(formOperationsService.getFieldPathSegmentedFromChangeEvent).toHaveBeenCalledWith(dynamicFormControlEvent);
      expect(formOperationsService.getFieldValueFromChangeEvent).toHaveBeenCalledWith(dynamicFormControlEvent);
      expect(submissionServiceStub.dispatchSave).toHaveBeenCalledWith(submissionId);

    });

    it('should set previousValue on form focus event', () => {
      formBuilderService.hasMappedGroupValue.and.returnValue(false);
      formOperationsService.getFieldValueFromChangeEvent.and.returnValue('test');

      comp.onFocus(dynamicFormControlEvent);

      expect(compAsAny.previousValue.path).toEqual(['test', 'path']);
      expect(compAsAny.previousValue.value).toBe('test');

      formBuilderService.hasMappedGroupValue.and.returnValue(true);
      formOperationsService.getQualdropValueMap.and.returnValue('qualdrop');

      comp.onFocus(dynamicFormControlEvent);
      expect(compAsAny.previousValue.path).toEqual(['test', 'path']);
      expect(compAsAny.previousValue.value).toBe('qualdrop');

      formBuilderService.hasMappedGroupValue.and.returnValue(false);
      formOperationsService.getFieldValueFromChangeEvent.and.returnValue(new FormFieldMetadataValueObject('form value test'));

      comp.onFocus(dynamicFormControlEvent);
      expect(compAsAny.previousValue.path).toEqual(['test', 'path']);
      expect(compAsAny.previousValue.value).toEqual(new FormFieldMetadataValueObject('form value test'));
    });

    it('should call dispatchOperationsFromEvent on form remove event', () => {
      spyOn(comp, 'hasStoredValue').and.returnValue(false);

      comp.onRemove(dynamicFormControlEvent);

      expect(formOperationsService.dispatchOperationsFromEvent).toHaveBeenCalled();

    });

    it('should check if has stored value in the section state', () => {
      comp.sectionData.data = {
        'dc.title': [new FormFieldMetadataValueObject('test')]
      } as any;

      expect(comp.hasStoredValue('dc.title', 0)).toBeTruthy();
      expect(comp.hasStoredValue('dc.title', 1)).toBeFalsy();
      expect(comp.hasStoredValue('title', 0)).toBeFalsy();

    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

}
