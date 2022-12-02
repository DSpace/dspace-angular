import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchHierarchyFilterComponent } from './search-hierarchy-filter.component';
import { SearchService } from '../../../../../core/shared/search/search.service';
import {
  FILTER_CONFIG,
  IN_PLACE_SEARCH,
  REFRESH_FILTER,
  SearchFilterService
} from '../../../../../core/shared/search/search-filter.service';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { SearchFiltersComponent } from '../../search-filters.component';
import { Router } from '@angular/router';
import { RouterStub } from '../../../../testing/router.stub';
import { SearchServiceStub } from '../../../../testing/search-service.stub';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationServiceStub } from '../../../../testing/search-configuration-service.stub';
import { SearchFilterConfig } from '../../../models/search-filter-config.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  FilterInputSuggestionsComponent
} from '../../../../input-suggestions/filter-suggestions/filter-input-suggestions.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { FacetValue } from '../../../models/facet-value.model';
import { FilterType } from '../../../models/filter-type.model';
import { createPaginatedList } from '../../../../testing/utils.test';
import { RemoteData } from '../../../../../core/data/remote-data';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';

describe('SearchHierarchyFilterComponent', () => {
  let comp: SearchHierarchyFilterComponent;
  let fixture: ComponentFixture<SearchHierarchyFilterComponent>;
  let searchService: SearchService;
  let router;

  const value1 = 'testvalue1';
  const value2 = 'test2';
  const value3 = 'another value3';
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
  const mockValues = createSuccessfulRemoteDataObject$(createPaginatedList(values));

  const searchFilterServiceStub = {
    getSelectedValuesForFilter(_filterConfig: SearchFilterConfig): Observable<string[]> {
      return observableOf(values.map((value: FacetValue) => value.value));
    },
    getPage(_paramName: string): Observable<number> {
      return observableOf(0);
    },
    resetPage(_filterName: string): void {
      // empty
    }
  };

  const remoteDataBuildServiceStub = {
    aggregate(_input: Observable<RemoteData<FacetValue>>[]): Observable<RemoteData<PaginatedList<FacetValue>[]>> {
      return createSuccessfulRemoteDataObject$([createPaginatedList(values)]);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [
        SearchHierarchyFilterComponent,
        SearchFiltersComponent,
        FilterInputSuggestionsComponent
      ],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub() },
        { provide: SearchFilterService, useValue: searchFilterServiceStub },
        { provide: RemoteDataBuildService, useValue: remoteDataBuildServiceStub },
        { provide: Router, useValue: new RouterStub() },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: IN_PLACE_SEARCH, useValue: false },
        { provide: FILTER_CONFIG, useValue: new SearchFilterConfig() },
        { provide: REFRESH_FILTER, useValue: new BehaviorSubject<boolean>(false) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchHierarchyFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  })
  ;
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'filterName1',
    filterType: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(SearchHierarchyFilterComponent);
    comp = fixture.componentInstance; // SearchHierarchyFilterComponent test instance
    comp.filterConfig = mockFilterConfig;
    searchService = (comp as any).searchService;
    // @ts-ignore
    spyOn(searchService, 'getFacetValuesFor').and.returnValue(mockValues);
    router = (comp as any).router;
    fixture.detectChanges();
  });

  it('should navigate to the correct filter with the query operator', () => {
    expect((comp as any).searchService.getFacetValuesFor).toHaveBeenCalledWith(comp.filterConfig, 0, {}, null, true);

    const searchQuery = 'MARVEL';
    comp.onSubmit(searchQuery);

    expect(router.navigate).toHaveBeenCalledWith(['', 'search'], Object({
      queryParams: Object({ [mockFilterConfig.paramName]: [...values.map((value: FacetValue) => `${value.value},equals`), `${searchQuery},query`] }),
      queryParamsHandling: 'merge'
    }));
  });
});
