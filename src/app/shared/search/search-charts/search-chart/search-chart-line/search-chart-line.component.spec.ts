import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RemoteDataBuildService } from '@dspace/core/cache/builders/remote-data-build.service';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { PageInfo } from '@dspace/core/shared/page-info.model';
import { FacetValue } from '@dspace/core/shared/search/models/facet-value.model';
import { FilterType } from '@dspace/core/shared/search/models/filter-type.model';
import { SearchFilterConfig } from '@dspace/core/shared/search/models/search-filter-config.model';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { SearchConfigurationServiceStub } from '@dspace/core/testing/search-configuration-service.stub';
import { SearchServiceStub } from '@dspace/core/testing/search-service.stub';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import { SearchService } from '../../../search.service';
import { SearchFilterService } from '../../../search-filters/search-filter.service';
import { SearchChartLineComponent } from './search-chart-line.component';

xdescribe('SearchChartLineComponent', () => {
  let comp: SearchChartLineComponent;
  let fixture: ComponentFixture<SearchChartLineComponent>;
  const filterName1 = 'test name';
  const value1 = 'Value 1';
  const value2 = 'Value 2';
  const value3 = 'Value 3';
  const mockFilterConfig: SearchFilterConfig = Object.assign(
    new SearchFilterConfig(),
    {
      name: filterName1,
      type: FilterType.text,
      hasFacets: false,
      isOpenByDefault: false,
      pageSize: 2,
    },
  );
  const values: FacetValue[] = [
    {
      label: value1,
      value: value1,
      count: 52,
      _links: {
        self: {
          href: '',
        },
        search: {
          href: '',
        },
      },
    },
    {
      label: value2,
      value: value2,
      count: 20,
      _links: {
        self: {
          href: '',
        },
        search: {
          href: '',
        },
      },
    },
    {
      label: value3,
      value: value3,
      count: 5,
      _links: {
        self: {
          href: '',
        },
        search: {
          href: '',
        },
      },
    },
  ];

  const searchLink = '/search';
  const selectedValues = [value1, value2];
  let filterService;
  let searchService;
  let router;
  const page = of(0);

  const mockValues = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), values));
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule, SearchChartLineComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: Router, useValue: new RouterStub() },
        {
          provide: RemoteDataBuildService,
          useValue: { aggregate: () => of({}) },
        },
        {
          provide: SEARCH_CONFIG_SERVICE,
          useValue: new SearchConfigurationServiceStub(),
        },
        {
          provide: SearchFilterService,
          useValue: {
            getSelectedValuesForFilter: () => of(selectedValues),
            isFilterActiveWithValue: (paramName: string, filterValue: string) => true,
            getPage: (paramName: string) => page,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            incrementPage: (filterName: string) => { },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            resetPage: (filterName: string) => { },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SearchChartLineComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartLineComponent);
    comp = fixture.componentInstance;
    comp.filterConfig = mockFilterConfig;
    filterService = (comp as any).filterService;
    searchService = (comp as any).searchService;
    spyOn(searchService, 'getFacetValuesFor').and.returnValue(mockValues);
    router = (comp as any).router;
    fixture.detectChanges();
  });

  it('should create SearchChartLineComponent', () => {
    expect(comp).toBeTruthy();
  });
});
