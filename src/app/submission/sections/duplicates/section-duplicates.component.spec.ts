import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
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
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { NgxPaginationModule } from 'ngx-pagination';
import { of as observableOf } from 'rxjs';

import { SubmissionFormsConfigDataService } from '../../../core/config/submission-forms-config-data.service';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { Collection } from '../../../core/shared/collection.model';
import { License } from '../../../core/shared/license.model';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { FormService } from '../../../shared/form/form.service';
import { getMockFormBuilderService } from '../../../shared/mocks/form-builder-service.mock';
import { getMockFormOperationsService } from '../../../shared/mocks/form-operations-service.mock';
import { getMockFormService } from '../../../shared/mocks/form-service.mock';
import {
  mockSubmissionCollectionId,
  mockSubmissionId,
} from '../../../shared/mocks/submission.mock';
import { defaultUUID } from '../../../shared/mocks/uuid.service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Duplicate } from '../../../shared/object-list/duplicate-data/duplicate.model';
import { DUPLICATE } from '../../../shared/object-list/duplicate-data/duplicate.resource-type';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { PaginationServiceStub } from '../../../shared/testing/pagination-service.stub';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { ObjNgFor } from '../../../shared/utils/object-ngfor.pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { SubmissionService } from '../../submission.service';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { SectionsService } from '../sections.service';
import { SectionsType } from '../sections-type';
import { SubmissionSectionDuplicatesComponent } from './section-duplicates.component';

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

const duplicates: Duplicate[] = [{
  title: 'Unique title',
  uuid: defaultUUID,
  workflowItemId: 1,
  workspaceItemId: 2,
  owningCollection: 'Test Collection',
  metadata: {
    'dc.title': [
      Object.assign(new MetadataValue(), {
        'value': 'Unique title',
        'language': null,
        'authority': null,
        'confidence': -1,
        'place': 0,
      })],
  },
  type: DUPLICATE,
  _links: {
    self: {
      href: 'http://localhost:8080/server/api/core/submission/duplicates/search?uuid=testid',
    },
  },
}];

const sectionObject = {
  header: 'submission.sections.submit.progressbar.duplicates',
  mandatory: true,
  opened: true,
  data: { potentialDuplicates: duplicates },
  errorsToShow: [],
  serverValidationErrors: [],
  id: 'duplicates',
  sectionType: SectionsType.Duplicates,
  sectionVisibility: null,
};

describe('SubmissionSectionDuplicatesComponent test suite', () => {
  let comp: SubmissionSectionDuplicatesComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionDuplicatesComponent>;
  let submissionServiceStub: any = new SubmissionServiceStub();
  const sectionsServiceStub: any = new SectionsServiceStub();
  let formService: any;
  let formOperationsService: any;
  let formBuilderService: any;
  let collectionDataService: any;

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
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        SubmissionSectionDuplicatesComponent,
        TestComponent,
        ObjNgFor,
        VarDirective,
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
        { provide: PaginationService, useValue: paginationService },
        ChangeDetectorRef,
        { provide: FormBuilderService, useValue: getMockFormBuilderService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents().then();
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.getSectionData.and.returnValue(observableOf(sectionObject));
      testFixture = TestBed.createComponent(SubmissionSectionDuplicatesComponent);
      testComp = testFixture.componentInstance;

    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionDuplicatesComponent', () => {
      expect(testComp).toBeTruthy();
    });
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionDuplicatesComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.inject(SubmissionService);
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

    // Test initialisation of the submission section
    it('Should init section properly', () => {
      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkspaceItem);
      spyOn(comp, 'getSectionStatus').and.returnValue(observableOf(true));
      spyOn(comp, 'getDuplicateData').and.returnValue(observableOf({ potentialDuplicates: duplicates }));
      expect(comp.isLoading).toBeTruthy();
      comp.onSectionInit();
      fixture.detectChanges();
      expect(comp.isLoading).toBeFalsy();
    });

    // The following tests look for proper logic in the getSectionStatus() implementation
    // These are very simple as we don't really have a 'false' state unless we're still loading
    it('Should return TRUE if the isLoading is FALSE', () => {
      compAsAny.isLoading = false;
      expect(compAsAny.getSectionStatus()).toBeObservable(cold('(a|)', {
        a: true,
      }));
    });
    it('Should return FALSE', () => {
      compAsAny.isLoadin = true;
      expect(compAsAny.getSectionStatus()).toBeObservable(cold('(a|)', {
        a: false,
      }));
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
  imports: [BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule],
})
class TestComponent {

}
