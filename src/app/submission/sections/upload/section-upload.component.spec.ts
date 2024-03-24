import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { APP_DATA_SERVICES_MAP } from '../../../../config/app-config.interface';
import { SubmissionUploadsModel } from '../../../core/config/models/config-submission-uploads.model';
import { SubmissionFormsConfigDataService } from '../../../core/config/submission-forms-config-data.service';
import { SubmissionUploadsConfigDataService } from '../../../core/config/submission-uploads-config-data.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { Group } from '../../../core/eperson/models/group.model';
import { ResourcePolicy } from '../../../core/resource-policy/models/resource-policy.model';
import { ResourcePolicyDataService } from '../../../core/resource-policy/resource-policy-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { getMockSectionUploadService } from '../../../shared/mocks/section-upload.service.mock';
import {
  mockGroup,
  mockSubmissionCollectionId,
  mockSubmissionId,
  mockSubmissionState,
  mockUploadConfigResponse,
  mockUploadConfigResponseNotRequired,
  mockUploadFiles,
  mockUploadFilesData,
} from '../../../shared/mocks/submission.mock';
import { getMockThemeService } from '../../../shared/mocks/theme-service.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { ThemeService } from '../../../shared/theme-support/theme.service';
import { SubmissionObjectState } from '../../objects/submission-objects.reducer';
import { SubmissionService } from '../../submission.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { SectionsType } from '../sections-type';
import { SubmissionSectionUploadComponent } from './section-upload.component';
import { SectionUploadService } from './section-upload.service';

function getMockSubmissionUploadsConfigService(): SubmissionFormsConfigDataService {
  return jasmine.createSpyObj('SubmissionUploadsConfigService', {
    getConfigAll: jasmine.createSpy('getConfigAll'),
    getConfigByHref: jasmine.createSpy('getConfigByHref'),
    getConfigByName: jasmine.createSpy('getConfigByName'),
    getConfigBySearch: jasmine.createSpy('getConfigBySearch'),
    findByHref: jasmine.createSpy('findByHref'),
  });
}

function getMockCollectionDataService(): CollectionDataService {
  return jasmine.createSpyObj('CollectionDataService', {
    findById: jasmine.createSpy('findById'),
  });
}

function getMockGroupEpersonService(): GroupDataService {
  return jasmine.createSpyObj('GroupDataService', {
    findById: jasmine.createSpy('findById'),

  });
}

function getMockResourcePolicyService(): ResourcePolicyDataService {
  return jasmine.createSpyObj('ResourcePolicyService', {
    findByHref: jasmine.createSpy('findByHref'),
  });
}

let sectionObject: SectionDataObject;

