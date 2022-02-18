import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { NotificationsBrokerTopicsService } from './notifications-broker-topics.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { NotificationsBrokerTopicRestService } from '../../../core/notifications/broker/topics/notifications-broker-topic-rest.service';
import { PageInfo } from '../../../core/shared/page-info.model';
import { FindListOptions } from '../../../core/data/request.models';
import {
  getMockNotificationsBrokerTopicRestService,
  notificationsBrokerTopicObjectMoreAbstract,
  notificationsBrokerTopicObjectMorePid
} from '../../../shared/mocks/notifications.mock';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { cold } from 'jasmine-marbles';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';

describe('NotificationsBrokerTopicsService', () => {
  let service: NotificationsBrokerTopicsService;
  let restService: NotificationsBrokerTopicRestService;
  let serviceAsAny: any;
  let restServiceAsAny: any;

  const pageInfo = new PageInfo();
  const array = [ notificationsBrokerTopicObjectMorePid, notificationsBrokerTopicObjectMoreAbstract ];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const elementsPerPage = 3;
  const currentPage = 0;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationsBrokerTopicRestService, useClass: getMockNotificationsBrokerTopicRestService },
        { provide: NotificationsBrokerTopicsService, useValue: service }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    restService = TestBed.get(NotificationsBrokerTopicRestService);
    restServiceAsAny = restService;
    restServiceAsAny.getTopics.and.returnValue(observableOf(paginatedListRD));
    service = new NotificationsBrokerTopicsService(restService);
    serviceAsAny = service;
  });

  describe('getTopics', () => {
    it('Should proxy the call to notificationsBrokerTopicRestService.getTopics', () => {
      const sortOptions = new SortOptions('name', SortDirection.ASC);
      const findListOptions: FindListOptions = {
        elementsPerPage: elementsPerPage,
        currentPage: currentPage,
        sort: sortOptions
      };
      const result = service.getTopics(elementsPerPage, currentPage);
      expect((service as any).notificationsBrokerTopicRestService.getTopics).toHaveBeenCalledWith(findListOptions);
    });

    it('Should return a paginated list of Notifications Broker topics', () => {
      const expected = cold('(a|)', {
        a: paginatedList
      });
      const result = service.getTopics(elementsPerPage, currentPage);
      expect(result).toBeObservable(expected);
    });
  });
});
