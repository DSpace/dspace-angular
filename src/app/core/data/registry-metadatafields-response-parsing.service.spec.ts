import { PageInfo } from '../shared/page-info.model';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import {
  RegistryMetadatafieldsSuccessResponse
} from '../cache/response.models';
import { RegistryMetadatafieldsResponseParsingService } from './registry-metadatafields-response-parsing.service';

describe('RegistryMetadatafieldsResponseParsingService', () => {
  let service: RegistryMetadatafieldsResponseParsingService;

  const mockDSOParser = Object.assign({
    processPageInfo: () => new PageInfo()
  }) as DSOResponseParsingService;

  const data = Object.assign({
    payload: {
      _embedded: {
        metadatafields: [
          {
            id: 1,
            element: 'element',
            qualifier: 'qualifier',
            scopeNote: 'a scope note',
            _embedded: {
              schema: {
                id: 1,
                prefix: 'test',
                namespace: 'test namespace'
              }
            }
          },
          {
            id: 2,
            element: 'secondelement',
            qualifier: 'secondqualifier',
            scopeNote: 'a second scope note',
            _embedded: {
              schema: {
                id: 1,
                prefix: 'test',
                namespace: 'test namespace'
              }
            }
          },
        ]
      }
    }
  }) as DSpaceRESTV2Response;

  const emptyData = Object.assign({
    payload: {}
  }) as DSpaceRESTV2Response;

  beforeEach(() => {
    service = new RegistryMetadatafieldsResponseParsingService(mockDSOParser);
  });

  it('should parse the data correctly', () => {
    const response = service.parse(null, data);
    expect(response.constructor).toBe(RegistryMetadatafieldsSuccessResponse);
  });

  it('should not produce an error and parse the data correctly when the data is empty', () => {
    const response = service.parse(null, emptyData);
    expect(response.constructor).toBe(RegistryMetadatafieldsSuccessResponse);
  });
});
