import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { NotificationsBrokerSourceService } from './notifications-broker-source.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { FindListOptions } from '../../../core/data/request.models';
import {
  getMockNotificationsBrokerSourceRestService,
  notificationsBrokerSourceObjectMoreAbstract,
  notificationsBrokerSourceObjectMorePid
} from '../../../shared/mocks/notifications.mock';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { cold } from 'jasmine-marbles';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { NotificationsBrokerSourceRestService } from '../../../core/notifications/broker/source/notifications-broker-source-rest.service';
import { RequestParam } from '../../../core/cache/models/request-param.model';

describe('NotificationsBrokerSourceService', () => {
  let service: NotificationsBrokerSourceService;
  let restService: NotificationsBrokerSourceRestService;
  let serviceAsAny: any;
  let restServiceAsAny: any;

  const pageInfo = new PageInfo();
  const array = [ notificationsBrokerSourceObjectMorePid, notificationsBrokerSourceObjectMoreAbstract ];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const elementsPerPage = 3;
  const currentPage = 0;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationsBrokerSourceRestService, useClass: getMockNotificationsBrokerSourceRestService },
        { provide: NotificationsBrokerSourceService, useValue: service }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    restService = TestBed.get(NotificationsBrokerSourceRestService);
    restServiceAsAny = restService;
    restServiceAsAny.getSources.and.returnValue(observableOf(paginatedListRD));
    service = new NotificationsBrokerSourceService(restService);
    serviceAsAny = service;
  });

  describe('getSources', () => {
    it('Should proxy the call to notificationsBrokerSourceRestService.getSources', () => {
      const sortOptions = new SortOptions('name', SortDirection.ASC);
      const findListOptions: FindListOptions = {
        elementsPerPage: elementsPerPage,
        currentPage: currentPage,
        sort: sortOptions
      };
      const result = service.getSources(elementsPerPage, currentPage);
      expect((service as any).notificationsBrokerSourceRestService.getSources).toHaveBeenCalledWith(findListOptions);
    });

    it('Should return a paginated list of Notifications Broker Source', () => {
      const expected = cold('(a|)', {
        a: paginatedList
      });
      const result = service.getSources(elementsPerPage, currentPage);
      expect(result).toBeObservable(expected);
    });
  });
});
