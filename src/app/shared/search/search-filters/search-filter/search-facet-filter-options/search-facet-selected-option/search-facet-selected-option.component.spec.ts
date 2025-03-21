import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PaginationService } from '../../../../../../core/pagination/pagination.service';
import { SearchService } from '../../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../../../../../core/shared/search/search-filter.service';
import { PaginationComponentOptions } from '../../../../../pagination/pagination-component-options.model';
import { ActivatedRouteStub } from '../../../../../testing/active-router.stub';
import { PaginationServiceStub } from '../../../../../testing/pagination-service.stub';
import { RouterStub } from '../../../../../testing/router.stub';
import { SearchConfigurationServiceStub } from '../../../../../testing/search-configuration-service.stub';
import { SearchFilterServiceStub } from '../../../../../testing/search-filter-service.stub';
import { SearchServiceStub } from '../../../../../testing/search-service.stub';
import { AppliedFilter } from '../../../../models/applied-filter.model';
import { FilterType } from '../../../../models/filter-type.model';
import { SearchFilterConfig } from '../../../../models/search-filter-config.model';
import { SearchFacetSelectedOptionComponent } from './search-facet-selected-option.component';

describe('SearchFacetSelectedOptionComponent', () => {
  let comp: SearchFacetSelectedOptionComponent;
  let fixture: ComponentFixture<SearchFacetSelectedOptionComponent>;
  const filterName1 = 'test name';
  const filterName2 = 'testAuthorityname';
  const value1 = 'testvalue1';
  const value2 = 'test2';
  const operator = 'authority';
  const mockFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    filterType: FilterType.range,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2,
    minValue: 200,
    maxValue: 3000,
  });

  const searchLink = '/search';
  const appliedFilter: AppliedFilter = Object.assign(new AppliedFilter(), {
    filter: filterName2,
    operator: operator,
    label: value2,
    value: value2,
  });
  let searchService: SearchServiceStub;
  let searchConfigurationService: SearchConfigurationServiceStub;
  let searchFilterService: SearchFilterServiceStub;
  let router: RouterStub;

  const pagination = Object.assign(new PaginationComponentOptions(), { id: 'page-id', currentPage: 1, pageSize: 20 });
  const paginationService = new PaginationServiceStub(pagination);

  beforeEach(waitForAsync(() => {
    searchConfigurationService = new SearchConfigurationServiceStub();
    searchFilterService = new SearchFilterServiceStub();
    searchService = new SearchServiceStub(searchLink);
    router = new RouterStub();

    void TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule, SearchFacetSelectedOptionComponent],
      providers: [
        { provide: SearchService, useValue:searchService },
        { provide: Router, useValue: router },
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigurationService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetSelectedOptionComponent);
    comp = fixture.componentInstance; // SearchFacetSelectedOptionComponent test instance
    comp.selectedValue = appliedFilter;
    comp.filterConfig = mockFilterConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
