import { Observable, of as observableOf } from 'rxjs';
import { RestResponse } from '../cache/response.models';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { MetadataValueDataService } from './metadata-value-data.service';
import { RequestParam } from '../cache/models/request-param.model';
import { buildPaginatedList , PaginatedList} from './paginated-list.model';
import { MetadataValue } from '../metadata/metadata-value.model';
import { VocabularyEntry } from '../submission/vocabularies/models/vocabulary-entry.model';
import { RemoteData } from './remote-data';
import { FindListOptions } from './find-list-options.model';
import join from 'lodash/join';

/**
 * The test class for the `medatata-value-data.service.ts`.
 * Check if the service properly process data for the server and from the server.
 */
let metadataValueService: MetadataValueDataService;
let requestService: RequestService;
let halService: HALEndpointService;
let notificationsService: NotificationsService;
let rdbService: RemoteDataBuildService;
let metadataValue: MetadataValue;
let metadataName: string;
let metadataValues: MetadataValue[];
let remoteData$: Observable<RemoteData<PaginatedList<MetadataValue>>>;

const ENDPOINT = 'api/metadatavalue/endpoint';
const SCHEMA = 'dc';
const ELEMENT = 'contributor';
const QUALIFIER = 'author';
const TERM = 'test';

/**
 * Prepare a test environment
 */
function init() {
  metadataName = join(Array.of(SCHEMA, ELEMENT, QUALIFIER), '.');
  metadataValue = Object.assign(new MetadataValue(), {
    value: 'Test value',
    language: '*',
    authority: '1',
    confidence: '1',
    place: '-1',
    _links: {
      self: { href: 'selflink' },
      field: { href: 'fieldLink' }
    }
  });
  metadataValues = [];
  metadataValues.push(metadataValue);

  requestService = jasmine.createSpyObj('requestService', {
    generateRequestId: '34cfed7c-f597-49ef-9cbe-ea351f0023c2',
    send: {},
    getByUUID: observableOf({ response: new RestResponse(true, 200, 'OK') }),
    setStaleByHrefSubstring: {}
  });
  halService = Object.assign(new HALEndpointServiceStub(ENDPOINT));
  notificationsService = jasmine.createSpyObj('notificationsService', {
    error: {}
  });
  rdbService = jasmine.createSpyObj('rdbService', {
    searchBy: createSuccessfulRemoteDataObject$(undefined)
  });
  metadataValueService = new MetadataValueDataService(requestService, rdbService, undefined, halService,
    undefined, undefined, undefined, notificationsService);
  remoteData$ = createSuccessfulRemoteDataObject$(buildPaginatedList(null, metadataValues));
}

describe('MetadataValueDataService', () => {
  beforeEach(() => {
    init();
    spyOn(metadataValueService, 'searchBy').and.returnValue(remoteData$);
  });

  it('should call searchBy with the correct arguments', () => {
    const expectedOptions = Object.assign(new FindListOptions(), {}, {
      searchParams: [
        new RequestParam('schema', SCHEMA),
        new RequestParam('element', ELEMENT),
        new RequestParam('qualifier', QUALIFIER),
        new RequestParam('searchValue', TERM)
      ]
    });

    metadataValueService.findByMetadataNameAndByValue(metadataName, TERM);
    expect(metadataValueService.searchBy).toHaveBeenCalledWith('byValue', expectedOptions);
  });

  it('findByMetadataNameAndByValue method should return PaginatedList with Vocabulary Entry', () => {
    const metadataValuePaginatedListWithVocabularyOptions: PaginatedList<MetadataValue> =
      new PaginatedList<MetadataValue>();
    let vocabularyEntry: VocabularyEntry;
    let vocabularyOptions: VocabularyEntry[];
    vocabularyEntry = Object.assign(new VocabularyEntry(), {
      display: metadataValue.value,
      value: metadataValue.value
    });
    vocabularyOptions = [];
    vocabularyOptions.push(vocabularyEntry);
    // @ts-ignore
    metadataValuePaginatedListWithVocabularyOptions.page = vocabularyOptions;

    metadataValueService.findByMetadataNameAndByValue(metadataName, TERM)
      .subscribe(rd => {
      expect(rd.page)
        .toEqual(metadataValuePaginatedListWithVocabularyOptions.page);
    });
  });
});

