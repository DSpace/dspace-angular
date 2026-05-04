import {
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import {
  fakeAsync,
  flush,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { ErrorResponse } from '@dspace/core/cache/response.models';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { RequestService } from '@dspace/core/data/request.service';
import { RequestError } from '@dspace/core/data/request-error.model';
import { HttpOptions } from '@dspace/core/dspace-rest/dspace-rest.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { RouteService } from '@dspace/core/services/route.service';
import { Bundle } from '@dspace/core/shared/bundle.model';
import { Item } from '@dspace/core/shared/item.model';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import {
  SectionScope,
  SubmissionVisibilityValue,
} from '@dspace/core/submission/models/section-visibility.model';
import { SubmissionJsonPatchOperationsService } from '@dspace/core/submission/submission-json-patch-operations.service';
import { SubmissionRestService } from '@dspace/core/submission/submission-rest.service';
import { SubmissionScopeType } from '@dspace/core/submission/submission-scope-type';
import { MockActivatedRoute } from '@dspace/core/testing/active-router.mock';
import { ItemDataServiceStub } from '@dspace/core/testing/item-data.service.stub';
import { getMockRequestService } from '@dspace/core/testing/request.service.mock';
import { RouterMock } from '@dspace/core/testing/router.mock';
import { getMockSearchService } from '@dspace/core/testing/search-service.mock';
import { SubmissionJsonPatchOperationsServiceStub } from '@dspace/core/testing/submission-json-patch-operations-service.stub';
import { SubmissionRestServiceStub } from '@dspace/core/testing/submission-rest-service.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
} from '@dspace/core/utilities/remote-data.utils';
import { StoreModule } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  cold,
  getTestScheduler,
  hot,
} from 'jasmine-marbles';
import {
  of,
  throwError as observableThrowError,
} from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { environment } from '../../environments/environment';
import { storeModuleConfig } from '../app.reducer';
import { SearchService } from '../shared/search/search.service';
import {
  CancelSubmissionFormAction,
  ChangeSubmissionCollectionAction,
  DiscardSubmissionAction,
  InitSubmissionFormAction,
  ResetSubmissionFormAction,
  SaveAndDepositSubmissionAction,
  SaveForLaterSubmissionFormAction,
  SaveSubmissionFormAction,
  SaveSubmissionSectionFormAction,
  SetActiveSectionAction,
} from './objects/submission-objects.actions';
import { submissionReducers } from './submission.reducers';
import { SubmissionService } from './submission.service';
import {
  mockSubmissionDefinition,
  mockSubmissionRestResponse,
} from './utils/submission.mock';

