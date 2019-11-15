import { CollectionDataService } from './collection-data.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from './request.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { GetRequest } from './request.models';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

describe('CollectionDataService', () => {
  let service: CollectionDataService;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let rdbService: RemoteDataBuildService;

  const url = 'fake-collections-url';

  beforeEach(() => {
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));
    rdbService = jasmine.createSpyObj('rdbService', {
      buildList: jasmine.createSpy('buildList')
    });

    service = new CollectionDataService(requestService, rdbService, null, null, null, objectCache, halService, null, null, null);
  });

  describe('getMappedItems', () => {
    let result;

    beforeEach(() => {
      result = service.getMappedItems('collection-id');
    });

    it('should configure a GET request', () => {
      expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(GetRequest));
    });
  });

});
