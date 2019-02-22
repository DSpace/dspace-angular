import { RegistryMetadataschemasResponseParsingService } from './registry-metadataschemas-response-parsing.service';
import { PageInfo } from '../shared/page-info.model';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { RegistryMetadataschemasSuccessResponse } from '../cache/response.models';

describe('RegistryMetadataschemasResponseParsingService', () => {
  let service: RegistryMetadataschemasResponseParsingService;

  const mockDSOParser = Object.assign({
    processPageInfo: () => new PageInfo()
  }) as DSOResponseParsingService;

  const data = Object.assign({
    payload: {
      _embedded: {
        metadataschemas: [
          {
            id: 1,
            prefix: 'test',
            namespace: 'test namespace'
          },
          {
            id: 2,
            prefix: 'second',
            namespace: 'second test namespace'
          }
        ]
      }
    }
  }) as DSpaceRESTV2Response;

  const emptyData = Object.assign({
    payload: {}
  }) as DSpaceRESTV2Response;

  beforeEach(() => {
    service = new RegistryMetadataschemasResponseParsingService(mockDSOParser);
  });

  it('should parse the data correctly', () => {
    const response = service.parse(null, data);
    expect(response.constructor).toBe(RegistryMetadataschemasSuccessResponse);
  });

  it('should not produce an error and parse the data correctly when the data is empty', () => {
    const response = service.parse(null, emptyData);
    expect(response.constructor).toBe(RegistryMetadataschemasSuccessResponse);
  });
});