describe('SubmissionService', () => {
  const collectionId = '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f';
  const submissionId = '826';
  const sectionId = 'test';
  const subState = {
    objects: {
      826: {
        collection: '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f',
        definition: 'traditional',
        selfUrl: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826',
        activeSection: 'keyinformation',
        sections: {
          extraction: {
            config: '',
            mandatory: true,
            scope: SectionScope.Submission,
            sectionType: 'utils',
            visibility: {
              submission: SubmissionVisibilityValue.Hidden,
              workflow: SubmissionVisibilityValue.Hidden,
            },
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          collection: {
            config: '',
            mandatory: true,
            scope: SectionScope.Submission,
            sectionType: 'collection',
            visibility: {
              submission: SubmissionVisibilityValue.Hidden,
              workflow: SubmissionVisibilityValue.Hidden,
            },
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          keyinformation: {
            header: 'submit.progressbar.describe.keyinformation',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/keyinformation',
            mandatory: true,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          indexing: {
            header: 'submit.progressbar.describe.indexing',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/indexing',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          publicationchannel: {
            header: 'submit.progressbar.describe.publicationchannel',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/publicationchannel',
            mandatory: true,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: true,
          },
          acknowledgement: {
            header: 'submit.progressbar.describe.acknowledgement',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/acknowledgement',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          identifiers: {
            header: 'submit.progressbar.describe.identifiers',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/identifiers',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          references: {
            header: 'submit.progressbar.describe.references',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/references',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          upload: {
            header: 'submit.progressbar.upload',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
            mandatory: true,
            sectionType: 'upload',
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          license: {
            header: 'submit.progressbar.license',
            config: '',
            mandatory: true,
            sectionType: 'license',
            visibility: {
              workflow: SubmissionVisibilityValue.ReadOnly,
            },
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
        },
        isLoading: false,
        savePending: false,
        saveDecisionPending: false,
        depositPending: false,
      },
    },
  };
  const validSubState = {
    objects: {
      826: {
        collection: '43fe1f8c-09a6-4fcf-9c78-5d4fed8f2c8f',
        definition: 'traditional',
        selfUrl: 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826',
        activeSection: 'keyinformation',
        sections: {
          extraction: {
            config: '',
            mandatory: true,
            scope: SectionScope.Submission,
            sectionType: 'utils',
            visibility: {
              submission: SubmissionVisibilityValue.Hidden,
              workflow: SubmissionVisibilityValue.Hidden,
            },
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          collection: {
            config: '',
            mandatory: true,
            scope: SectionScope.Submission,
            sectionType: 'collection',
            visibility: {
              submission: SubmissionVisibilityValue.Hidden,
              workflow: SubmissionVisibilityValue.Hidden,
            },
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          keyinformation: {
            header: 'submit.progressbar.describe.keyinformation',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/keyinformation',
            mandatory: true,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: true,
          },
          indexing: {
            header: 'submit.progressbar.describe.indexing',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/indexing',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          publicationchannel: {
            header: 'submit.progressbar.describe.publicationchannel',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/publicationchannel',
            mandatory: true,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: true,
          },
          acknowledgement: {
            header: 'submit.progressbar.describe.acknowledgement',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/acknowledgement',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          identifiers: {
            header: 'submit.progressbar.describe.identifiers',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/identifiers',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          references: {
            header: 'submit.progressbar.describe.references',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/references',
            mandatory: false,
            sectionType: 'submission-form',
            collapsed: false,
            enabled: false,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: false,
          },
          upload: {
            header: 'submit.progressbar.upload',
            config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
            mandatory: true,
            sectionType: 'upload',
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: true,
          },
          license: {
            header: 'submit.progressbar.license',
            config: '',
            mandatory: true,
            sectionType: 'license',
            visibility: {
              workflow: SubmissionVisibilityValue.ReadOnly,
            },
            collapsed: false,
            enabled: true,
            data: {},
            errorsToShow: [],
            serverValidationErrors: [],
            isLoading: false,
            isValid: true,
          },
        },
        isLoading: false,
        savePending: false,
        saveDecisionPending: false,
        depositPending: false,
      },
    },
  };
  const restService = new SubmissionRestServiceStub();
  let itemService: ItemDataServiceStub;
  const router = new RouterMock();
  const selfUrl = 'https://rest.api/dspace-spring-rest/api/submission/workspaceitems/826';
  const submissionDefinition: any = mockSubmissionDefinition;
  const submissionJsonPatchOperationsService = new SubmissionJsonPatchOperationsServiceStub();

  let scheduler: TestScheduler;
  let service: SubmissionService;

  const searchService = getMockSearchService();

  const requestServce = getMockRequestService();

  beforeEach(waitForAsync(() => {
    itemService = new ItemDataServiceStub();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ submissionReducers } as any, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: SubmissionRestService, useValue: restService },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute() },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestServce },
        { provide: SubmissionJsonPatchOperationsService, useValue: submissionJsonPatchOperationsService },
        { provide: ItemDataService, useValue: itemService },
        NotificationsService,
        RouteService,
        SubmissionService,
        TranslateService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(SubmissionService);
    spyOn((service as any).store, 'dispatch').and.callThrough();
  });

  describe('changeSubmissionCollection', () => {
    it('should dispatch a new ChangeSubmissionCollectionAction', () => {
      service.changeSubmissionCollection(submissionId, collectionId);
      const expected = new ChangeSubmissionCollectionAction(submissionId, collectionId);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('createSubmission', () => {
    it('should create a new submission', () => {
      const paramsObj = Object.create({});
      const params = new HttpParams({ fromObject: paramsObj });
      const options: HttpOptions = Object.create({});
      options.params = params;
      service.createSubmission();

      expect((service as any).restService.postToEndpoint).toHaveBeenCalled();
      expect((service as any).restService.postToEndpoint).toHaveBeenCalledWith('workspaceitems', {}, null, options, undefined);
    });

    it('should create a new submission with entity type', () => {
      const entityType = 'Publication';
      const params = new HttpParams({ fromObject: { entityType: entityType } });
      const options: HttpOptions = Object.create({});
      options.params = params;

      service.createSubmission(undefined, 'Publication');

      expect((service as any).restService.postToEndpoint).toHaveBeenCalled();
      expect((service as any).restService.postToEndpoint).toHaveBeenCalledWith('workspaceitems', {}, null, options, undefined);
    });

    it('should create a new submission with collection', () => {
      const paramsObj = Object.create({});
      const params = new HttpParams({ fromObject: paramsObj });
      const options: HttpOptions = Object.create({});
      options.params = params;

      service.createSubmission(collectionId);

      expect((service as any).restService.postToEndpoint).toHaveBeenCalled();
      expect((service as any).restService.postToEndpoint).toHaveBeenCalledWith('workspaceitems', {}, null, options, collectionId);
    });
  });

  describe('createSubmissionFromExternalSource', () => {
    it('should deposit submission', () => {
      const options: HttpOptions = Object.create({});
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'text/uri-list');
      options.headers = headers;

      service.createSubmissionFromExternalSource(selfUrl, collectionId);

      expect((service as any).restService.postToEndpoint).toHaveBeenCalledWith('workspaceitems', selfUrl, null, options, collectionId);
    });
  });

  describe('depositSubmission', () => {
    it('should deposit submission', () => {
      const options: HttpOptions = Object.create({});
      let headers = new HttpHeaders();
      headers = headers.append('Content-Type', 'text/uri-list');
      options.headers = headers;

      service.depositSubmission(selfUrl);

      expect((service as any).restService.postToEndpoint).toHaveBeenCalledWith('workflowitems', selfUrl, null, options);
    });
  });

  describe('discardSubmission', () => {
    it('should discard submission', () => {
      service.discardSubmission('826');

      expect((service as any).restService.deleteById).toHaveBeenCalledWith('826');
    });
  });

  describe('dispatchInit', () => {
    it('should dispatch a new InitSubmissionFormAction', () => {
      service.dispatchInit(
        collectionId,
        submissionId,
        selfUrl,
        submissionDefinition,
        {},
        new Item(),
        null,
      );
      const expected = new InitSubmissionFormAction(
        collectionId,
        submissionId,
        selfUrl,
        submissionDefinition,
        {},
        new Item(),
        null);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('dispatchDeposit', () => {
    it('should dispatch a new SaveAndDepositSubmissionAction', () => {
      service.dispatchDeposit(submissionId);
      const expected = new SaveAndDepositSubmissionAction(submissionId);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('dispatchDiscard', () => {
    it('should dispatch a new DiscardSubmissionAction', () => {
      service.dispatchDiscard(submissionId);
      const expected = new DiscardSubmissionAction(submissionId);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('dispatchSave', () => {
    it('should dispatch a new SaveSubmissionFormAction', () => {
      service.dispatchSave(submissionId);
      const expected = new SaveSubmissionFormAction(submissionId);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });

    it('should dispatch a new SaveSubmissionFormAction with manual flag', () => {
      service.dispatchSave(submissionId, true);
      const expected = new SaveSubmissionFormAction(submissionId, true);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('dispatchSaveForLater', () => {
    it('should dispatch a new SaveForLaterSubmissionFormAction', () => {
      service.dispatchSaveForLater(submissionId);
      const expected = new SaveForLaterSubmissionFormAction(submissionId);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('dispatchSaveSection', () => {
    it('should dispatch a new SaveSubmissionSectionFormAction', () => {
      service.dispatchSaveSection(submissionId, sectionId);
      const expected = new SaveSubmissionSectionFormAction(submissionId, sectionId);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('getSubmissionObject', () => {
    it('should return submission object state from the store', () => {
      spyOn((service as any).store, 'select').and.returnValue(hot('a', {
        a: subState.objects[826],
      }));

      const result = service.getSubmissionObject('826');
      const expected = cold('b', { b: subState.objects[826] });

      expect(result).toBeObservable(expected);
    });
  });

  describe('getActiveSectionId', () => {
    it('should return current active submission form section', () => {
      spyOn((service as any).store, 'select').and.returnValue(hot('a', {
        a: subState.objects[826],
      }));

      const result = service.getActiveSectionId('826');
      const expected = cold('b', { b: 'keyinformation' });

      expect(result).toBeObservable(expected);

    });
  });

  describe('getSubmissionSections', () => {
    it('should return submission form sections', () => {
      spyOn(service, 'getSubmissionScope').and.returnValue(SubmissionScopeType.WorkspaceItem);
      spyOn((service as any).store, 'select').and.returnValue(hot('a|', {
        a: subState.objects[826],
      }));

      const result = service.getSubmissionSections('826');
      const expected = cold('(bc|)', {
        b: [],
        c:
          [
            {
              header: 'submit.progressbar.describe.keyinformation',
              id: 'keyinformation',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/keyinformation',
              mandatory: true,
              scope: undefined,
              sectionType: 'submission-form',
              data: {},
              errorsToShow: [],
              serverValidationErrors: [],
              sectionVisibility: undefined,
            },
            {
              header: 'submit.progressbar.describe.indexing',
              id: 'indexing',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/indexing',
              mandatory: false,
              scope: undefined,
              sectionType: 'submission-form',
              data: {},
              errorsToShow: [],
              serverValidationErrors: [],
              sectionVisibility: undefined,
            },
            {
              header: 'submit.progressbar.describe.publicationchannel',
              id: 'publicationchannel',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/publicationchannel',
              mandatory: true,
              scope: undefined,
              sectionType: 'submission-form',
              data: {},
              errorsToShow: [],
              serverValidationErrors: [],
              sectionVisibility: undefined,
            },
            {
              header: 'submit.progressbar.describe.acknowledgement',
              id: 'acknowledgement',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/acknowledgement',
              mandatory: false,
              scope: undefined,
              sectionType: 'submission-form',
              data: {},
              errorsToShow: [],
              serverValidationErrors: [],
              sectionVisibility: undefined,
            },
            {
              header: 'submit.progressbar.describe.identifiers',
              id: 'identifiers',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/identifiers',
              mandatory: false,
              scope: undefined,
              sectionType: 'submission-form',
              data: {},
              errorsToShow: [],
              serverValidationErrors: [],
              sectionVisibility: undefined,
            },
            {
              header: 'submit.progressbar.describe.references',
              id: 'references',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/references',
              mandatory: false,
              scope: undefined,
              sectionType: 'submission-form',
              data: {},
              errorsToShow: [],
              serverValidationErrors: [],
              sectionVisibility: undefined,
            },
            {
              header: 'submit.progressbar.upload',
              id: 'upload',
              config: 'https://rest.api/dspace-spring-rest/api/config/submissionuploads/upload',
              mandatory: true,
              scope: undefined,
              sectionType: 'upload',
              data: {},
              errorsToShow: [],
              serverValidationErrors: [],
              sectionVisibility: undefined,
            },
            {
              header: 'submit.progressbar.license',
              id: 'license',
              config: '',
              mandatory: true,
              scope: undefined,
              sectionType: 'license',
              data: {},
              errorsToShow: [],
              serverValidationErrors: [],
              sectionVisibility: {
                workflow: SubmissionVisibilityValue.ReadOnly,
              },
            },
          ],
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('getDisabledSectionsList', () => {
    it('should return list of submission disabled sections', () => {
      spyOn((service as any).store, 'select').and.returnValue(hot('-a|', {
        a: subState.objects[826],
      }));

      const result = service.getDisabledSectionsList('826');
      const expected = cold('bc|', {
        b: [],
        c:
          [
            {
              header: 'submit.progressbar.describe.indexing',
              id: 'indexing',
            },
            {
              header: 'submit.progressbar.describe.acknowledgement',
              id: 'acknowledgement',
            },
            {
              header: 'submit.progressbar.describe.identifiers',
              id: 'identifiers',
            },
            {
              header: 'submit.progressbar.describe.references',
              id: 'references',
            },
          ],
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('getSubmissionObjectLinkName', () => {
    it('should return properly submission link name', () => {
      let expected = 'workspaceitems';
      router.setRoute('/workspaceitems/826/edit');
      expect(service.getSubmissionObjectLinkName()).toBe(expected);

      expected = 'workspaceitems';
      router.setRoute('/submit');
      expect(service.getSubmissionObjectLinkName()).toBe(expected);

      expected = 'workflowitems';
      router.setRoute('/workflowitems/826/edit');
      expect(service.getSubmissionObjectLinkName()).toBe(expected);

      expected = 'edititems';
      router.setRoute('/items/9e79b1f2-ae0f-4737-9a4b-990952a8857c/edit');
      expect(service.getSubmissionObjectLinkName()).toBe(expected);
    });
  });

  describe('getSubmissionScope', () => {
    it('should return properly submission scope', () => {
      let expected = SubmissionScopeType.WorkspaceItem;

      router.setRoute('/workspaceitems/826/edit');
      expect(service.getSubmissionScope()).toBe(expected);

      router.setRoute('/submit');
      expect(service.getSubmissionScope()).toBe(expected);

      expected = SubmissionScopeType.WorkflowItem;
      router.setRoute('/workflowitems/826/edit');
      expect(service.getSubmissionScope()).toBe(expected);

    });
  });

  describe('getSubmissionStatus', () => {
    it('should return properly submission status', () => {
      spyOn(service, 'getSubmissionScope').and.returnValue(SubmissionScopeType.WorkspaceItem);
      spyOn((service as any).store, 'select').and.returnValue(hot('-a-b', {
        a: subState,
        b: validSubState,
      }));
      const result = service.getSubmissionStatus('826');
      const expected = cold('cc-d', {
        c: false,
        d: true,
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('getSubmissionSaveProcessingStatus', () => {
    it('should return submission save processing status', () => {
      spyOn((service as any).store, 'select').and.returnValue(hot('-a', {
        a: subState.objects[826],
      }));

      const result = service.getSubmissionSaveProcessingStatus('826');
      const expected = cold('bb', {
        b: false,
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('getSubmissionDepositProcessingStatus', () => {
    it('should return submission deposit processing status', () => {
      spyOn((service as any).store, 'select').and.returnValue(hot('-a', {
        a: subState.objects[826],
      }));

      const result = service.getSubmissionDepositProcessingStatus('826');
      const expected = cold('bb', {
        b: false,
      });

      expect(result).toBeObservable(expected);
    });
  });

  describe('hasUnsavedModification', () => {
    it('should call jsonPatchOperationService hasPendingOperation observable', () => {
      (service as any).jsonPatchOperationService.hasPendingOperations = jasmine.createSpy('hasPendingOperations')
        .and.returnValue(of(true));

      scheduler = getTestScheduler();
      scheduler.schedule(() => service.hasUnsavedModification());
      scheduler.flush();

      expect((service as any).jsonPatchOperationService.hasPendingOperations).toHaveBeenCalledWith('sections');

    });
  });

  describe('isSectionHidden', () => {
    it('should return true/false when section is hidden/visible', () => {
      spyOn(service, 'getSubmissionScope').and.returnValue(SubmissionScopeType.WorkspaceItem);
      let section: any = {
        config: '',
        header: '',
        mandatory: true,
        sectionType: 'collection' as any,
        visibility: {
          submission: SubmissionVisibilityValue.Hidden,
        },
        collapsed: false,
        enabled: true,
        data: {},
        errorsToShow: [],
        serverValidationErrors: [],
        isLoading: false,
        isValid: false,
      };
      expect((service as  any).isSectionHidden(section)).toBeTruthy();

      section = {
        header: 'submit.progressbar.describe.keyinformation',
        config: 'https://rest.api/dspace-spring-rest/api/config/submissionforms/keyinformation',
        mandatory: true,
        sectionType: 'submission-form',
        collapsed: false,
        enabled: true,
        data: {},
        errorsToShow: [],
        serverValidationErrors: [],
        isLoading: false,
        isValid: false,
      };
      expect((service as  any).isSectionHidden(section)).toBeFalsy();
    });
  });

  describe('isSubmissionLoading', () => {
    it('should return true/false when section is loading/not loading', () => {
      const spy = spyOn(service, 'getSubmissionObject').and.returnValue(of({ isLoading: true }));

      let expected = cold('(b|)', {
        b: true,
      });

      expect(service.isSubmissionLoading(submissionId)).toBeObservable(expected);

      spy.and.returnValue(of({ isLoading: false }));

      expected = cold('(b|)', {
        b: false,
      });

      expect(service.isSubmissionLoading(submissionId)).toBeObservable(expected);
    });
  });

  describe('notifyNewSection', () => {
    it('should return true/false when section is loading/not loading', fakeAsync(() => {
      spyOn((service as any).translate, 'get').and.returnValue(of('test'));

      spyOn((service as any).notificationsService, 'info');

      service.notifyNewSection(submissionId, sectionId);
      flush();

      expect((service as any).notificationsService.info).toHaveBeenCalledWith(null, 'submission.sections.general.metadata-extracted-new-section', null, true);
    }));
  });

  describe('redirectToMyDSpace', () => {
    it('should redirect to MyDspace page', () => {
      scheduler = getTestScheduler();
      const spy = spyOn((service as any).routeService, 'getPreviousUrl');

      spy.and.returnValue(of('/mydspace?configuration=workflow'));
      scheduler.schedule(() => service.redirectToMyDSpace());
      scheduler.flush();

      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith('/mydspace?configuration=workflow');

      spy.and.returnValue(of(''));
      scheduler.schedule(() => service.redirectToMyDSpace());
      scheduler.flush();

      expect((service as any).router.navigate).toHaveBeenCalledWith(['/mydspace']);

      spy.and.returnValue(of('/home'));
      scheduler.schedule(() => service.redirectToMyDSpace());
      scheduler.flush();

      expect((service as any).router.navigate).toHaveBeenCalledWith(['/mydspace']);
    });
  });

  describe('redirectToEditItem', () => {
    it('should redirect to Item page', fakeAsync(() => {
      scheduler = getTestScheduler();

      const itemUuid = 'd62fc60f-e9a5-48e6-973a-90819acf23ae';
      const mockBundle = Object.assign(new Bundle(), {
        _links: {
          self: { href: 'bundle-self-href' },
          bitstreams: { href: 'bundle-bitstreams-href' },
        },
      });
      const mockItem = Object.assign(new Item(), {
        uuid: itemUuid,
        _links: {
          self: { href: 'test-href' },
          bundles: { href: 'test-bundles-href' },
        },
        bundles: cold('a', {
          a: createSuccessfulRemoteDataObject(buildPaginatedList(new PageInfo(), [mockBundle])),
        }),
      });
      let itemSubmissionId = itemUuid + ':FULL';
      spyOn(itemService as any, 'findById').and.returnValue(cold('a', { a: createSuccessfulRemoteDataObject(mockItem) }));
      spyOn(requestServce as any, 'setStaleByHrefSubstring').and.returnValue(cold('a', { a: true }));

      scheduler.schedule(() => service.invalidateCacheAndRedirectToItemPage(itemSubmissionId));
      scheduler.flush();
      tick();

      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith('/items/' + itemUuid, { replaceUrl: true });

      itemSubmissionId = itemUuid;
      scheduler.schedule(() => service.invalidateCacheAndRedirectToItemPage(itemSubmissionId));
      scheduler.flush();
      tick();

      expect((service as any).router.navigateByUrl).toHaveBeenCalledWith('/items/' + itemUuid, { replaceUrl: true });

    }));
  });

  describe('resetAllSubmissionObjects', () => {
    it('should dispatch a new CancelSubmissionFormAction', () => {
      service.resetAllSubmissionObjects();
      const expected = new CancelSubmissionFormAction();

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('resetSubmissionObject', () => {
    it('should dispatch a new ResetSubmissionFormAction', () => {
      service.resetSubmissionObject(
        collectionId,
        submissionId,
        selfUrl,
        submissionDefinition,
        {},
        new Item(),
      )
      ;
      const expected = new ResetSubmissionFormAction(
        collectionId,
        submissionId,
        selfUrl,
        {},
        submissionDefinition,
        new Item(),
      );

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('retrieveSubmission', () => {
    it('should retrieve submission from REST endpoint', () => {
      (service as any).restService.getDataById.and.returnValue(hot('a|', {
        a: mockSubmissionRestResponse,
      }));

      const result = service.retrieveSubmission('826');
      const expected = cold('(b|)', {
        b: jasmine.objectContaining({ payload: mockSubmissionRestResponse[0] }),
      });

      expect(result).toBeObservable(expected);
    });

    it('should catch error from REST endpoint', () => {
      const requestError = new RequestError('Internal Server Error');
      requestError.statusCode = 500;
      const errorResponse = new ErrorResponse(requestError);

      (service as any).restService.getDataById.and.callFake(
        () => observableThrowError(errorResponse),
      );

      service.retrieveSubmission('826').subscribe((r) => {
        const expectedRD = createFailedRemoteDataObject('Internal Server Error',500) as any;
        expect(r.payload).toEqual(expectedRD.payload);
        expect(r.statusCode).toEqual(expectedRD.statusCode);
        expect(r.errorMessage).toEqual(expectedRD.errorMessage);
        expect(r.hasSucceeded).toEqual(expectedRD.hasSucceeded);
      });
    });
  });

  describe('setActiveSection', () => {
    it('should dispatch a new SetActiveSectionAction', () => {
      service.setActiveSection(submissionId, sectionId);
      const expected = new SetActiveSectionAction(submissionId, sectionId);

      expect((service as any).store.dispatch).toHaveBeenCalledWith(expected);
    });
  });

  describe('startAutoSave', () => {

    let environmentAutoSaveTimerOriginalValue;

    beforeEach(() => {
      environmentAutoSaveTimerOriginalValue = environment.submission.autosave.timer;
    });

    it('should start Auto Save', fakeAsync(() => {
      const duration = environment.submission.autosave.timer;

      service.startAutoSave('826');
      const sub = (service as any).timer$.subscribe();

      tick(duration / 2);
      expect((service as any).store.dispatch).not.toHaveBeenCalled();

      tick(duration / 2);
      expect((service as any).store.dispatch).toHaveBeenCalled();

      sub.unsubscribe();
      (service as any).autoSaveSub.unsubscribe();
    }));

    it('should not start Auto Save if timer is 0', fakeAsync(() => {
      environment.submission.autosave.timer = 0;

      service.startAutoSave('826');

      expect((service as any).autoSaveSub).toBeUndefined();
    }));

    afterEach(() => {
      environment.submission.autosave.timer = environmentAutoSaveTimerOriginalValue;
    });

  });

  describe('stopAutoSave', () => {
    it('should stop Auto Save', () => {
      service.startAutoSave('826');
      service.stopAutoSave();

      expect((service as any).autoSaveSub).toBeNull();
    });
  });
});
