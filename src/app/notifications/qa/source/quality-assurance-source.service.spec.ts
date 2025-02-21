import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import {
  SortDirection,
  SortOptions,
} from '@dspace/core';
import { FindListOptions } from '@dspace/core';
import { buildPaginatedList } from '@dspace/core';
import {
  getMockQualityAssuranceSourceRestService,
  qualityAssuranceSourceObjectMoreAbstract,
  qualityAssuranceSourceObjectMorePid,
} from '@dspace/core';
import { QualityAssuranceSourceDataService } from '@dspace/core';
import { PageInfo } from '@dspace/core';
import { createSuccessfulRemoteDataObject } from '@dspace/core';
import { QualityAssuranceSourceService } from './quality-assurance-source.service';

describe('QualityAssuranceSourceService', () => {
  let service: QualityAssuranceSourceService;
  let restService: QualityAssuranceSourceDataService;
  let serviceAsAny: any;
  let restServiceAsAny: any;

  const pageInfo = new PageInfo();
  const array = [ qualityAssuranceSourceObjectMorePid, qualityAssuranceSourceObjectMoreAbstract ];
  const paginatedList = buildPaginatedList(pageInfo, array);
  const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
  const elementsPerPage = 3;
  const currentPage = 0;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: QualityAssuranceSourceDataService, useClass: getMockQualityAssuranceSourceRestService },
        { provide: QualityAssuranceSourceService, useValue: service },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    restService = TestBed.inject(QualityAssuranceSourceDataService);
    restServiceAsAny = restService;
    restServiceAsAny.getSources.and.returnValue(observableOf(paginatedListRD));
    service = new QualityAssuranceSourceService(restService);
    serviceAsAny = service;
  });

  describe('getSources', () => {
    it('Should proxy the call to qualityAssuranceSourceRestService.getSources', () => {
      const sortOptions = new SortOptions('name', SortDirection.ASC);
      const findListOptions: FindListOptions = {
        elementsPerPage: elementsPerPage,
        currentPage: currentPage,
        sort: sortOptions,
      };
      const result = service.getSources(elementsPerPage, currentPage);
      expect((service as any).qualityAssuranceSourceRestService.getSources).toHaveBeenCalledWith(findListOptions);
    });

    it('Should return a paginated list of Quality Assurance Source', () => {
      const expected = cold('(a|)', {
        a: paginatedList,
      });
      const result = service.getSources(elementsPerPage, currentPage);
      expect(result).toBeObservable(expected);
    });
  });
});
