import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicCheckboxModel, DynamicFormControlEvent, DynamicFormControlEventType } from '@ng-dynamic-forms/core';

import { createTestComponent } from '../../../shared/testing/utils';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service-stub';
import { SubmissionService } from '../../submission.service';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service-stub';
import { SectionsService } from '../sections.service';
import { SectionsServiceStub } from '../../../shared/testing/sections-service-stub';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { getMockFormOperationsService } from '../../../shared/mocks/mock-form-operations-service';
import { getMockFormService } from '../../../shared/mocks/mock-form-service';
import { FormService } from '../../../shared/form/form.service';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsType } from '../sections-type';
import {
  mockLicenseParsedErrors,
  mockSubmissionCollectionId,
  mockSubmissionId
} from '../../../shared/mocks/mock-submission';
import { FormComponent } from '../../../shared/form/form.component';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SubmissionSectionLicenseComponent } from './section-license.component';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { Collection } from '../../../core/shared/collection.model';
import { RemoteData } from '../../../core/data/remote-data';
import { License } from '../../../core/shared/license.model';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';
import { cold } from 'jasmine-marbles';

function getMockSubmissionFormsConfigService(): SubmissionFormsConfigService {
  return jasmine.createSpyObj('FormOperationsService', {
    getConfigAll: jasmine.createSpy('getConfigAll'),
    getConfigByHref: jasmine.createSpy('getConfigByHref'),
    getConfigByName: jasmine.createSpy('getConfigByName'),
    getConfigBySearch: jasmine.createSpy('getConfigBySearch')
  });
}

function getMockCollectionDataService(): CollectionDataService {
  return jasmine.createSpyObj('CollectionDataService', {
    findById: jasmine.createSpy('findById'),
    findByHref: jasmine.createSpy('findByHref')
  });
}

const sectionObject: SectionDataObject = {
  config: 'https://dspace7.4science.it/or2018/api/config/submissionforms/license',
  mandatory: true,
  data: {
    url: null,
    acceptanceDate: null,
    granted: false
  },
  errors: [],
  header: 'submit.progressbar.describe.license',
  id: 'license',
  sectionType: SectionsType.License
};

const dynamicFormControlEvent: DynamicFormControlEvent = {
  $event: new Event('change'),
  context: null,
  control: null,
  group: null,
  model: null,
  type: DynamicFormControlEventType.Change
};

