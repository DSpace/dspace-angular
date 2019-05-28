import { PageInfo } from '../shared/page-info.model';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  RegistryBitstreamformatsSuccessResponse
} from '../cache/response.models';
import { RegistryBitstreamformatsResponseParsingService } from './registry-bitstreamformats-response-parsing.service';

describe('RegistryBitstreamformatsResponseParsingService', () => {
  let service: RegistryBitstreamformatsResponseParsingService;

  const mockDSOParser = Object.assign({
    processPageInfo: () => new PageInfo()
  }) as DSOResponseParsingService;

  const data = Object.assign({
    payload: {
      _embedded: {
        bitstreamformats: [
          {
            uuid: 'uuid-1',
            description: 'a description'
          },
          {
            uuid: 'uuid-2',
            description: 'another description'
          },
        ]
      }
    }
  }) as DSpaceRESTV2Response;

  beforeEach(() => {
    service = new RegistryBitstreamformatsResponseParsingService(mockDSOParser);
  });

  it('should parse the data correctly', () => {
    const response = service.parse(null, data);
    expect(response.constructor).toBe(RegistryBitstreamformatsSuccessResponse);
  });
});
