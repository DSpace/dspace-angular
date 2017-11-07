import { BrowseResponseParsingService } from './browse-response-parsing.service';
import { BrowseEndpointRequest } from './request.models';
import { BrowseSuccessResponse, ErrorResponse } from '../cache/response-cache.models';
import { BrowseDefinition } from '../shared/browse-definition.model';

describe('BrowseResponseParsingService', () => {
  let service: BrowseResponseParsingService;

  beforeEach(() => {
    service = new BrowseResponseParsingService();
  });

  describe('parse', () => {
    const validRequest = new BrowseEndpointRequest('https://rest.api/discover/browses');

    const validResponse = {
      payload: {
        _embedded: {
          browses: [{
            metadataBrowse: false,
            sortOptions: [{ name: 'title', metadata: 'dc.title' }, {
              name: 'dateissued',
              metadata: 'dc.date.issued'
            }, { name: 'dateaccessioned', metadata: 'dc.date.accessioned' }],
            order: 'ASC',
            type: 'browse',
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
            type: 'browse',
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
      }, statusCode: '200'
    };

    const invalidResponse1 = {
      payload: {
        _embedded: {
          browse: {
            metadataBrowse: false,
            sortOptions: [{ name: 'title', metadata: 'dc.title' }, {
              name: 'dateissued',
              metadata: 'dc.date.issued'
            }, { name: 'dateaccessioned', metadata: 'dc.date.accessioned' }],
            order: 'ASC',
            type: 'browse',
            metadata: ['dc.date.issued'],
            _links: {
              self: { href: 'https://rest.api/discover/browses/dateissued' },
              items: { href: 'https://rest.api/discover/browses/dateissued/items' }
            }
          }
        },
        _links: { self: { href: 'https://rest.api/discover/browses' } },
        page: { size: 20, totalElements: 2, totalPages: 1, number: 0 }
      }, statusCode: '200'
    };

    const invalidResponse2 = {
      payload: {
        browses: [{}, {}],
        _links: { self: { href: 'https://rest.api/discover/browses' } },
        page: { size: 20, totalElements: 2, totalPages: 1, number: 0 }
      }, statusCode: '200'
    };

    const invalidResponse3 = {
      payload: {
        _links: { self: { href: 'https://rest.api/discover/browses' } },
        page: { size: 20, totalElements: 2, totalPages: 1, number: 0 }
      }, statusCode: '500'
    };

    const definitions = [
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
        type: 'browse',
        metadataKeys: [
          'dc.date.issued'
        ],
        _links: { }
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
        type: 'browse',
        metadataKeys: [
          'dc.contributor.*',
          'dc.creator'
        ],
        _links: { }
      })
    ];

    it('should return a BrowseSuccessResponse if data contains a valid browse endpoint response', () => {
      const response = service.parse(validRequest, validResponse);
      expect(response.constructor).toBe(BrowseSuccessResponse);
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

    it('should return a BrowseSuccessResponse with the BrowseDefinitions in data', () => {
      const response = service.parse(validRequest, validResponse);
      expect((response as BrowseSuccessResponse).browseDefinitions).toEqual(definitions);
    });

  });
});