describe('SubmissionSectionLicenseComponent test suite', () => {

  let comp: SubmissionSectionLicenseComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionLicenseComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let sectionsServiceStub: SectionsServiceStub;
  let formService: any;
  let formOperationsService: any;
  let formBuilderService: any;
  let collectionDataService: any;

  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;
  const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionObject.id);
  const jsonPatchOpBuilder: any = jasmine.createSpyObj('jsonPatchOpBuilder', {
    add: jasmine.createSpy('add'),
    replace: jasmine.createSpy('replace'),
    remove: jasmine.createSpy('remove'),
  });

  const licenseText = 'License text';
  const mockCollection = Object.assign(new Collection(), {
    name: 'Community 1-Collection 1',
    id: collectionId,
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'Community 1-Collection 1'
      }],
    license: observableOf(new RemoteData(false, false, true,
      undefined, Object.assign(new License(), { text: licenseText })))
  });

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
        SubmissionSectionLicenseComponent,
        TestComponent
      ],
      providers: [
        { provide: CollectionDataService, useValue: getMockCollectionDataService() },
        { provide: SectionFormOperationsService, useValue: getMockFormOperationsService() },
        { provide: FormService, useValue: getMockFormService() },
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
        { provide: SubmissionFormsConfigService, useValue: getMockSubmissionFormsConfigService() },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: 'collectionIdProvider', useValue: collectionId },
        { provide: 'sectionDataProvider', useValue: sectionObject },
        { provide: 'submissionIdProvider', useValue: submissionId },
        ChangeDetectorRef,
        FormBuilderService,
        SubmissionSectionLicenseComponent
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
        <ds-submission-section-license></ds-submission-section-license>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionLicenseComponent', inject([SubmissionSectionLicenseComponent], (app: SubmissionSectionLicenseComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionLicenseComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.get(SubmissionService);
      sectionsServiceStub = TestBed.get(SectionsService);
      formService = TestBed.get(FormService);
      formBuilderService = TestBed.get(FormBuilderService);
      formOperationsService = TestBed.get(SectionFormOperationsService);
      collectionDataService = TestBed.get(CollectionDataService);

      compAsAny.pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionObject.id);
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should init section properly', () => {
      collectionDataService.findById.and.returnValue(observableOf(new RemoteData(false, false, true,
        undefined, mockCollection)));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));
      spyOn(compAsAny, 'getSectionStatus');

      comp.onSectionInit();

      const model = formBuilderService.findById('granted', comp.formModel);

      expect(compAsAny.subs.length).toBe(2);
      expect(comp.formModel).toBeDefined();
      expect(model.value).toBeFalsy();
      expect(comp.licenseText$).toBeObservable(cold('(ab|)', {
        a: '',
        b: licenseText
      }));
    });

    it('should set checkbox value to true', () => {
      comp.sectionData.data = {
        url: 'url',
        acceptanceDate: Date.now(),
        granted: true
      } as any;

      collectionDataService.findById.and.returnValue(observableOf(new RemoteData(false, false, true,
        undefined, mockCollection)));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));
      spyOn(compAsAny, 'getSectionStatus');

      comp.onSectionInit();

      const model = formBuilderService.findById('granted', comp.formModel);

      expect(compAsAny.subs.length).toBe(2);
      expect(comp.formModel).toBeDefined();
      expect(model.value).toBeTruthy();
      expect(comp.licenseText$).toBeObservable(cold('(ab|)', {
        a: '',
        b: licenseText
      }));
    });

    it('should set section errors properly', () => {
      collectionDataService.findById.and.returnValue(observableOf(new RemoteData(false, false, true,
        undefined, mockCollection)));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf(mockLicenseParsedErrors.license));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));

      comp.onSectionInit();
      const expectedErrors = mockLicenseParsedErrors.license;

      expect(sectionsServiceStub.checkSectionErrors).toHaveBeenCalled();
      expect(comp.sectionData.errors).toEqual(expectedErrors);

    });

    it('should remove any section\'s errors when checkbox is selected', () => {
      comp.sectionData.data = {
        url: 'url',
        acceptanceDate: Date.now(),
        granted: true
      } as any;

      collectionDataService.findById.and.returnValue(observableOf(new RemoteData(false, false, true,
        undefined, mockCollection)));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf(mockLicenseParsedErrors.license));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));

      comp.onSectionInit();

      expect(sectionsServiceStub.dispatchRemoveSectionErrors).toHaveBeenCalled();

    });

    it('should have status true when checkbox is selected', () => {

      collectionDataService.findById.and.returnValue(observableOf(new RemoteData(false, false, true,
        undefined, mockCollection)));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));

      fixture.detectChanges();
      const model = formBuilderService.findById('granted', comp.formModel);

      (model as DynamicCheckboxModel).valueUpdates.next(true);

      compAsAny.getSectionStatus().subscribe((status) => {
        expect(status).toBeTruthy();
      });
    });

    it('should have status false when checkbox is not selected', () => {

      collectionDataService.findById.and.returnValue(observableOf(new RemoteData(false, false, true,
        undefined, mockCollection)));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));

      fixture.detectChanges();
      const model = formBuilderService.findById('granted', comp.formModel);

      compAsAny.getSectionStatus().subscribe((status) => {
        expect(status).toBeFalsy();
      });

      (model as DynamicCheckboxModel).valueUpdates.next(false);
    });

    it('should dispatch a json-path add operation when checkbox is selected', () => {
      const event = dynamicFormControlEvent;
      formOperationsService.getFieldPathSegmentedFromChangeEvent.and.returnValue('granted');
      formOperationsService.getFieldValueFromChangeEvent.and.returnValue(new FormFieldMetadataValueObject(true));

      comp.onChange(event);

      expect(jsonPatchOpBuilder.add).toHaveBeenCalledWith(pathCombiner.getPath('granted'), 'true', false, true);
      expect(sectionsServiceStub.dispatchRemoveSectionErrors).toHaveBeenCalled();
    });

    it('should dispatch a json-path remove operation when checkbox is not selected', () => {
      const event = dynamicFormControlEvent;
      formOperationsService.getFieldPathSegmentedFromChangeEvent.and.returnValue('granted');
      formOperationsService.getFieldValueFromChangeEvent.and.returnValue(null);

      comp.onChange(event);

      expect(jsonPatchOpBuilder.remove).toHaveBeenCalledWith(pathCombiner.getPath('granted'));
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
