import { Store } from '@ngrx/store';
import { GlobalConfig } from '../../../config/global-config.interface';

import { ObjectCacheService } from '../cache/object-cache.service';
import { ErrorResponse, IntegrationSuccessResponse } from '../cache/response.models';
import { CoreState } from '../core.reducers';
import { PaginatedList } from '../data/paginated-list';
import { IntegrationRequest } from '../data/request.models';
import { PageInfo } from '../shared/page-info.model';
import { IntegrationResponseParsingService } from './integration-response-parsing.service';
import { AuthorityValue } from './models/authority.value';

describe('IntegrationResponseParsingService', () => {
  let service: IntegrationResponseParsingService;

  const EnvConfig = {} as GlobalConfig;
  const store = {} as Store<CoreState>;
  const objectCacheService = new ObjectCacheService(store, undefined);
  const name = 'type';
  const metadata = 'dc.type';
  const query = '';
  const uuid = 'd9d30c0c-69b7-4369-8397-ca67c888974d';
  const integrationEndpoint = 'https://rest.api/integration/authorities';
  const entriesEndpoint = `${integrationEndpoint}/${name}/entries?query=${query}&metadata=${metadata}&uuid=${uuid}`;
  let validRequest;

  let validResponse;

  let invalidResponse1;
  let invalidResponse2;
  let pageInfo;
  let definitions;

  function initVars() {
    pageInfo = Object.assign(new PageInfo(), {
      elementsPerPage: 5,
      totalElements: 5,
      totalPages: 1,
      currentPage: 1,
      _links: {
        self: { href: 'https://rest.api/integration/authorities/type/entries' }
      }
    });
    definitions = new PaginatedList(pageInfo, [
      Object.assign(new AuthorityValue(), {
        type: 'authority',
        display: 'One',
        id: 'One',
        otherInformation: undefined,
        value: 'One'
      }),
      Object.assign(new AuthorityValue(), {
        type: 'authority',
        display: 'Two',
        id: 'Two',
        otherInformation: undefined,
        value: 'Two'
      }),
      Object.assign(new AuthorityValue(), {
        type: 'authority',
        display: 'Three',
        id: 'Three',
        otherInformation: undefined,
        value: 'Three'
      }),
      Object.assign(new AuthorityValue(), {
        type: 'authority',
        display: 'Four',
        id: 'Four',
        otherInformation: undefined,
        value: 'Four'
      }),
      Object.assign(new AuthorityValue(), {
        type: 'authority',
        display: 'Five',
        id: 'Five',
        otherInformation: undefined,
        value: 'Five'
      })
    ]);
    validRequest = new IntegrationRequest('69f375b5-19f4-4453-8c7a-7dc5c55aafbb', entriesEndpoint);

    validResponse = {
      payload: {
        page: {
          number: 0,
          size: 5,
          totalElements: 5,
          totalPages: 1
        },
        _embedded: {
          authorityEntries: [
            {
              display: 'One',
              id: 'One',
              otherInformation: {},
              type: 'authority',
              value: 'One'
            },
            {
              display: 'Two',
              id: 'Two',
              otherInformation: {},
              type: 'authority',
              value: 'Two'
            },
            {
              display: 'Three',
              id: 'Three',
              otherInformation: {},
              type: 'authority',
              value: 'Three'
            },
            {
              display: 'Four',
              id: 'Four',
              otherInformation: {},
              type: 'authority',
              value: 'Four'
            },
            {
              display: 'Five',
              id: 'Five',
              otherInformation: {},
              type: 'authority',
              value: 'Five'
            },
          ],

        },
        _links: {
          self: { href: 'https://rest.api/integration/authorities/type/entries' }
        }
      },
      statusCode: 200,
      statusText: 'OK'
    };

    invalidResponse1 = {
      payload: {},
      statusCode: 400,
      statusText: 'Bad Request'
    };

    invalidResponse2 = {
      payload: {
        page: {
          number: 0,
          size: 5,
          totalElements: 5,
          totalPages: 1
        },
        _embedded: {
          authorityEntries: [
            {
              display: 'One',
              id: 'One',
              otherInformation: {},
              type: 'authority',
              value: 'One'
            },
            {
              display: 'Two',
              id: 'Two',
              otherInformation: {},
              type: 'authority',
              value: 'Two'
            },
            {
              display: 'Three',
              id: 'Three',
              otherInformation: {},
              type: 'authority',
              value: 'Three'
            },
            {
              display: 'Four',
              id: 'Four',
              otherInformation: {},
              type: 'authority',
              value: 'Four'
            },
            {
              display: 'Five',
              id: 'Five',
              otherInformation: {},
              type: 'authority',
              value: 'Five'
            },
          ],

        },
        _links: {}
      },
      statusCode: 500,
      statusText: 'Internal Server Error'
    };
  }
  beforeEach(() => {
    initVars();
    service = new IntegrationResponseParsingService(EnvConfig, objectCacheService);
  });

  describe('parse', () => {
    it('should return a IntegrationSuccessResponse if data contains a valid endpoint response', () => {
      const response = service.parse(validRequest, validResponse);
      expect(response.constructor).toBe(IntegrationSuccessResponse);
    });

    it('should return an ErrorResponse if data contains an invalid config endpoint response', () => {
      const response1 = service.parse(validRequest, invalidResponse1);
      const response2 = service.parse(validRequest, invalidResponse2);
      expect(response1.constructor).toBe(ErrorResponse);
      expect(response2.constructor).toBe(ErrorResponse);
    });

    it('should return a IntegrationSuccessResponse with data definition', () => {
      const response = service.parse(validRequest, validResponse);
      expect((response as any).dataDefinition).toEqual(definitions);
    });

  });
});
