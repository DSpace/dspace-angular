import { TestBed } from '@angular/core/testing';
import { RequestParam } from '@dspace/core/cache/models/request-param.model';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { QualityAssuranceTopicDataService } from '@dspace/core/notifications/qa/topics/quality-assurance-topic-data.service';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import {
  getMockQualityAssuranceTopicRestService,
  qualityAssuranceTopicObjectMoreAbstract,
  qualityAssuranceTopicObjectMorePid,
} from '@dspace/core/testing/notifications.mock';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { QualityAssuranceTopicsService } from './quality-assurance-topics.service';

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
        { provide: QualityAssuranceTopicsService, useValue: service },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    restService = TestBed.inject(QualityAssuranceTopicDataService);
    restServiceAsAny = restService;
    restServiceAsAny.searchTopicsBySource.and.returnValue(of(paginatedListRD));
    restServiceAsAny.searchTopicsByTarget.and.returnValue(of(paginatedListRD));
    service = new QualityAssuranceTopicsService(restService);
    serviceAsAny = service;
  });

  describe('getTopics', () => {
    it('should proxy the call to qualityAssuranceTopicRestService.searchTopicsBySource', () => {
      const sortOptions = new SortOptions('name', SortDirection.ASC);
      const findListOptions: FindListOptions = {
        elementsPerPage: elementsPerPage,
        currentPage: currentPage,
        sort: sortOptions,
        searchParams: [new RequestParam('source', 'openaire')],
      };
      service.getTopics(elementsPerPage, currentPage, 'openaire');
      expect((service as any).qualityAssuranceTopicRestService.searchTopicsBySource).toHaveBeenCalledWith(findListOptions);
    });

    it('should return a paginated list of Quality Assurance topics', () => {
      const expected = cold('(a|)', {
        a: paginatedList,
      });
      const result = service.getTopics(elementsPerPage, currentPage, 'openaire');
      expect(result).toBeObservable(expected);
    });
  });
});
