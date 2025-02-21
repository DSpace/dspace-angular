import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { RemoteDataBuildService } from '../cache';
import { ObjectCacheService } from '../cache';
import { FindListOptions } from '../data';
import { GetRequest } from '../data';
import { RequestService } from '../data';
import { getMockRemoteDataBuildService } from '../mocks';
import { getMockRequestService } from '../mocks';
import { HALEndpointService } from '../shared';
import { HALEndpointServiceStub } from '../utilities';
import { ConfigDataService } from '@dspace/core';

const LINK_NAME = 'test';
const BROWSE = 'search/findByCollection';

class TestService extends ConfigDataService {
  protected linkPath = LINK_NAME;
  protected browseEndpoint = BROWSE;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
  ) {
    super(BROWSE, requestService, rdbService, objectCache, halService);
  }
}

describe('ConfigDataService', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let halService: any;

  const findOptions: FindListOptions = new FindListOptions();

  const scopeName = 'traditional';
  const scopeID = 'd9d30c0c-69b7-4369-8397-ca67c888974d';
  const configEndpoint = 'https://rest.api/config';
  const serviceEndpoint = `${configEndpoint}/${LINK_NAME}`;
  const scopedEndpoint = `${serviceEndpoint}/${scopeName}`;
  const searchEndpoint = `${serviceEndpoint}/${BROWSE}?uuid=${scopeID}`;

  function initTestService(): TestService {
    return new TestService(
      requestService,
      rdbService,
      null,
      halService,
    );
  }

  beforeEach(() => {
    scheduler = getTestScheduler();
    requestService = getMockRequestService();
    rdbService = getMockRemoteDataBuildService();
    halService = new HALEndpointServiceStub(configEndpoint);
    service = initTestService();
  });

  describe('findByHref', () => {

    it('should send a new GetRequest', () => {
      const expected = new GetRequest(requestService.generateRequestId(), scopedEndpoint);
      scheduler.schedule(() => service.findByHref(scopedEndpoint).subscribe());
      scheduler.flush();

      expect(requestService.send).toHaveBeenCalledWith(expected, true);
    });
  });
});
