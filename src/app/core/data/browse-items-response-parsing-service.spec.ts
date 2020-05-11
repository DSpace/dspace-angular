import { getMockObjectCacheService } from '../../shared/mocks/object-cache.service.mock';
import { ErrorResponse, GenericSuccessResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { BrowseEntriesResponseParsingService } from './browse-entries-response-parsing.service';
import { BrowseEntriesRequest, BrowseItemsRequest } from './request.models';
import { BrowseItemsResponseParsingService } from './browse-items-response-parsing-service';

describe('BrowseItemsResponseParsingService', () => {
  let service: BrowseItemsResponseParsingService;

  beforeEach(() => {
    service = new BrowseItemsResponseParsingService(getMockObjectCacheService());
  });

  describe('parse', () => {
    const request = new BrowseItemsRequest('client/f5b4ccb8-fbb0-4548-b558-f234d9fdfad6', 'https://rest.api/discover/browses/author/items');

    const validResponse = {
      payload: {
        _embedded: {
          items: [
            {
              id: 'd7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7',
              uuid: 'd7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7',
              name: 'Development of Local Supply Chain : A Critical Link for Concentrated Solar Power in India',
              handle: '10986/17472',
              metadata: {
                'dc.creator': [
                  {
                    value: 'World Bank',
                    language: null
                  }
                ]
              },
              inArchive: true,
              discoverable: true,
              withdrawn: false,
              lastModified: '2018-05-25T09:32:58.005+0000',
              type: 'item',
              _links: {
                bitstreams: {
                  href: 'https://dspace7-internal.atmire.com/rest/api/core/items/d7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7/bitstreams'
                },
                owningCollection: {
                  href: 'https://dspace7-internal.atmire.com/rest/api/core/items/d7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7/owningCollection'
                },
                templateItemOf: {
                  href: 'https://dspace7-internal.atmire.com/rest/api/core/items/d7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7/templateItemOf'
                },
                self: {
                  href: 'https://dspace7-internal.atmire.com/rest/api/core/items/d7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7'
                }
              }
            },
            {
              id: '27c6f976-257c-4ad0-a0ef-c5e34ffe4d5b',
              uuid: '27c6f976-257c-4ad0-a0ef-c5e34ffe4d5b',
              name: 'Development of Local Supply Chain : The Missing Link for Concentrated Solar Power Projects in India',
              handle: '10986/17475',
              metadata: {
                'dc.creator': [
                  {
                    value: 'World Bank',
                    language: null
                  }
                ]
              },
              inArchive: true,
              discoverable: true,
              withdrawn: false,
              lastModified: '2018-05-25T09:33:42.526+0000',
              type: 'item',
              _links: {
                bitstreams: {
                  href: 'https://dspace7-internal.atmire.com/rest/api/core/items/27c6f976-257c-4ad0-a0ef-c5e34ffe4d5b/bitstreams'
                },
                owningCollection: {
                  href: 'https://dspace7-internal.atmire.com/rest/api/core/items/27c6f976-257c-4ad0-a0ef-c5e34ffe4d5b/owningCollection'
                },
                templateItemOf: {
                  href: 'https://dspace7-internal.atmire.com/rest/api/core/items/27c6f976-257c-4ad0-a0ef-c5e34ffe4d5b/templateItemOf'
                },
                self: {
                  href: 'https://dspace7-internal.atmire.com/rest/api/core/items/27c6f976-257c-4ad0-a0ef-c5e34ffe4d5b'
                }
              }
            }
          ]
        },
        _links: {
          first: {
            href: 'https://dspace7-internal.atmire.com/rest/api/discover/browses/author/items?page=0&size=2'
          },
          self: {
            href: 'https://dspace7-internal.atmire.com/rest/api/discover/browses/author/items'
          },
          next: {
            href: 'https://dspace7-internal.atmire.com/rest/api/discover/browses/author/items?page=1&size=2'
          },
          last: {
            href: 'https://dspace7-internal.atmire.com/rest/api/discover/browses/author/items?page=7&size=2'
          }
        },
        page: {
          size: 2,
          totalElements: 16,
          totalPages: 8,
          number: 0
        }
      },
      statusCode: 200,
      statusText: 'OK'
    } as DSpaceRESTV2Response;

    const invalidResponseNotAList = {
      payload: {
        id: 'd7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7',
        uuid: 'd7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7',
        name: 'Development of Local Supply Chain : A Critical Link for Concentrated Solar Power in India',
        handle: '10986/17472',
        metadata: {
          'dc.creator': [
            {
              value: 'World Bank',
              language: null
            }
          ]
        },
        inArchive: true,
        discoverable: true,
        withdrawn: false,
        lastModified: '2018-05-25T09:32:58.005+0000',
        type: 'item',
        _links: {
          bitstreams: {
            href: 'https://dspace7-internal.atmire.com/rest/api/core/items/d7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7/bitstreams'
          },
          owningCollection: {
            href: 'https://dspace7-internal.atmire.com/rest/api/core/items/d7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7/owningCollection'
          },
          templateItemOf: {
            href: 'https://dspace7-internal.atmire.com/rest/api/core/items/d7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7/templateItemOf'
          },
          self: {
            href: 'https://dspace7-internal.atmire.com/rest/api/core/items/d7b6bc6f-ff6c-444a-a0d3-0cd9b68043e7'
          }
        }
      },
      statusCode: 200,
      statusText: 'OK'
    } as DSpaceRESTV2Response;

    const invalidResponseStatusCode = {
      payload: {}, statusCode: 500, statusText: 'Internal Server Error'
    } as DSpaceRESTV2Response;

    it('should return a GenericSuccessResponse if data contains a valid browse items response', () => {
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
