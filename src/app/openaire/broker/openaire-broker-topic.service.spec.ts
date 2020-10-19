import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { OpenaireBrokerTopicsService } from './openaire-broker-topic.service';
import { SortOptions, SortDirection } from '../../core/cache/models/sort-options.model';
import { OpenaireBrokerTopicRestService } from '../../core/openaire/openaire-broker-topic-rest.service';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { FindListOptions } from '../../core/data/request.models';
import {
  getMockOpenaireBrokerTopicRestService,
  openaireBrokerTopicObjectMorePid,
  openaireBrokerTopicObjectMoreAbstract
} from '../../shared/mocks/openaire.mock';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { cold } from 'jasmine-marbles';

describe('OpenaireBrokerTopicsService', () => {
  let service: OpenaireBrokerTopicsService;
  let restService: OpenaireBrokerTopicRestService;
  let serviceAsAny: any;
  let restServiceAsAny: any;

  const pageInfo = new PageInfo();
  const array = [ openaireBrokerTopicObjectMorePid, openaireBrokerTopicObjectMoreAbstract ];
  const paginatedList = new PaginatedList(pageInfo, array);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const elementsPerPage = 3;
  const currentPage = 0;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OpenaireBrokerTopicRestService, useClass: getMockOpenaireBrokerTopicRestService },
        { provide: OpenaireBrokerTopicsService, useValue: service }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    restService = TestBed.get(OpenaireBrokerTopicRestService);
    restServiceAsAny = restService;
    restServiceAsAny.getTopics.and.returnValue(observableOf(paginatedListRD));
    service = new OpenaireBrokerTopicsService(restService);
    serviceAsAny = service;
  });

  describe('getTopics', () => {
    it('Should proxy the call to openaireBrokerTopicRestService.getTopics', () => {
      const sortOptions = new SortOptions('name', SortDirection.ASC);
      const findListOptions: FindListOptions = {
        elementsPerPage: elementsPerPage,
        currentPage: currentPage,
        sort: sortOptions
      };
      const result = service.getTopics(elementsPerPage, currentPage);
      expect((service as any).openaireBrokerTopicRestService.getTopics).toHaveBeenCalledWith(findListOptions);
    });

    it('Should return a paginated list of OpenAIRE Broker topics', () => {
      const expected = cold('(a|)', {
        a: paginatedList
      });
      const result = service.getTopics(elementsPerPage, currentPage);
      expect(result).toBeObservable(expected);
    });
  });
});
