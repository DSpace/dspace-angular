import { ChangeDetectorRef, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { of, of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { createTestComponent} from '../../../shared/testing/utils.test';
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
import { SectionDataObject } from '../models/section-data.model';
import { SectionsType } from '../sections-type';
import {
  mockSubmissionCollectionId,
  mockSubmissionId
} from '../../../shared/mocks/submission.mock';
import { FormComponent } from '../../../shared/form/form.component';
import { SubmissionSectionClarinLicenseComponent } from './section-license.component';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SectionFormOperationsService } from '../form/section-form-operations.service';
import { Collection } from '../../../core/shared/collection.model';
import { License } from '../../../core/shared/license.model';
import { ClarinLicenseDataService } from '../../../core/data/clarin/clarin-license-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../../../core/cache/builders/remote-data-build.service';
import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { RequestService } from '../../../core/data/request.service';
import { SubmissionFormsConfigDataService } from 'src/app/core/config/submission-forms-config-data.service';

const collectionId = mockSubmissionCollectionId;
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

function getMockSubmissionFormsConfigService(): SubmissionFormsConfigDataService {
  return jasmine.createSpyObj('FormOperationsService', {
    getConfigAll: jasmine.createSpy('getConfigAll'),
    getConfigByHref: jasmine.createSpy('getConfigByHref'),
    getConfigByName: jasmine.createSpy('getConfigByName'),
    getConfigBySearch: jasmine.createSpy('getConfigBySearch')
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
  errorsToShow: [],
  serverValidationErrors: [],
  header: 'submit.progressbar.describe.license',
  id: 'license',
  sectionType: SectionsType.License
};

const helpDeskMail = 'test@mail.com';

describe('ClarinSubmissionSectionLicenseComponent test suite', () => {
  const sectionsServiceStub: any = new SectionsServiceStub();
  const submissionId = mockSubmissionId;

  // const pathCombiner = new JsonPatchOperationPathCombiner('sections', sectionObject.id);
  const jsonPatchOpBuilder: any = jasmine.createSpyObj('jsonPatchOpBuilder', {
    add: jasmine.createSpy('add'),
    replace: jasmine.createSpy('replace'),
    remove: jasmine.createSpy('remove'),
  });

  const mockCollectionDataService = jasmine.createSpyObj('CollectionDataService', {
    findById: jasmine.createSpy('findById'),
    findByHref: jasmine.createSpy('findByHref')
  });

  const mockClarinDataService = jasmine.createSpyObj('ClarinDataService', {
    searchBy: jasmine.createSpy('searchBy'),
  });

  const mockItemDataService = jasmine.createSpyObj('ItemDataService', {
    findByHref: jasmine.createSpy('findByHref'),
  });

  const mockWorkspaceitemDataService = jasmine.createSpyObj('WorkspaceitemDataService', {
    getLinkPath: jasmine.createSpy('getLinkPath'),
    findById: jasmine.createSpy('findById'),
  });

  const mockHalService = jasmine.createSpyObj('HALEndpointService', {
    getEndpoint: jasmine.createSpy('getEndpoint')
  });

  const mockRdbService = jasmine.createSpyObj('RemoteDataBuildService', {
    buildFromRequestUUID: jasmine.createSpy('buildFromRequestUUID')
  });

  const configurationServiceSpy = jasmine.createSpyObj('configurationService', {
    findByPropertyName: of(helpDeskMail),
  });

  const mockRequestService = jasmine.createSpyObj('RequestService', {
    generateRequestId: jasmine.createSpy('generateRequestId'),
    send: jasmine.createSpy('send'),
  });
  beforeEach(waitForAsync(() => {
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
        SubmissionSectionClarinLicenseComponent,
        TestComponent
      ],
      providers: [
        { provide: SectionFormOperationsService, useValue: getMockFormOperationsService() },
        { provide: FormService, useValue: getMockFormService() },
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
        { provide: SubmissionFormsConfigDataService, useValue: getMockSubmissionFormsConfigService() },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: SectionsService, useValue: sectionsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: CollectionDataService, useValue: mockCollectionDataService },
        { provide: ClarinLicenseDataService, useValue: mockClarinDataService },
        { provide: ItemDataService, useValue: mockItemDataService },
        { provide: HALEndpointService, useValue: mockHalService },
        { provide: WorkspaceitemDataService, useValue: mockWorkspaceitemDataService },
        { provide: RemoteDataBuildService, useValue: mockRdbService },
        { provide: ConfigurationDataService, useValue: configurationServiceSpy },
        { provide: RequestService, useValue: mockRequestService },
        { provide: 'collectionIdProvider', useValue: collectionId },
        { provide: 'sectionDataProvider', useValue: Object.assign({}, sectionObject) },
        { provide: 'submissionIdProvider', useValue: submissionId },
        ChangeDetectorRef,
        FormBuilderService,
        SubmissionSectionClarinLicenseComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      mockCollectionDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(mockCollection));
      sectionsServiceStub.isSectionReadOnly.and.returnValue(observableOf(false));
      sectionsServiceStub.getSectionErrors.and.returnValue(observableOf([]));

      const html = `
        <ds-submission-section-license></ds-submission-section-license>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create ClarinSubmissionSectionLicenseComponent', inject([SubmissionSectionClarinLicenseComponent], (app: SubmissionSectionClarinLicenseComponent) => {
      expect(app).toBeDefined();
    }));
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

}
