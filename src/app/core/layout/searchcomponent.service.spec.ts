import { TestBed } from '@angular/core/testing';

import { SearchcomponentService } from './searchcomponent.service';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler, cold, hot } from 'jasmine-marbles';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestEntry } from '../data/request.reducer';
import { RestResponse } from '../cache/response.models';
import { RequestService } from '../data/request.service';
import { of } from 'rxjs';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { SearchComponent } from './models/search-component.model';
import { SEARCH_COMPONENT } from './models/search-component.resource-type';

describe('SearchcomponentService', () => {
  let scheduler: TestScheduler;
  let service: SearchcomponentService;
  let halService: HALEndpointService;
  let responseCacheEntry: RequestEntry;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;

  const boxConfiguration: SearchComponent = {
    id: 2,
    uuid: 'box-2',
    type: SEARCH_COMPONENT,
    configuration: 'RELATION.Person.researchoutputs',
    _links: {
      self: {
        href: 'http://rest.api/rest/api/layout/boxrelationconfigurations/2'
      }
    }
  };

  const requestURL = `https://rest.api/rest/api/layout/boxrelationconfigurations/${boxConfiguration.id}`;
  const endpointURL = `https://rest.api/rest/api/layout/boxrelationconfigurations`;
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';

  const boxConfigId = 2;

  beforeEach(() => {
    scheduler = getTestScheduler();

    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: endpointURL })
    });

    responseCacheEntry = new RequestEntry();
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true,
      removeByHrefSubstring: {},
      getByHref: of(responseCacheEntry),
      getByUUID: of(responseCacheEntry),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: hot('a|', {
        a: boxConfiguration
      })
    });

    objectCache = {} as ObjectCacheService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;

    service = new SearchcomponentService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    spyOn((service as any).dataService, 'findById').and.callThrough();
    spyOn((service as any).dataService, 'searchBy').and.callThrough();
    spyOn((service as any).dataService, 'getSearchByHref').and.returnValue(of(requestURL));
  });

  describe('findById', () => {
    it('should proxy the call to dataservice.findById', () => {
      scheduler.schedule(() => service.findById(boxConfigId));
      scheduler.flush();

      expect((service as any).dataService.findById).toHaveBeenCalledWith(boxConfigId.toString());
    });

    it('should return a RemoteData<SearchComponent> for the box with the given id', () => {
      const result = service.findById(boxConfigId);
      const expected = cold('a|', {
        a: boxConfiguration
      });
      expect(result).toBeObservable(expected);
    });
  });
});