describe('SubmissionSectionUploadComponent test suite', () => {

  let comp: SubmissionSectionUploadComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionUploadComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let sectionsServiceStub: SectionsServiceStub;
  let collectionDataService: any;
  let groupService: any;
  let resourcePolicyService: any;
  let uploadsConfigService: any;
  let bitstreamService: any;

  let submissionId: string;
  let collectionId: string;
  let submissionState: SubmissionObjectState;
  let mockCollection: Collection;
  let mockDefaultAccessCondition: ResourcePolicy;
  let prepareComp;

  beforeEach(waitForAsync(() => {
    sectionObject = {
      config: 'https://dspace7.4science.it/or2018/api/config/submissionforms/upload',
      mandatory: true,
      data: {
        files: [],
      },
      errorsToShow: [],
      serverValidationErrors: [],
      header: 'submit.progressbar.describe.upload',
      id: 'upload-id',
      sectionType: SectionsType.Upload,
    };
    submissionId = mockSubmissionId;
    collectionId = mockSubmissionCollectionId;
    submissionState = Object.assign({}, mockSubmissionState[mockSubmissionId]) as any;
    mockCollection = Object.assign(new Collection(), {
      name: 'Community 1-Collection 1',
      id: collectionId,
      metadata: [
        {
          key: 'dc.title',
          language: 'en_US',
          value: 'Community 1-Collection 1',
        }],
      _links: {
        defaultAccessConditions: collectionId + '/defaultAccessConditions',
      },
    });

    mockDefaultAccessCondition = Object.assign(new ResourcePolicy(), {
      name: null,
      groupUUID: '11cc35e5-a11d-4b64-b5b9-0052a5d15509',
      id: 20,
      uuid: 'resource-policy-20',
    });
    uploadsConfigService = getMockSubmissionUploadsConfigService();

    submissionServiceStub = new SubmissionServiceStub();

    collectionDataService = getMockCollectionDataService();

    resourcePolicyService = getMockResourcePolicyService();

    groupService = getMockGroupEpersonService();

    bitstreamService = getMockSectionUploadService();

    uploadsConfigService = getMockSubmissionUploadsConfigService();

    prepareComp = () => {
      submissionServiceStub.getSubmissionObject.and.returnValue(observableOf(submissionState));

      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new Collection(), mockCollection, {
        defaultAccessConditions: createSuccessfulRemoteDataObject$(mockDefaultAccessCondition),
      })));

      resourcePolicyService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(mockDefaultAccessCondition));

      uploadsConfigService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(
        buildPaginatedList(new PageInfo(), [mockUploadConfigResponse as any])),
      );

      groupService.findById.and.returnValues(
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
      );

      bitstreamService.getUploadedFileList.and.returnValue(observableOf([]));
      bitstreamService.getUploadedFilesData.and.returnValue(observableOf({ primary: null, files: [] }));
    };

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot(),
        SubmissionSectionUploadComponent,
        TestComponent,
      ],
      providers: [
        { provide: CollectionDataService, useValue: collectionDataService },
        { provide: GroupDataService, useValue: groupService },
        { provide: ResourcePolicyDataService, useValue: resourcePolicyService },
        { provide: SubmissionUploadsConfigDataService, useValue: uploadsConfigService },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useValue: submissionServiceStub },
        { provide: SectionUploadService, useValue: bitstreamService },
        { provide: 'sectionDataProvider', useValue: sectionObject },
        { provide: 'submissionIdProvider', useValue: submissionId },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        ChangeDetectorRef,
        SubmissionSectionUploadComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SubmissionSectionUploadComponent, {
        remove: {
          imports: [AlertComponent],
        },
      })
      .compileComponents().then();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      prepareComp();

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
      sectionsServiceStub = TestBed.inject(SectionsService as any);
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('should init component properly', () => {
      bitstreamService.getUploadedFilesData.and.returnValue(observableOf({ primary: null, files: [] }));
      submissionServiceStub.getSubmissionObject.and.returnValue(observableOf(submissionState));

      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new Collection(), mockCollection, {
        defaultAccessConditions: createSuccessfulRemoteDataObject$(mockDefaultAccessCondition),
      })));

      resourcePolicyService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(mockDefaultAccessCondition));

      uploadsConfigService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new SubmissionUploadsModel(), mockUploadConfigResponse)));

      groupService.findById.and.returnValues(
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
      );

      comp.onSectionInit();

      expect(comp.collectionId).toBe(collectionId);
      expect(comp.collectionName).toBe(mockCollection.name);
      expect(comp.availableAccessConditionOptions.length).toBe(4);
      expect(comp.availableAccessConditionOptions).toEqual(mockUploadConfigResponse.accessConditionOptions as any);
      expect(comp.required$.getValue()).toBe(true);
      expect(compAsAny.subs.length).toBe(2);
      expect(compAsAny.fileList).toEqual([]);
      expect(compAsAny.fileNames).toEqual([]);
      expect(compAsAny.primaryBitstreamUUID).toEqual(null);
    });

    it('should init file list properly', () => {
      bitstreamService.getUploadedFilesData.and.returnValue(observableOf({ primary: null, files: [] }));

      submissionServiceStub.getSubmissionObject.and.returnValue(observableOf(submissionState));

      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));

      resourcePolicyService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(mockDefaultAccessCondition));

      uploadsConfigService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new SubmissionUploadsModel(), mockUploadConfigResponse)));

      groupService.findById.and.returnValues(
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
      );

      bitstreamService.getUploadedFilesData.and.returnValue(observableOf(mockUploadFilesData));

      comp.onSectionInit();

      const expectedGroupsMap = new Map([
        [mockUploadConfigResponse.accessConditionOptions[1].name, [mockGroup as any]],
        [mockUploadConfigResponse.accessConditionOptions[2].name, [mockGroup as any]],
      ]);

      expect(comp.collectionId).toBe(collectionId);
      expect(comp.collectionName).toBe(mockCollection.name);
      expect(comp.availableAccessConditionOptions.length).toBe(4);
      expect(comp.availableAccessConditionOptions).toEqual(mockUploadConfigResponse.accessConditionOptions as any);
      expect(comp.required$.getValue()).toBe(true);
      expect(compAsAny.subs.length).toBe(2);
      expect(compAsAny.fileList).toEqual(mockUploadFiles);
      expect(compAsAny.primaryBitstreamUUID).toEqual(null);
      expect(compAsAny.fileNames).toEqual(['123456-test-upload.jpg']);

    });

    it('should properly read the section status when required is true', () => {
      bitstreamService.getUploadedFilesData.and.returnValue(observableOf({ primary: null, files: [] }));

      submissionServiceStub.getSubmissionObject.and.returnValue(observableOf(submissionState));

      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));

      resourcePolicyService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(mockDefaultAccessCondition));

      uploadsConfigService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new SubmissionUploadsModel(), mockUploadConfigResponse)));

      groupService.findById.and.returnValues(
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
      );

      bitstreamService.getUploadedFileList.and.returnValue(cold('-a-b', {
        a: [],
        b: mockUploadFiles,
      }));

      comp.onSectionInit();

      expect(comp.required$.getValue()).toBe(true);

      expect(compAsAny.getSectionStatus()).toBeObservable(cold('-c-d', {
        c: false,
        d: true,
      }));
    });

    it('should properly read the section status when required is false', () => {
      submissionServiceStub.getSubmissionObject.and.returnValue(observableOf(submissionState));

      bitstreamService.getUploadedFilesData.and.returnValue(observableOf({ primary: null, files: [] }));
      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));

      resourcePolicyService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(mockDefaultAccessCondition));

      uploadsConfigService.findByHref.and.returnValue(createSuccessfulRemoteDataObject$(Object.assign(new SubmissionUploadsModel(), mockUploadConfigResponseNotRequired)));

      groupService.findById.and.returnValues(
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
        createSuccessfulRemoteDataObject$(Object.assign(new Group(), mockGroup)),
      );

      bitstreamService.getUploadedFileList.and.returnValue(cold('-a-b', {
        a: [],
        b: mockUploadFiles,
      }));

      comp.onSectionInit();

      expect(comp.required$.getValue()).toBe(false);

      expect(compAsAny.getSectionStatus()).toBeObservable(cold('-c-d', {
        c: true,
        d: true,
      }));
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [
    CommonModule],
})
class TestComponent {

}
