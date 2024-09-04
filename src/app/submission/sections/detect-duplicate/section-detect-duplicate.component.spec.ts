import { CommonModule } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { NgxPaginationModule } from 'ngx-pagination';
import { of as observableOf } from 'rxjs';

import { APP_DATA_SERVICES_MAP } from '../../../../config/app-config.interface';
import { SubmissionFormsConfigDataService } from '../../../core/config/submission-forms-config-data.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { License } from '../../../core/shared/license.model';
import {
  DetectDuplicateMatch,
  WorkspaceitemSectionDetectDuplicateObject,
} from '../../../core/submission/models/workspaceitem-section-deduplication.model';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormService } from '../../../shared/form/form.service';
import { ThemedLoadingComponent } from '../../../shared/loading/themed-loading.component';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { getMockFormOperationsService } from '../../../shared/mocks/form-operations-service.mock';
import { getMockFormService } from '../../../shared/mocks/form-service.mock';
import { getMockDetectDuplicateService } from '../../../shared/mocks/mock-detect-duplicate-service';
import {
  mockSubmissionCollectionId,
  mockSubmissionId,
} from '../../../shared/mocks/submission.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { ObjNgFor } from '../../../shared/utils/object-ngfor.pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { SubmissionService } from '../../submission.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsService } from '../sections.service';
import { SectionsType } from '../sections-type';
import { DetectDuplicateService } from './detect-duplicate.service';
import { DuplicateMatchComponent } from './duplicate-match/duplicate-match.component';
import { SubmissionSectionDetectDuplicateComponent } from './section-detect-duplicate.component';

function getMockSubmissionFormsConfigService(): SubmissionFormsConfigDataService {
  return jasmine.createSpyObj('FormOperationsService', {
    getConfigAll: jasmine.createSpy('getConfigAll'),
    getConfigByHref: jasmine.createSpy('getConfigByHref'),
    getConfigByName: jasmine.createSpy('getConfigByName'),
    getConfigBySearch: jasmine.createSpy('getConfigBySearch'),
  });
}

function getMockCollectionDataService(): CollectionDataService {
  return jasmine.createSpyObj('CollectionDataService', {
    findById: jasmine.createSpy('findById'),
    findByHref: jasmine.createSpy('findByHref'),
  });
}

const mockItem = Object.assign(new Item(), {
  id: 'fake-match-id',
  handle: 'fake/handle',
  metadata: {
    'dc.title': [
      {
        language: null,
        value: 'mockmatch',
      },
    ],
  },
});

const mockMatch: DetectDuplicateMatch = {
  submitterDecision: null,
  submitterNote: null,
  submitterTime: null,

  workflowDecision: null,
  workflowNote: null,
  workflowTime: null,

  adminDecision: null,

  matchObject: mockItem,
};

const sectionData: WorkspaceitemSectionDetectDuplicateObject = {
  matches: {
    'fake-match-id': mockMatch,
  },
};

const sectionObject: SectionDataObject = {
  config: 'https://dspace.org/api/config/submissionforms/detect-duplicate',
  mandatory: true,
  opened: true,
  data: sectionData,
  errorsToShow: [],
  serverValidationErrors: [],
  header: 'submit.progressbar.detect-duplicate',
  id: 'detect-duplicate',
  sectionType: SectionsType.DetectDuplicate,
  sectionVisibility: null,
};

