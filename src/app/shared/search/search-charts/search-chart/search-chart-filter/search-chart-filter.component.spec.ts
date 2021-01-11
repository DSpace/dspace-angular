import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FILTER_CONFIG, IN_PLACE_SEARCH, SearchFilterService } from '../../../../../core/shared/search/search-filter.service';
import { SearchFilterConfig } from '../../../search-filter-config.model';
import { FilterType } from '../../../filter-type.model';
import { FacetValue } from '../../../facet-value.model';
import { FormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchServiceStub } from '../../../../testing/search-service.stub';
import { PaginatedList } from '../../../../../core/data/paginated-list';
import { RouterStub } from '../../../../testing/router.stub';
import { Router } from '@angular/router';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { SearchConfigurationServiceStub } from '../../../../testing/search-configuration-service.stub';
import { SEARCH_CONFIG_SERVICE } from '../../../../../+my-dspace-page/my-dspace-page.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { SearchChartFilterComponent } from './search-chart-filter.component';

describe('SearchChartFilterComponent', () => {
  let comp: SearchChartFilterComponent;
  let fixture: ComponentFixture<SearchChartFilterComponent>;
  const value1 = 'Value 1';
  const value2 = 'Value 2';
  const value3 = 'Value 3';
  const filterName1 = 'test name';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType['chart.bar'],
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });
  const values: FacetValue[] = [
    {
      label: value1,
      value: value1,
      count: 52,
      _links: {
        self: {
          href: ''
        },
        search: {
          href: ''
        }
      }
    }, {
      label: value2,
      value: value2,
      count: 20,
      _links: {
        self: {
          href: ''
        },
        search: {
          href: ''
        }
      }
    }, {
      label: value3,
      value: value3,
      count: 5,
      _links: {
        self: {
          href: ''
        },
        search: {
          href: ''
        }
      }
    }
  ];

  const searchLink = '/search';
  const selectedValues = [value1, value2];
  let filterService;
  let searchService;
  let router;
  const page = observableOf(0);

  const mockValues = createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), values));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchChartFilterComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: Router, useValue: new RouterStub() },
        { provide: FILTER_CONFIG, useValue: new SearchFilterConfig() },
        { provide: RemoteDataBuildService, useValue: { aggregate: () => observableOf({}) } },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: IN_PLACE_SEARCH, useValue: false },
        {
          provide: SearchFilterService, useValue: {
            getSelectedValuesForFilter: () => observableOf(selectedValues),
            isFilterActiveWithValue: (paramName: string, filterValue: string) => true,
            getPage: (paramName: string) => page,
            /* tslint:disable:no-empty */
            incrementPage: (filterName: string) => {
            },
            resetPage: (filterName: string) => {
            }
            /* tslint:enable:no-empty */
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchChartFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartFilterComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filterConfig = mockFilterConfig;
    filterService = (comp as any).filterService;
    searchService = (comp as any).searchService;
    spyOn(searchService, 'getFacetValuesFor').and.returnValue(mockValues);
    router = (comp as any).router;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should call select with the correct filter configuration name', () => {
    spyOn(comp, 'select').and.callThrough();
  });

});
