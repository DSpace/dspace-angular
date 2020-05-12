import { BitstreamDataService } from './bitstream-data.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RequestService } from './request.service';
import { Bitstream } from '../shared/bitstream.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { BitstreamFormatDataService } from './bitstream-format-data.service';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { BitstreamFormatSupportLevel } from '../shared/bitstream-format-support-level';
import { PutRequest } from './request.models';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';

describe('BitstreamDataService', () => {
  let service: BitstreamDataService;
  let objectCache: ObjectCacheService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let bitstreamFormatService: BitstreamFormatDataService;
  const bitstreamFormatHref = 'rest-api/bitstreamformats';

  const bitstream = Object.assign(new Bitstream(), {
    uuid: 'fake-bitstream',
    _links: {
      self: { href: 'fake-bitstream-self' }
    }
  });
  const format = Object.assign(new BitstreamFormat(), {
    id: '2',
    shortDescription: 'PNG',
    description: 'Portable Network Graphics',
    supportLevel: BitstreamFormatSupportLevel.Known
  });
  const url = 'fake-bitstream-url';

  beforeEach(() => {
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    requestService = getMockRequestService();
    halService = Object.assign(new HALEndpointServiceStub(url));
    bitstreamFormatService = jasmine.createSpyObj('bistreamFormatService', {
      getBrowseEndpoint: observableOf(bitstreamFormatHref)
    });

    service = new BitstreamDataService(requestService, null, null, null, objectCache, halService, null, null, null, null, bitstreamFormatService);
  });

  describe('when updating the bitstream\'s format', () => {
    beforeEach(() => {
      service.updateFormat(bitstream, format);
    });

    it('should configure a put request', () => {
      expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(PutRequest));
    });
  });
});
