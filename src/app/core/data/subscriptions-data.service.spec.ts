import { HttpClient } from '@angular/common/http';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '@dspace/core/cache/object-cache.service';
import { DSOChangeAnalyzer } from '@dspace/core/data/dso-change-analyzer.service';
import { RequestService } from '@dspace/core/data/request.service';
import { HALEndpointService } from '@dspace/core/shared/hal-endpoint.service';
import { Subscription } from '@dspace/core/shared/subscription.model';
import { Store } from '@ngrx/store';

import { NotificationsService } from '../notification-system/notifications.service';
import { HALEndpointServiceStub } from '../testing/hal-endpoint-service.stub';
import { NotificationsServiceStub } from '../testing/notifications-service.stub';
import { getMockRemoteDataBuildService } from '../testing/remote-data-build.service.mock';
import { getMockRequestService } from '../testing/request.service.mock';
import { createPaginatedList } from '../testing/utils.test';
import {
  createNoContentRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../utilities/remote-data.utils';
import { SubscriptionsDataService } from './subscriptions-data.service';

describe('SubscriptionsDataService', () => {


  let service: SubscriptionsDataService;

  let comparator: DSOChangeAnalyzer<Subscription>;
  let http: HttpClient;
  let notificationsService: NotificationsService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let store: Store<any>;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let nameService: DSONameService;

  function initService() {
    comparator = {} as any;
    http = {} as HttpClient;
    notificationsService = new NotificationsServiceStub() as any;
    requestService = getMockRequestService();
    rdbService = getMockRemoteDataBuildService();
    halService = new HALEndpointServiceStub('linkPath') as any;
    service = new SubscriptionsDataService(comparator, http, notificationsService, requestService, rdbService, store, objectCache, halService, nameService);
    spyOn((service as any).deleteData, 'delete').and.returnValue(createNoContentRemoteDataObject$());
  }

  describe('createSubscription', () => {

    beforeEach(() => {
      initService();
    });

    it('should create the subscription', () => {
      const id = 'test-id';
      const ePerson = 'test-ePerson';
      const subscription = new Subscription();
      service.createSubscription(subscription, ePerson, id).subscribe((res) => {
        expect(requestService.generateRequestId).toHaveBeenCalled();
        expect(res.hasCompleted).toBeTrue();
      });
    });

  });

  describe('deleteSubscription', () => {

    beforeEach(() => {
      initService();
    });

    it('should delete the subscription', () => {
      const id = 'test-id';
      service.deleteSubscription(id).subscribe((res) => {
        expect((service as any).deleteData.delete).toHaveBeenCalledWith(id);
        expect(res.hasCompleted).toBeTrue();
      });
    });

  });

  describe('updateSubscription', () => {

    beforeEach(() => {
      initService();
    });

    it('should update the subscription', () => {
      const id = 'test-id';
      const ePerson = 'test-ePerson';
      const subscription = new Subscription();
      service.updateSubscription(subscription, ePerson, id).subscribe((res) => {
        expect(requestService.generateRequestId).toHaveBeenCalled();
        expect(res.hasCompleted).toBeTrue();
      });
    });

  });

  describe('findByEPerson', () => {

    beforeEach(() => {
      initService();
    });

    it('should update the subscription', () => {
      const ePersonId = 'test-ePersonId';
      spyOn(service, 'findListByHref').and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList()));
      service.findByEPerson(ePersonId).subscribe((res) => {
        expect(service.findListByHref).toHaveBeenCalled();
        expect(res.hasCompleted).toBeTrue();
      });
    });

  });

  describe('getSubscriptionsByPersonDSO', () => {

    beforeEach(() => {
      initService();
    });

    it('should get the subscriptions', () => {
      spyOn((service as any).searchData, 'searchBy');
      const id = 'test-id';
      const ePersonId = 'test-ePersonId';
      service.getSubscriptionsByPersonDSO(ePersonId, id);
      expect((service as any).searchData.searchBy).toHaveBeenCalled();
    });

  });

});
