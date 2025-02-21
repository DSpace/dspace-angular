import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { RequestParam } from '@dspace/core';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core';
import { FindListOptions } from '@dspace/core';
import { buildPaginatedList } from '@dspace/core';
import {
  getMockQualityAssuranceTopicRestService,
  qualityAssuranceTopicObjectMoreAbstract,
  qualityAssuranceTopicObjectMorePid,
} from '@dspace/core';
import { QualityAssuranceTopicDataService } from '@dspace/core';
import { PageInfo } from '@dspace/core';
import { createSuccessfulRemoteDataObject } from '@dspace/core';
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
    restServiceAsAny.searchTopicsBySource.and.returnValue(observableOf(paginatedListRD));
    restServiceAsAny.searchTopicsByTarget.and.returnValue(observableOf(paginatedListRD));
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
