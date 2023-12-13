import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';
import { QualityAssuranceTopicsService } from './quality-assurance-topics.service';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import {
  QualityAssuranceTopicDataService
} from '../../../core/notifications/qa/topics/quality-assurance-topic-data.service';
import { PageInfo } from '../../../core/shared/page-info.model';
import {
  getMockQualityAssuranceTopicRestService,
  qualityAssuranceTopicObjectMoreAbstract,
  qualityAssuranceTopicObjectMorePid
} from '../../../shared/mocks/notifications.mock';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { cold } from 'jasmine-marbles';
import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { RequestParam } from '../../../core/cache/models/request-param.model';
import { FindListOptions } from '../../../core/data/find-list-options.model';

describe('QualityAssuranceTopicsService', () => {
  let service: QualityAssuranceTopicsService;
  let restService: QualityAssuranceTopicDataService;
  let serviceAsAny: any;
  let restServiceAsAny: any;

  const pageInfo = new PageInfo();
  const array = [ qualityAssuranceTopicObjectMorePid, qualityAssuranceTopicObjectMoreAbstract ];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const elementsPerPage = 3;
  const currentPage = 0;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: QualityAssuranceTopicDataService, useClass: getMockQualityAssuranceTopicRestService },
        { provide: QualityAssuranceTopicsService, useValue: service }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    restService = TestBed.inject(QualityAssuranceTopicDataService);
    restServiceAsAny = restService;
    restServiceAsAny.getTopics.and.returnValue(observableOf(paginatedListRD));
    service = new QualityAssuranceTopicsService(restService);
    serviceAsAny = service;
  });

  describe('getTopics', () => {
    it('Should proxy the call to qualityAssuranceTopicRestService.getTopics', () => {
      const sortOptions = new SortOptions('name', SortDirection.ASC);
      const findListOptions: FindListOptions = {
        elementsPerPage: elementsPerPage,
        currentPage: currentPage,
        sort: sortOptions,
        searchParams: [new RequestParam('source', 'ENRICH!MORE!ABSTRACT')]
      };
      service.setSourceId('ENRICH!MORE!ABSTRACT');
      const result = service.getTopics(elementsPerPage, currentPage);
      expect((service as any).qualityAssuranceTopicRestService.getTopics).toHaveBeenCalledWith(findListOptions);
    });

    it('Should return a paginated list of Quality Assurance topics', () => {
      const expected = cold('(a|)', {
        a: paginatedList
      });
      const result = service.getTopics(elementsPerPage, currentPage);
      expect(result).toBeObservable(expected);
    });
  });
});
