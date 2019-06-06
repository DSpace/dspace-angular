import { FilteredDiscoveryPageResponseParsingService } from './filtered-discovery-page-response-parsing.service';
import { getMockObjectCacheService } from '../../shared/mocks/mock-object-cache.service';
import { GenericConstructor } from '../shared/generic-constructor';
import { ResponseParsingService } from './parsing.service';
import { GetRequest } from './request.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { FilteredDiscoveryQueryResponse } from '../cache/response.models';

describe('FilteredDiscoveryPageResponseParsingService', () => {
  let service: FilteredDiscoveryPageResponseParsingService;

  beforeEach(() => {
    service = new FilteredDiscoveryPageResponseParsingService(undefined, getMockObjectCacheService());
  });

  describe('parse', () => {
    const request = Object.assign(new GetRequest('client/f5b4ccb8-fbb0-4548-b558-f234d9fdfad6', 'https://rest.api/path'), {
      getResponseParser(): GenericConstructor<ResponseParsingService> {
        return FilteredDiscoveryPageResponseParsingService;
      }
    });

    const mockResponse = {
      payload: {
        'discovery-query': 'query'
      },
      statusCode: 200,
      statusText: 'OK'
    } as DSpaceRESTV2Response;

    it('should return a FilteredDiscoveryQueryResponse containing the correct query', () => {
      const response = service.parse(request, mockResponse);
      expect((response as FilteredDiscoveryQueryResponse).filterQuery).toBe(mockResponse.payload['discovery-query']);
    })
  });
});
