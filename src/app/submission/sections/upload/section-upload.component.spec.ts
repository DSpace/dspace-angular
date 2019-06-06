import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { of as observableOf } from 'rxjs';

import { createTestComponent } from '../../../shared/testing/utils';
import { SubmissionService } from '../../submission.service';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service-stub';
import { SectionsService } from '../sections.service';
import { SectionsServiceStub } from '../../../shared/testing/sections-service-stub';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsType } from '../sections-type';
import {
  mockGroup,
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockSubmissionState,
  mockUploadConfigResponse,
  mockUploadFiles
} from '../../../shared/mocks/mock-submission';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SubmissionUploadsConfigService } from '../../../core/config/submission-uploads-config.service';
import { SectionUploadService } from './section-upload.service';
import { SubmissionSectionUploadComponent } from './section-upload.component';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { GroupEpersonService } from '../../../core/eperson/group-eperson.service';
import { cold, hot } from 'jasmine-marbles';
import { Collection } from '../../../core/shared/collection.model';
import { ResourcePolicy } from '../../../core/shared/resource-policy.model';
import { RemoteData } from '../../../core/data/remote-data';
import { ConfigData } from '../../../core/config/config-data';
import { PageInfo } from '../../../core/shared/page-info.model';
import { Group } from '../../../core/eperson/models/group.model';
import { getMockSectionUploadService } from '../../../shared/mocks/mock-section-upload.service';

