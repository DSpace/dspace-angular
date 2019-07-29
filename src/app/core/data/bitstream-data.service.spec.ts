import { BitstreamDataService } from './bitstream-data.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RequestService } from './request.service';
import { Bitstream } from '../shared/bitstream.model';
import { Observable } from 'rxjs/internal/Observable';
import { RestResponse } from '../cache/response.models';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { HALEndpointService } from '../shared/hal-endpoint.service';

describe('BitstreamDataService', () => {
  let service: BitstreamDataService;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;

  const bitstream = Object.assign(new Bitstream(), {
    uuid: 'fake-bitstream',
    self: 'fake-bitstream-self'
  });
  const url = 'fake-bitstream-url';

  beforeEach(() => {
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));

    service = new BitstreamDataService(requestService, null, null, null, null, objectCache, halService, null, null, null);
  });

  describe('when deleting a bitstream', () => {
    let response$: Observable<RestResponse>;

    beforeEach(() => {
      response$ = service.deleteAndReturnResponse(bitstream);
    });

    it('should de-cache the bitstream\'s object cache', () => {
      expect(objectCache.remove).toHaveBeenCalledWith(bitstream.self);
    });

    it('should de-cache the bitstream\'s request cache', () => {
      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(bitstream.self);
    });
  });
});
