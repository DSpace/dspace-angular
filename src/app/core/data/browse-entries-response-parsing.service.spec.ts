import { getMockObjectCacheService } from '../../shared/mocks/object-cache.service.mock';
import { ErrorResponse, GenericSuccessResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { BrowseEntriesResponseParsingService } from './browse-entries-response-parsing.service';
import { BrowseEntriesRequest } from './request.models';

describe('BrowseEntriesResponseParsingService', () => {
  let service: BrowseEntriesResponseParsingService;

  beforeEach(() => {
    service = new BrowseEntriesResponseParsingService(getMockObjectCacheService());
  });

  describe('parse', () => {
    const request = new BrowseEntriesRequest('client/f5b4ccb8-fbb0-4548-b558-f234d9fdfad6', 'https://rest.api/discover/browses/author/entries');

    const validResponse = {
      payload: {
        _embedded: {
          browseEntries: [
            {
              authority: null,
              value: 'Arulmozhiyal, Ramaswamy',
              valueLang: null,
              count: 1,
              type: 'browseEntry',
              _links: {
                items: {
                  href: 'https://rest.api/discover/browses/author/items?filterValue=Arulmozhiyal, Ramaswamy'
                }
              }
            },
            {
              authority: null,
              value: 'Bastida-Jumilla, Ma Consuelo',
              valueLang: null,
              count: 1,
              type: 'browseEntry',
              _links: {
                items: {
                  href: 'https://rest.api/discover/browses/author/items?filterValue=Bastida-Jumilla, Ma Consuelo'
                }
              }
            },
            {
              authority: null,
              value: 'Cao, Binggang',
              valueLang: null,
              count: 1,
              type: 'browseEntry',
              _links: {
                items: {
                  href: 'https://rest.api/discover/browses/author/items?filterValue=Cao, Binggang'
                }
              }
            },
            {
              authority: null,
              value: 'Castelli, Mauro',
              valueLang: null,
              count: 1,
              type: 'browseEntry',
              _links: {
                items: {
                  href: 'https://rest.api/discover/browses/author/items?filterValue=Castelli, Mauro'
                }
              }
            },
            {
              authority: null,
              value: 'Cat, Lily',
              valueLang: null,
              count: 1,
              type: 'browseEntry',
              _links: {
                items: {
                  href: 'https://rest.api/discover/browses/author/items?filterValue=Cat, Lily'
                }
              }
            }
          ]
        },
        _links: {
          first: {
            href: 'https://rest.api/discover/browses/author/entries?page=0&size=5'
          },
          self: {
            href: 'https://rest.api/discover/browses/author/entries'
          },
          next: {
            href: 'https://rest.api/discover/browses/author/entries?page=1&size=5'
          },
          last: {
            href: 'https://rest.api/discover/browses/author/entries?page=9&size=5'
          }
        },
        page: {
          size: 5,
          totalElements: 50,
          totalPages: 10,
          number: 0
        }
      },
      statusCode: 200,
      statusText: 'OK'
    } as DSpaceRESTV2Response;

    const invalidResponseNotAList = {
      statusCode: 200,
      statusText: 'OK'
    } as DSpaceRESTV2Response;

    const invalidResponseStatusCode = {
      payload: {}, statusCode: 500, statusText: 'Internal Server Error'
    } as DSpaceRESTV2Response;

    it('should return a GenericSuccessResponse if data contains a valid browse entries response', () => {
      const response = service.parse(request, validResponse);
      expect(response.constructor).toBe(GenericSuccessResponse);
    });

    it('should return an ErrorResponse if data contains an invalid browse entries response', () => {
      const response = service.parse(request, invalidResponseNotAList);
      expect(response.constructor).toBe(ErrorResponse);
    });

    it('should return an ErrorResponse if data contains a statuscode other than 200', () => {
      const response = service.parse(request, invalidResponseStatusCode);
      expect(response.constructor).toBe(ErrorResponse);
    });

  });
});
