import { ErrorResponse, GenericSuccessResponse } from '../cache/response.models';
import { DSpaceRESTV2Response } from '../dspace-rest-v2/dspace-rest-v2-response.model';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { BrowseResponseParsingService } from './browse-response-parsing.service';
import { BrowseEndpointRequest } from './request.models';

describe('BrowseResponseParsingService', () => {
  let service: BrowseResponseParsingService;

  beforeEach(() => {
    service = new BrowseResponseParsingService();
  });
  let validRequest;
  let validResponse;
  let invalidResponse1;
  let invalidResponse2;
  let invalidResponse3;
  let definitions;

  describe('parse', () => {
    beforeEach(() => {
      validRequest = new BrowseEndpointRequest('client/b186e8ce-e99c-4183-bc9a-42b4821bdb78', 'https://rest.api/discover/browses');

      validResponse = {
        payload: {
          _embedded: {
            browses: [{
              metadataBrowse: false,
              sortOptions: [{ name: 'title', metadata: 'dc.title' }, {
                name: 'dateissued',
                metadata: 'dc.date.issued'
              }, { name: 'dateaccessioned', metadata: 'dc.date.accessioned' }],
              order: 'ASC',
              metadata: ['dc.date.issued'],
              _links: {
                self: { href: 'https://rest.api/discover/browses/dateissued' },
                items: { href: 'https://rest.api/discover/browses/dateissued/items' }
              }
            }, {
              metadataBrowse: true,
              sortOptions: [{ name: 'title', metadata: 'dc.title' }, {
                name: 'dateissued',
                metadata: 'dc.date.issued'
              }, { name: 'dateaccessioned', metadata: 'dc.date.accessioned' }],
              order: 'ASC',
              metadata: ['dc.contributor.*', 'dc.creator'],
              _links: {
                self: { href: 'https://rest.api/discover/browses/author' },
                entries: { href: 'https://rest.api/discover/browses/author/entries' },
                items: { href: 'https://rest.api/discover/browses/author/items' }
              }
            }]
          },
          _links: { self: { href: 'https://rest.api/discover/browses' } },
          page: { size: 20, totalElements: 2, totalPages: 1, number: 0 }
        }, statusCode: 200, statusText: 'OK'
      } as DSpaceRESTV2Response;

      invalidResponse1 = {
        payload: {
          _embedded: {
            browse: {
              metadataBrowse: false,
              sortOptions: [{ name: 'title', metadata: 'dc.title' }, {
                name: 'dateissued',
                metadata: 'dc.date.issued'
              }, { name: 'dateaccessioned', metadata: 'dc.date.accessioned' }],
              order: 'ASC',
              metadata: ['dc.date.issued'],
              _links: {
                self: { href: 'https://rest.api/discover/browses/dateissued' },
                items: { href: 'https://rest.api/discover/browses/dateissued/items' }
              }
            }
          },
          _links: { self: { href: 'https://rest.api/discover/browses' } },
          page: { size: 20, totalElements: 2, totalPages: 1, number: 0 }
        }, statusCode: 200, statusText: 'OK'
      } as DSpaceRESTV2Response;

      invalidResponse2 = {
        payload: {
          _links: { self: { href: 'https://rest.api/discover/browses' } },
          page: { size: 20, totalElements: 2, totalPages: 1, number: 0 }
        }, statusCode: 200, statusText: 'OK'
      } as DSpaceRESTV2Response;

      invalidResponse3 = {
        payload: {
          _links: { self: { href: 'https://rest.api/discover/browses' } },
          page: { size: 20, totalElements: 2, totalPages: 1, number: 0 }
        }, statusCode: 500, statusText: 'Internal Server Error'
      } as DSpaceRESTV2Response;

      definitions = [
        Object.assign(new BrowseDefinition(), {
          metadataBrowse: false,
          sortOptions: [
            {
              name: 'title',
              metadata: 'dc.title'
            },
            {
              name: 'dateissued',
              metadata: 'dc.date.issued'
            },
            {
              name: 'dateaccessioned',
              metadata: 'dc.date.accessioned'
            }
          ],
          defaultSortOrder: 'ASC',
          metadataKeys: [
            'dc.date.issued'
          ],
          _links: {
            self: { href: 'https://rest.api/discover/browses/dateissued' },
            items: { href: 'https://rest.api/discover/browses/dateissued/items' }
          }
        }),
        Object.assign(new BrowseDefinition(), {
          metadataBrowse: true,
          sortOptions: [
            {
              name: 'title',
              metadata: 'dc.title'
            },
            {
              name: 'dateissued',
              metadata: 'dc.date.issued'
            },
            {
              name: 'dateaccessioned',
              metadata: 'dc.date.accessioned'
            }
          ],
          defaultSortOrder: 'ASC',
          metadataKeys: [
            'dc.contributor.*',
            'dc.creator'
          ],
          _links: {
            self: { href: 'https://rest.api/discover/browses/author' },
            entries: { href: 'https://rest.api/discover/browses/author/entries' },
            items: { href: 'https://rest.api/discover/browses/author/items' }
          }
        })
      ];
    });
    it('should return a GenericSuccessResponse if data contains a valid browse endpoint response', () => {
      const response = service.parse(validRequest, validResponse);
      expect(response.constructor).toBe(GenericSuccessResponse);
    });

    it('should return an ErrorResponse if data contains an invalid browse endpoint response', () => {
      const response1 = service.parse(validRequest, invalidResponse1);
      const response2 = service.parse(validRequest, invalidResponse2);
      expect(response1.constructor).toBe(ErrorResponse);
      expect(response2.constructor).toBe(ErrorResponse);
    });

    it('should return an ErrorResponse if data contains a statuscode other than 200', () => {
      const response = service.parse(validRequest, invalidResponse3);
      expect(response.constructor).toBe(ErrorResponse);
    });

    it('should return a GenericSuccessResponse with the BrowseDefinitions in data', () => {
      const response = service.parse(validRequest, validResponse);
      expect((response as GenericSuccessResponse<BrowseDefinition[]>).payload).toEqual(definitions);
    });
  });
});