describe('SubmissionSectionDetectDuplicateComponent test suite', () => {
  let comp: SubmissionSectionDetectDuplicateComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionDetectDuplicateComponent>;
  let submissionServiceStub: any;
  let sectionsServiceStub: any;
  let formService: any;
  let formOperationsService: any;
  let formBuilderService: any;
  let collectionDataService: any;

  const mockDetectDuplicateService: any = getMockDetectDuplicateService();
  const submissionId = mockSubmissionId;
  const collectionId = mockSubmissionCollectionId;
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
        value: 'Community 1-Collection 1',
      }],
    license: createSuccessfulRemoteDataObject$(Object.assign(new License(), { text: licenseText })),
  });
  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        TestComponent,
        ObjNgFor,
        VarDirective,
        SubmissionSectionDetectDuplicateComponent,
      ],
      providers: [
        { provide: CollectionDataService, useValue: getMockCollectionDataService() },
        { provide: SectionFormOperationsService, useValue: getMockFormOperationsService() },
        { provide: FormService, useValue: getMockFormService() },
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
        { provide: SubmissionFormsConfigDataService, useValue: getMockSubmissionFormsConfigService() },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SectionsService, useClass: SectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: 'collectionIdProvider', useValue: collectionId },
        { provide: 'sectionDataProvider', useValue: sectionObject },
        { provide: 'submissionIdProvider', useValue: submissionId },
        { provide: DetectDuplicateService, useValue: mockDetectDuplicateService },
        { provide: PaginationService, useValue: paginationService },
        { provide: FormBuilderService, useValue: getMockFormBuilderService() },
        provideMockStore(),
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(SubmissionSectionDetectDuplicateComponent, { remove: { imports: [ThemedLoadingComponent, AlertComponent, PaginationComponent, DuplicateMatchComponent] } }).compileComponents().then();
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      mockDetectDuplicateService.getDuplicateMatchesByScope.and.returnValue(observableOf(sectionData));
      const html = `
        <ds-submission-section-detect-duplicate></ds-submission-section-detect-duplicate>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionDetectDuplicateComponent', () => {
      expect(testComp).toBeDefined();
    });
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionDetectDuplicateComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.inject(SubmissionService);
      sectionsServiceStub = TestBed.inject(SectionsService);
      formService = TestBed.inject(FormService);
      formBuilderService = TestBed.inject(FormBuilderService);
      formOperationsService = TestBed.inject(SectionFormOperationsService);
      collectionDataService = TestBed.inject(CollectionDataService);
      compAsAny.pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionObject.id);
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('Should init section properly - with workflow', () => {
      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));
      mockDetectDuplicateService.getDuplicateMatchesByScope.and.returnValue(observableOf(sectionData));
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkflowItem);
      spyOn(compAsAny, 'getSectionStatus').and.returnValue(observableOf(true));

      comp.onSectionInit();
      fixture.detectChanges();

      expect(comp.isWorkFlow).toBeTruthy();
      expect(comp.sectionData$).toBeObservable(cold('(a|)', {
        a: sectionData,
      }));
    });

    it('Should init section properly - with workspace', () => {
      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));
      mockDetectDuplicateService.getDuplicateMatchesByScope.and.returnValue(observableOf(sectionData));
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkspaceItem);
      spyOn(compAsAny, 'getSectionStatus').and.returnValue(observableOf(true));

      comp.onSectionInit();
      fixture.detectChanges();

      expect(comp.isWorkFlow).toBeFalsy();
      expect(comp.sectionData$).toBeObservable(cold('(a|)', {
        a: sectionData,
      }));
    });

    it('Should return TRUE if the sectionData is empty', () => {
      compAsAny.sectionData$ = observableOf({ matches: { } });
      expect(compAsAny.getSectionStatus()).toBeObservable(cold('(a|)', {
        a: true,
      }));
    });

    it('Should return FALSE if the sectionData is not empty', () => {
      compAsAny.sectionData$ = observableOf(sectionData);
      expect(compAsAny.getSectionStatus()).toBeObservable(cold('(a|)', {
        a: false,
      }));
    });

    it('Should return the length of the sectionData$', () => {
      compAsAny.sectionData$ = observableOf({ matches: [{ dummy: 1 }, { dummy: 2 }] });
      expect(compAsAny.getTotalMatches()).toBeObservable(cold('(a|)', {
        a: 2,
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
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
})
class TestComponent {

}
