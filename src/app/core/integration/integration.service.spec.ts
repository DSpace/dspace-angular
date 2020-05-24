import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';

import { RequestService } from '../data/request.service';
import { IntegrationRequest } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { IntegrationService } from './integration.service';
import { IntegrationSearchOptions } from './models/integration-options.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { AuthorityEntry } from './models/authority-entry.model';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { Item } from '../shared/item.model';
import { compare, Operation } from 'fast-json-patch';

const LINK_NAME = 'authorities';
const ENTRIES = 'entries';
const ENTRY_VALUE = 'entryValue';

/* tslint:disable:max-classes-per-file */

class TestService extends IntegrationService<AuthorityEntry> {
  protected forceBypassCache = false;
  protected linkPath = LINK_NAME;
  protected entriesEndpoint = ENTRIES;
  protected entryValueEndpoint = ENTRY_VALUE;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: ChangeAnalyzer<AuthorityEntry>) {
    super();
  }

}

class DummyChangeAnalyzer implements ChangeAnalyzer<Item> {
  diff(object1: Item, object2: Item): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }

}

describe('IntegrationService', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let halService: any;
  let findOptions: IntegrationSearchOptions;

  const name = 'type';
  const metadata = 'dc.type';
  const query = 'testquery';
  const value = 'test001';
  const uuid = 'd9d30c0c-69b7-4369-8397-ca67c888974d';
  const integrationEndpoint = 'https://rest.api/integration';
  const serviceEndpoint = `${integrationEndpoint}/${LINK_NAME}`;
  const entriesEndpoint = `${serviceEndpoint}/${name}/entries?query=${query}&metadata=${metadata}&uuid=${uuid}`;
  const entriesEndpointEmptyQuery = `${serviceEndpoint}/${name}/entries?metadata=${metadata}&uuid=${uuid}`;
  const entryValueEndpoint = `${serviceEndpoint}/${name}/entryValue/${value}?metadata=${metadata}`;
  const entriesSearchEndpoint = `${serviceEndpoint}/${name}/entries/search/top`;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = new DummyChangeAnalyzer() as any;

  const objectCache = {
    addPatch: () => {
      /* empty */
    },
    getObjectBySelfLink: () => {
      /* empty */
    }
  } as any;
  const store = {} as Store<CoreState>;

  findOptions = new IntegrationSearchOptions(uuid, name, metadata);

  function initTestService(): TestService {
    return new TestService(
      requestService,
      rdbService,
      store,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );
  }

  beforeEach(() => {
    requestService = getMockRequestService();
    rdbService = getMockRemoteDataBuildService();
    scheduler = getTestScheduler();
    halService = new HALEndpointServiceStub(integrationEndpoint);
    findOptions = new IntegrationSearchOptions(uuid, name, metadata, query);
    service = initTestService();

  });

  describe('getEntriesByName', () => {

    it('should configure a new IntegrationRequest', () => {
      const expected = new IntegrationRequest(requestService.generateRequestId(), entriesEndpoint);
      scheduler.schedule(() => service.getEntriesByName(findOptions).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should configure a new IntegrationRequest with empty query param', () => {
      findOptions = new IntegrationSearchOptions(uuid, name, metadata);

      const expected = new IntegrationRequest(requestService.generateRequestId(), entriesEndpointEmptyQuery);
      scheduler.schedule(() => service.getEntriesByName(findOptions).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('getEntryByValue', () => {

    it('should configure a new IntegrationRequest', () => {
      findOptions = new IntegrationSearchOptions(
        null,
        name,
        metadata,
        value);

      const expected = new IntegrationRequest(requestService.generateRequestId(), entryValueEndpoint);
      scheduler.schedule(() => service.getEntryByValue(findOptions).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('searchEntriesBy', () => {

    it('should configure a new IntegrationRequest', () => {
      findOptions = new IntegrationSearchOptions(null, name);

      const expected = new IntegrationRequest(requestService.generateRequestId(), entriesSearchEndpoint);
      scheduler.schedule(() => (service as any).searchEntriesBy('top', findOptions).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });
});

/* tslint:enable:max-classes-per-file */
