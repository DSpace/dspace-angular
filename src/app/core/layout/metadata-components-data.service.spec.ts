import { TestBed } from '@angular/core/testing';

import { MetadataComponentsDataService } from './metadata-components-data.service';
import { RequestService } from '../data/request.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { TestScheduler } from 'rxjs/testing';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestEntry } from '../data/request.reducer';
import { MetadataComponent } from './models/metadata-component.model';
import { getTestScheduler, cold, hot } from 'jasmine-marbles';
import { RestResponse } from '../cache/response.models';
import { METADATACOMPONENT } from './models/metadata-component.resource-type';
import { createSuccessfulRemoteDataObject } from 'src/app/shared/remote-data.utils';
import { of } from 'rxjs';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';

describe('MetadataComponentsDataService', () => {
  let scheduler: TestScheduler;
  let service: MetadataComponentsDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let responseCacheEntry: RequestEntry;

  const medataComponent: MetadataComponent = {
    id: 'box-shortname-1',
    type: METADATACOMPONENT,
    rows: [{
      fields: [
        {
          metadata: 'dc.contibutor.author',
          label: 'Authors',
          rendering: 'browselink',
          fieldType: 'metadata',
          style: null
        }, {
          bitstream: {
            bundle: 'ORIGINAL',
            metadataField: 'dc.type',
            metadataValue: 'picture'
          },
          label: 'Authors',
          rendering: 'thumbnail',
          fieldType: 'bitstream',
          style: null
        }
      ]
    }],
    _links: {
      self: {
        href: 'https://rest.api/rest/api/metadatacomponent/box-shortname-1'
      }
    }
  };

  const endpointURL = `https://rest.api/rest/api/metadatacomponent`;
  const medataComponentRD = createSuccessfulRemoteDataObject(medataComponent);
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const medataComponentID = 'box-shortname-1';

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
        a: medataComponentRD
      })
    });

    objectCache = {} as ObjectCacheService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;

    service = new MetadataComponentsDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    spyOn((service as any).dataService, 'findById').and.callThrough();
  });

  describe('findById', () => {
    it('should proxy the call to dataservice.findById', () => {
      scheduler.schedule(() => service.findById(medataComponentID));
      scheduler.flush();

      expect((service as any).dataService.findById).toHaveBeenCalledWith(medataComponentID);
    });

    it('should return a RemoteData<MetadataComponent> for the object with the given id', () => {
      const result = service.findById(medataComponentID);
      const expected = cold('a|', {
        a: medataComponentRD
      });
      expect(result).toBeObservable(expected);
    });
  });

});
