import { deepClone } from 'fast-json-patch';
import { cold } from 'jasmine-marbles';
import {
  BehaviorSubject,
  of,
} from 'rxjs';
import { take } from 'rxjs/operators';

import { RemoteDataBuildService } from '@dspace/core';
import { ObjectCacheService } from '@dspace/core';
import { RestResponse } from '@dspace/core';
import { ItemDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { RequestEntry } from '@dspace/core';
import { RequestEntryState } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { HALEndpointService } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { LdnServicesService } from '../ldn-services-data/ldn-services-data.service';
import { AdminNotifyMessage } from './models/admin-notify-message.model';
import { AdminNotifyMessagesService } from './admin-notify-messages.service';

describe('AdminNotifyMessagesService test', () => {
  let service: AdminNotifyMessagesService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let ldnServicesService: LdnServicesService;
  let itemDataService: ItemDataService;
  let responseCacheEntry: RequestEntry;
  let mockMessages: AdminNotifyMessage[];

  const endpointURL = `https://rest.api/rest/api/ldn/messages`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const remoteDataMocks = {
    Success: new RemoteData(null, null, null, RequestEntryState.Success, null, null, 200),
  };
  const testLdnServiceName = 'testLdnService';
  const testRelatedItemName = 'testRelatedItem';

  function initTestService() {
    return new AdminNotifyMessagesService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      ldnServicesService,
      itemDataService,
    );
  }

  beforeEach(() => {
    mockMessages = deepClone(mockAdminNotifyMessages);
    objectCache = {} as ObjectCacheService;
    notificationsService = {} as NotificationsService;
    responseCacheEntry = new RequestEntry();
    responseCacheEntry.request = { href: endpointURL } as any;
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');


    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      send: true,
      removeByHrefSubstring: {},
      getByHref: of(responseCacheEntry),
      getByUUID: of(responseCacheEntry),
    });

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: of(endpointURL),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: createSuccessfulRemoteDataObject$({}, 500),
      buildList: cold('a', { a: remoteDataMocks.Success }),
      buildFromRequestUUID: createSuccessfulRemoteDataObject$(mockMessages),
    });

    ldnServicesService = jasmine.createSpyObj('ldnServicesService', {
      findById: createSuccessfulRemoteDataObject$({ name: testLdnServiceName }),
    });

    itemDataService = jasmine.createSpyObj('itemDataService', {
      findById: createSuccessfulRemoteDataObject$({ name: testRelatedItemName }),
    });

    service = initTestService();
  });

  describe('Admin Notify service', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should get details for messages', (done) => {
      service.getDetailedMessages(mockMessages).pipe(take(1)).subscribe((detailedMessages) => {
        expect(detailedMessages[0].ldnService).toEqual(testLdnServiceName);
        expect(detailedMessages[0].relatedItem).toEqual(testRelatedItemName);
        done();
      });
    });

    it('should reprocess message', (done) => {
      const behaviorSubject = new BehaviorSubject(mockMessages);
      service.reprocessMessage(mockMessages[0], behaviorSubject).pipe(take(1)).subscribe((reprocessedMessages) => {
        expect(reprocessedMessages.length).toEqual(2);
        expect(reprocessedMessages).toEqual(mockMessages);
        done();
      });
    });
  });
});
