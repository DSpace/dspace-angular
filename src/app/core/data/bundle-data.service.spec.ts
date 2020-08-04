import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { compare, Operation } from 'fast-json-patch';
import { Observable, of as observableOf } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { SortDirection, SortOptions } from '../cache/models/sort-options.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { DSpaceObject } from '../shared/dspace-object.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { Item } from '../shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ChangeAnalyzer } from './change-analyzer';
import { DataService } from './data.service';
import { FindListOptions, PatchRequest } from './request.models';
import { RequestService } from './request.service';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { BundleDataService } from './bundle-data.service';
import { HALLink } from '../shared/hal-link.model';

class DummyChangeAnalyzer implements ChangeAnalyzer<Item> {
  diff(object1: Item, object2: Item): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }
}

describe('BundleDataService', () => {
  let service: BundleDataService;
  let requestService;
  let halService;
  let rdbService;
  let notificationsService;
  let http;
  let comparator;
  let objectCache;
  let store;
  let item;
  let bundleLink;
  let bundleHALLink;

  function initTestService(): BundleDataService {
    bundleLink = '/items/0fdc0cd7-ff8c-433d-b33c-9b56108abc07/bundles';
    bundleHALLink = new HALLink();
    bundleHALLink.href = bundleLink;
    item = new Item();
    item._links = {
      bundles: bundleHALLink
    };
    requestService = getMockRequestService();
    halService = new HALEndpointServiceStub('url') as any;
    rdbService = {} as RemoteDataBuildService;
    notificationsService = {} as NotificationsService;
    http = {} as HttpClient;
    comparator = new DummyChangeAnalyzer() as any;
    objectCache = {

      addPatch: () => {
        /* empty */
      },
      getObjectBySelfLink: () => {
        /* empty */
      }
    } as any;
    store = {} as Store<CoreState>;
    return new BundleDataService(
      requestService,
      rdbService,
      store,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator,
    );
  }

  beforeEach(() => {
    service = initTestService();
  });

  describe('findAllByItem', () => {
    beforeEach(() => {
      spyOn(service, 'findAllByHref');
      service.findAllByItem(item);
    });

    it('should call findAllByHref with the item\'s bundles link', () => {
      expect(service.findAllByHref).toHaveBeenCalledWith(bundleLink, undefined);
    })
  });
});