function getMockSubmissionUploadsConfigService(): SubmissionFormsConfigService {
  return jasmine.createSpyObj('SubmissionUploadsConfigService', {
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

function getMockGroupEpersonService(): GroupEpersonService {
  return jasmine.createSpyObj('GroupEpersonService', {
    findById: jasmine.createSpy('findById'),

  });
}

const sectionObject: SectionDataObject = {
  config: 'https://dspace7.4science.it/or2018/api/config/submissionforms/upload',
  mandatory: true,
  data: {
    files: []
  },
  errors: [],
  header: 'submit.progressbar.describe.upload',
  id: 'upload',
  sectionType: SectionsType.Upload
};

describe('SubmissionSectionUploadComponent test suite', () => {

  let comp: SubmissionSectionUploadComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionUploadComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let sectionsServiceStub: SectionsServiceStub;
  let collectionDataService: any;
  let groupService: any;
  let uploadsConfigService: any;
  let bitstreamService: any;

  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;
  const submissionState = Object.assign({}, mockSubmissionState[mockSubmissionId]);
  const mockCollection = Object.assign(new Collection(), {
    name: 'Community 1-Collection 1',
    id: collectionId,
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'Community 1-Collection 1'
      }],
    _links: {
      defaultAccessConditions: collectionId + '/defaultAccessConditions'
    }
  });
  const mockDefaultAccessCondition = Object.assign(new ResourcePolicy(), {
    name: null,
    groupUUID: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
    id: 20,
    uuid: 'resource-policy-20'
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        SubmissionSectionUploadComponent,
        TestComponent
      ],
      providers: [
        { provide: CollectionDataService, useValue: getMockCollectionDataService() },
        { provide: GroupEpersonService, useValue: getMockGroupEpersonService() },
        { provide: SubmissionUploadsConfigService, useValue: getMockSubmissionUploadsConfigService() },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: SectionUploadService, useValue: getMockSectionUploadService() },
        { provide: 'sectionDataProvider', useValue: sectionObject },
        { provide: 'submissionIdProvider', useValue: submissionId },
        ChangeDetectorRef,
        SubmissionSectionUploadComponent
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
        <ds-submission-section-upload></ds-submission-section-upload>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionUploadComponent', inject([SubmissionSectionUploadComponent], (app: SubmissionSectionUploadComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionUploadComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.get(SubmissionService);
      sectionsServiceStub = TestBed.get(SectionsService);
      collectionDataService = TestBed.get(CollectionDataService);
      groupService = TestBed.get(GroupEpersonService);
      uploadsConfigService = TestBed.get(SubmissionUploadsConfigService);
      bitstreamService = TestBed.get(SectionUploadService);
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should init component properly', () => {

      submissionServiceStub.getSubmissionObject.and.returnValue(observableOf(submissionState));

      collectionDataService.findById.and.returnValue(observableOf(
        new RemoteData(false, false, true,
        undefined, mockCollection)));

      collectionDataService.findByHref.and.returnValue(observableOf(
        new RemoteData(false, false, true,
          undefined, mockDefaultAccessCondition)
      ));

      uploadsConfigService.getConfigByHref.and.returnValue(observableOf(
        new ConfigData(new PageInfo(), mockUploadConfigResponse as any)
      ));

      groupService.findById.and.returnValues(
        observableOf(new RemoteData(false, false, true,
          undefined, Object.assign(new Group(), mockGroup))),
        observableOf(new RemoteData(false, false, true,
          undefined, Object.assign(new Group(), mockGroup)))
      );

      bitstreamService.getUploadedFileList.and.returnValue(observableOf([]));

      comp.onSectionInit();

      const expectedGroupsMap =  new Map([
        [mockUploadConfigResponse.accessConditionOptions[1].name, [mockGroup as any]],
        [mockUploadConfigResponse.accessConditionOptions[2].name, [mockGroup as any]],
      ]);

      expect(comp.collectionId).toBe(collectionId);
      expect(comp.collectionName).toBe(mockCollection.name);
      expect(comp.availableAccessConditionOptions.length).toBe(4);
      expect(comp.availableAccessConditionOptions).toEqual(mockUploadConfigResponse.accessConditionOptions as any);
      expect(compAsAny.subs.length).toBe(2);
      expect(compAsAny.availableGroups.size).toBe(2);
      expect(compAsAny.availableGroups).toEqual(expectedGroupsMap);
      expect(compAsAny.fileList).toEqual([]);
      expect(compAsAny.fileIndexes).toEqual([]);
      expect(compAsAny.fileNames).toEqual([]);

    });

    it('should init file list properly', () => {

      submissionServiceStub.getSubmissionObject.and.returnValue(observableOf(submissionState));

      collectionDataService.findById.and.returnValue(observableOf(
        new RemoteData(false, false, true,
          undefined, mockCollection)));

      collectionDataService.findByHref.and.returnValue(observableOf(
        new RemoteData(false, false, true,
          undefined, mockDefaultAccessCondition)
      ));

      uploadsConfigService.getConfigByHref.and.returnValue(observableOf(
        new ConfigData(new PageInfo(), mockUploadConfigResponse as any)
      ));

      groupService.findById.and.returnValues(
        observableOf(new RemoteData(false, false, true,
          undefined, Object.assign(new Group(), mockGroup))),
        observableOf(new RemoteData(false, false, true,
          undefined, Object.assign(new Group(), mockGroup)))
      );

      bitstreamService.getUploadedFileList.and.returnValue(observableOf(mockUploadFiles));

      comp.onSectionInit();

      const expectedGroupsMap =  new Map([
        [mockUploadConfigResponse.accessConditionOptions[1].name, [mockGroup as any]],
        [mockUploadConfigResponse.accessConditionOptions[2].name, [mockGroup as any]],
      ]);

      expect(comp.collectionId).toBe(collectionId);
      expect(comp.collectionName).toBe(mockCollection.name);
      expect(comp.availableAccessConditionOptions.length).toBe(4);
      expect(comp.availableAccessConditionOptions).toEqual(mockUploadConfigResponse.accessConditionOptions as any);
      expect(compAsAny.subs.length).toBe(2);
      expect(compAsAny.availableGroups.size).toBe(2);
      expect(compAsAny.availableGroups).toEqual(expectedGroupsMap);
      expect(compAsAny.fileList).toEqual(mockUploadFiles);
      expect(compAsAny.fileIndexes).toEqual(['123456-test-upload']);
      expect(compAsAny.fileNames).toEqual(['123456-test-upload.jpg']);

    });

    it('should the properly section status', () => {
      bitstreamService.getUploadedFileList.and.returnValue(hot('-a-b', {
        a: [],
        b: mockUploadFiles
      }));

      expect(compAsAny.getSectionStatus()).toBeObservable(cold('-c-d', {
        c: false,
        d: true
      }));
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
