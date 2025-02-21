import { Store } from '@ngrx/store';
import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { RemoteDataBuildService } from '../cache';
import { CoreState } from '@dspace/core';
import { SubmissionPatchRequest } from '../data';
import { RequestService } from '../data';
import { HALEndpointService } from '../shared';
import { SubmissionJsonPatchOperationsService } from '@dspace/core';

describe('SubmissionJsonPatchOperationsService', () => {
  let scheduler: TestScheduler;
  let service: SubmissionJsonPatchOperationsService;
  const requestService = {} as RequestService;
  const store = {} as Store<CoreState>;
  const rdbService = {} as RemoteDataBuildService;
  const halEndpointService = {} as HALEndpointService;

  const uuid = '91ecbeda-99fe-42ac-9430-b9b75af56f78';
  const href = 'https://rest.api/some/self/link?with=maybe&a=few&other=parameters';

  function initTestService() {
    return new SubmissionJsonPatchOperationsService(
      requestService,
      store,
      rdbService,
      halEndpointService,
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

  describe(`getRequestInstance`, () => {
    it(`should add a parameter to embed the item to the request URL`, () => {
      const result = (service as any).getRequestInstance(uuid, href);
      const resultURL = new URL(result.href);
      expect(resultURL.searchParams.get('embed')).toEqual('item');

      // if we delete the embed item param, it should be identical to the original url
      resultURL.searchParams.delete('embed', 'item');
      expect(href).toEqual(resultURL.toString());
    });
  });

});
