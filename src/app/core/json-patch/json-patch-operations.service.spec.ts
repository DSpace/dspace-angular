import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { of as observableOf } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { RequestService } from '../data/request.service';
import { SubmissionPatchRequest } from '../data/request.models';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { JsonPatchOperationsService } from './json-patch-operations.service';
import { SubmitDataResponseDefinitionObject } from '../shared/submit-data-response-definition.model';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { JsonPatchOperationsEntry, JsonPatchOperationsResourceEntry } from './json-patch-operations.reducer';
import {
  CommitPatchOperationsAction,
  RollbacktPatchOperationsAction,
  StartTransactionPatchOperationsAction
} from './json-patch-operations.actions';
import { RequestEntry } from '../data/request.reducer';

class TestService extends JsonPatchOperationsService<SubmitDataResponseDefinitionObject, SubmissionPatchRequest> {
  protected linkPath = '';
  protected patchRequestConstructor = SubmissionPatchRequest;

  constructor(
    protected requestService: RequestService,
    protected store: Store<CoreState>,
    protected halService: HALEndpointService) {

    super();
  }
}

describe('JsonPatchOperationsService test suite', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let halService: any;
  let store: any;

  const timestamp = 1545994811991;
  const timestampResponse = 1545994811992;
  const mockState = {
    'json/patch': {
      testResourceType: {
        children: {
          testResourceId: {
            body: [
              {
                operation: {
                  op: 'add',
                  path: '/testResourceType/testResourceId/testField',
                  value: ['test']
                },
                timeAdded: timestamp
              },
            ]
          } as JsonPatchOperationsEntry
        },
        transactionStartTime: null,
        commitPending: false
      } as JsonPatchOperationsResourceEntry
    }
  };
  const resourceEndpointURL = 'https://rest.api/endpoint';
  const resourceEndpoint = 'resource';
  const resourceScope = '260';
  const resourceHref = resourceEndpointURL + '/' + resourceEndpoint + '/' + resourceScope;

  const testJsonPatchResourceType = 'testResourceType';
  const testJsonPatchResourceId = 'testResourceId';
  const patchOpBody = [{
    op: 'add',
    path: '/testResourceType/testResourceId/testField',
    value: ['test']
  }];

  const getRequestEntry$ = (successful: boolean) => {
    return observableOf({
      response: { isSuccessful: successful, timeAdded: timestampResponse } as any
    } as RequestEntry)
  };

  function initTestService(): TestService {
    return new TestService(
      requestService,
      store,
      halService
    );

  }

  function getStore() {
    return jasmine.createSpyObj('store', {
      dispatch: {},
      select: observableOf(mockState['json/patch'][testJsonPatchResourceType]),
      pipe: observableOf(true)
    });
  }

  beforeEach(() => {
    store = getStore();
    requestService = getMockRequestService(getRequestEntry$(true));
    rdbService = getMockRemoteDataBuildService();
    scheduler = getTestScheduler();
    halService = new HALEndpointServiceStub(resourceEndpointURL);
    service = initTestService();

    spyOn(Date.prototype, 'getTime').and.callFake(() => {
      return timestamp;
    });
  });

  describe('jsonPatchByResourceType', () => {

    it('should call submitJsonPatchOperations method', () => {
      spyOn((service as any), 'submitJsonPatchOperations').and.callThrough();

      scheduler.schedule(() => service.jsonPatchByResourceType(resourceEndpointURL, resourceScope, testJsonPatchResourceType).subscribe());
      scheduler.flush();

      expect((service as any).submitJsonPatchOperations).toHaveBeenCalled();
    });

    it('should configure a new SubmissionPatchRequest', () => {
      const expected = new SubmissionPatchRequest(requestService.generateRequestId(), resourceHref, patchOpBody);
      scheduler.schedule(() => service.jsonPatchByResourceType(resourceEndpoint, resourceScope, testJsonPatchResourceType).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should dispatch a new StartTransactionPatchOperationsAction', () => {
      const expectedAction = new StartTransactionPatchOperationsAction(testJsonPatchResourceType, undefined, timestamp);
      scheduler.schedule(() => service.jsonPatchByResourceType(resourceEndpoint, resourceScope, testJsonPatchResourceType).subscribe());
      scheduler.flush();

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    describe('when request is successful', () => {
      it('should dispatch a new CommitPatchOperationsAction', () => {
        const expectedAction = new CommitPatchOperationsAction(testJsonPatchResourceType, undefined);
        scheduler.schedule(() => service.jsonPatchByResourceType(resourceEndpoint, resourceScope, testJsonPatchResourceType).subscribe());
        scheduler.flush();

        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });
    });

    describe('when request is not successful', () => {
      beforeEach(() => {
        store = getStore();
        requestService = getMockRequestService(getRequestEntry$(false));
        rdbService = getMockRemoteDataBuildService();
        scheduler = getTestScheduler();
        halService = new HALEndpointServiceStub(resourceEndpointURL);
        service = initTestService();

        store.select.and.returnValue(observableOf(mockState['json/patch'][testJsonPatchResourceType]));
        store.dispatch.and.callThrough();
      });

      it('should dispatch a new RollbacktPatchOperationsAction', () => {

        const expectedAction = new RollbacktPatchOperationsAction(testJsonPatchResourceType, undefined);
        scheduler.schedule(() => service.jsonPatchByResourceType(resourceEndpoint, resourceScope, testJsonPatchResourceType)
          .pipe(catchError(() => observableOf({})))
          .subscribe());
        scheduler.flush();

        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });
    });
  });

  describe('jsonPatchByResourceID', () => {

    it('should call submitJsonPatchOperations method', () => {
      spyOn((service as any), 'submitJsonPatchOperations').and.callThrough();

      scheduler.schedule(() => service.jsonPatchByResourceID(resourceEndpointURL, resourceScope, testJsonPatchResourceType, testJsonPatchResourceId).subscribe());
      scheduler.flush();

      expect((service as any).submitJsonPatchOperations).toHaveBeenCalled();
    });

    it('should configure a new SubmissionPatchRequest', () => {
      const expected = new SubmissionPatchRequest(requestService.generateRequestId(), resourceHref, patchOpBody);
      scheduler.schedule(() => service.jsonPatchByResourceID(resourceEndpoint, resourceScope, testJsonPatchResourceType, testJsonPatchResourceId).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should dispatch a new StartTransactionPatchOperationsAction', () => {
      const expectedAction = new StartTransactionPatchOperationsAction(testJsonPatchResourceType, testJsonPatchResourceId, timestamp);
      scheduler.schedule(() => service.jsonPatchByResourceID(resourceEndpoint, resourceScope, testJsonPatchResourceType, testJsonPatchResourceId).subscribe());
      scheduler.flush();

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    describe('when request is successful', () => {
      it('should dispatch a new CommitPatchOperationsAction', () => {
        const expectedAction = new CommitPatchOperationsAction(testJsonPatchResourceType, testJsonPatchResourceId);
        scheduler.schedule(() => service.jsonPatchByResourceID(resourceEndpoint, resourceScope, testJsonPatchResourceType, testJsonPatchResourceId).subscribe());
        scheduler.flush();

        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });
    });

    describe('when request is not successful', () => {
      beforeEach(() => {
        store = getStore();
        requestService = getMockRequestService(getRequestEntry$(false));
        rdbService = getMockRemoteDataBuildService();
        scheduler = getTestScheduler();
        halService = new HALEndpointServiceStub(resourceEndpointURL);
        service = initTestService();

        store.select.and.returnValue(observableOf(mockState['json/patch'][testJsonPatchResourceType]));
        store.dispatch.and.callThrough();
      });

      it('should dispatch a new RollbacktPatchOperationsAction', () => {

        const expectedAction = new RollbacktPatchOperationsAction(testJsonPatchResourceType, testJsonPatchResourceId);
        scheduler.schedule(() => service.jsonPatchByResourceID(resourceEndpoint, resourceScope, testJsonPatchResourceType, testJsonPatchResourceId)
          .pipe(catchError(() => observableOf({})))
          .subscribe());
        scheduler.flush();

        expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
      });
    });
  });

});
