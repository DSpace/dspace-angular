import { Store } from '@ngrx/store';

import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { ResponseCacheService } from '../cache/response-cache.service';
import { CoreState } from '../core.reducers';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { SubmissionJsonPatchOperationsService } from './submission-json-patch-operations.service';
import { RequestService } from '../data/request.service';
import { SubmissionPatchRequest } from '../data/request.models';

describe('SubmissionJsonPatchOperationsService', () => {
  let scheduler: TestScheduler;
  let service: SubmissionJsonPatchOperationsService;
  const requestService = {} as RequestService;
  const responseCache = {} as ResponseCacheService;
  const store = {} as Store<CoreState>;
  const halEndpointService = {} as HALEndpointService;

  function initTestService() {
    return new SubmissionJsonPatchOperationsService(
      responseCache,
      requestService,
      store,
      halEndpointService
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();
    service = initTestService();
  });

  it('should instantiate SubmissionJsonPatchOperationsService properly', () => {
    expect(service).toBeDefined();
    expect((service as any).patchRequestConstructor).toEqual(SubmissionPatchRequest);
  });

});
