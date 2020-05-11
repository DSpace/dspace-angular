import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgxPaginationModule } from 'ngx-pagination';
import { cold, hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { SubmissionService } from '../../submission.service';
import { SubmissionServiceStub } from '../../../shared/testing/submission-service.stub';
import { SectionsService } from '../sections.service';
import { SectionsServiceStub } from '../../../shared/testing/sections-service.stub';
import { FormBuilderService } from '../../../shared/form/builder/form-builder.service';
import { getMockFormOperationsService } from '../../../shared/mocks/form-operations-service.mock';
import { getMockFormService } from '../../../shared/mocks/form-service.mock';
import { FormService } from '../../../shared/form/form.service';
import { SubmissionFormsConfigService } from '../../../core/config/submission-forms-config.service';
import { SectionDataObject } from '../models/section-data.model';
import { SectionsType } from '../sections-type';
import { mockSubmissionCollectionId, mockSubmissionId } from '../../../shared/mocks/submission.mock';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { SubmissionSectionDetectDuplicateComponent } from './section-detect-duplicate.component';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { DetectDuplicateService } from './detect-duplicate.service';
import { getMockDetectDuplicateService } from '../../../shared/mocks/mock-detect-duplicate-service';
import { SubmissionScopeType } from '../../../core/submission/submission-scope-type';
import { License } from '../../../core/shared/license.model';
import { Collection } from '../../../core/shared/collection.model';
import { ObjNgFor } from '../../../shared/utils/object-ngfor.pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';

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

describe('SubmissionSectionDetectDuplicateComponent test suite', () => {
  let comp: SubmissionSectionDetectDuplicateComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionSectionDetectDuplicateComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let sectionsServiceStub: SectionsServiceStub;
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
        value: 'Community 1-Collection 1'
      }],
    license: createSuccessfulRemoteDataObject$(Object.assign(new License(), { text: licenseText }))
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [
        SubmissionSectionDetectDuplicateComponent,
        TestComponent,
        ObjNgFor,
        VarDirective,
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
        { provide: DetectDuplicateService, useClass: getMockDetectDuplicateService },
        ChangeDetectorRef,
        FormBuilderService,
        SubmissionSectionDetectDuplicateComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then();
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-submission-section-detect-duplicate></ds-submission-section-detect-duplicate>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionSectionDetectDuplicateComponent', inject([SubmissionSectionDetectDuplicateComponent], (app: SubmissionSectionDetectDuplicateComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionSectionDetectDuplicateComponent);
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

    it('Should init section properly - with workflow', () => {
      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));

      compAsAny.detectDuplicateService.getDuplicateMatchesByScope.and.returnValue(
        hot('(a|)', {
          a: { dummy: 1 }
        })
      );
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkflowItem);
      spyOn(compAsAny, 'getSectionStatus').and.returnValue(observableOf(true));

      comp.onSectionInit();
      fixture.detectChanges();

      expect(comp.isWorkFlow).toBeTruthy();
      expect(comp.sectionData$).toBeObservable(cold('(a|)', {
        a: { dummy: 1 }
      }));
    });

    it('Should init section properly - with workspace', () => {
      collectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));

      compAsAny.detectDuplicateService.getDuplicateMatchesByScope.and.returnValue(
        hot('(a|)', {
          a: { dummy: 1 }
        })
      );
      compAsAny.submissionService.getSubmissionScope.and.returnValue(SubmissionScopeType.WorkspaceItem);
      spyOn(compAsAny, 'getSectionStatus').and.returnValue(observableOf(true));

      comp.onSectionInit();
      fixture.detectChanges();

      expect(comp.isWorkFlow).toBeFalsy();
      expect(comp.sectionData$).toBeObservable(cold('(a|)', {
        a: { dummy: 1 }
      }));
    });

    it('Should return TRUE if the sectionData is empty', () => {
      compAsAny.sectionData$ = observableOf({ matches: [] });
      expect(compAsAny.getSectionStatus()).toBeObservable(cold('(a|)', {
        a: true
      }));
    });

    it('Should return FALSE if the sectionData is not empty', () => {
      compAsAny.sectionData$ = observableOf({ matches: [{ dummy: 1 }] });
      expect(compAsAny.getSectionStatus()).toBeObservable(cold('(a|)', {
        a: false
      }));
    });

    it('Should return the length of the sectionData$', () => {
      compAsAny.sectionData$ = observableOf({ matches: [{ dummy: 1 }, { dummy: 2 }] });
      expect(compAsAny.getTotalMatches()).toBeObservable(cold('(a|)', {
        a: 2
      }));
    });

    it('config.currentPage should be equal to page', () => {
      const page = 5;
      comp.config = new PaginationComponentOptions();
      comp.setPage(page);
      expect(comp.config.currentPage).toEqual(page);
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
