import { getMockObjectCacheService } from '../../../shared/mocks/object-cache.service.mock';
import { ErrorResponse, GenericSuccessResponse } from '../../cache/response.models';
import { DSpaceRESTV2Response } from '../../dspace-rest-v2/dspace-rest-v2-response.model';
import { VocabularyEntriesResponseParsingService } from './vocabulary-entries-response-parsing.service';
import { VocabularyEntriesRequest } from '../../data/request.models';

describe('VocabularyEntriesResponseParsingService', () => {
  let service: VocabularyEntriesResponseParsingService;
  const metadata = 'dc.type';
  const collectionUUID = '8b39g7ya-5a4b-438b-851f-be1d5b4a1c5a';
  const entriesRequestURL = `https://rest.api/rest/api/submission/vocabularies/types/entries?metadata=${metadata}&collection=${collectionUUID}`

  beforeEach(() => {
    service = new VocabularyEntriesResponseParsingService(getMockObjectCacheService());
  });

  describe('parse', () => {
    const request = new VocabularyEntriesRequest('client/f5b4ccb8-fbb0-4548-b558-f234d9fdfad6', entriesRequestURL);

    const validResponse = {
      payload: {
        _embedded: {
          entries: [
            {
              display: 'testValue1',
              value: 'testValue1',
              otherInformation: {},
              type: 'vocabularyEntry'
            },
            {
              display: 'testValue2',
              value: 'testValue2',
              otherInformation: {},
              type: 'vocabularyEntry'
            },
            {
              display: 'testValue3',
              value: 'testValue3',
              otherInformation: {},
              type: 'vocabularyEntry'
            },
            {
              authority: 'authorityId1',
              display: 'testValue1',
              value: 'testValue1',
              otherInformation: {
                id: 'VR131402',
                parent: 'Research Subject Categories::SOCIAL SCIENCES::Social sciences::Social work',
                hasChildren: 'false',
                note: 'Familjeforskning'
              },
              type: 'vocabularyEntry',
              _links: {
                vocabularyEntryDetail: {
                  href: 'https://rest.api/rest/api/submission/vocabularyEntryDetails/srsc:VR131402'
                }
              }
            }
          ]
        },
        _links: {
          first: {
            href: 'https://rest.api/rest/api/submission/vocabularies/types/entries/first?page=0&size=5'
          },
          self: {
            href: 'https://rest.api/rest/api/submission/vocabularies/types/entries'
          },
          next: {
            href: 'https://rest.api/rest/api/submission/vocabularies/types/entries/next?page=1&size=5'
          },
          last: {
            href: 'https://rest.api/rest/api/submission/vocabularies/types/entries/last?page=9&size=5'
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
