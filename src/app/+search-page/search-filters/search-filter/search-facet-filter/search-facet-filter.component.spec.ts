import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFacetFilterComponent } from './search-facet-filter.component';
import { SearchFilterService } from '../search-filter.service';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { FilterType } from '../../../search-service/filter-type.model';
import { FacetValue } from '../../../search-service/facet-value.model';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

describe('SearchFacetFilterComponent', () => {
  let comp: SearchFacetFilterComponent;
  let fixture: ComponentFixture<SearchFacetFilterComponent>;
  const filterName1 = 'test name';
  const value1 = 'testvalue1';
  const value2 = 'test2';
  const value3 = 'another value3';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.text,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2
  });
  const values: FacetValue[] = [
    {
      value: value1,
      count: 52,
      search: ''
    }, {
      value: value2,
      count: 20,
      search: ''
    }, {
      value: value3,
      count: 5,
      search: ''
    }
  ];
  let filterService;
  let page = Observable.of(0)
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, FormsModule],
      declarations: [SearchFacetFilterComponent],
      providers: [
        {
          provide: SearchFilterService,
          useValue: {
            isFilterActiveWithValue: (paramName: string, filterValue: string) => true,
            getQueryParamsWith: (paramName: string, filterValue: string) => '',
            getQueryParamsWithout: (paramName: string, filterValue: string) => '',
            getPage: (paramName: string) => page,
            /* tslint:disable:no-empty */
            incrementPage: (filterName: string) => {
            },
            resetPage: (filterName: string) => {
            },
            /* tslint:enable:no-empty */
            searchLink: '/search',
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchFacetFilterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetFilterComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.filterConfig = mockFilterConfig;
    comp.filterValues = values;
    filterService = (comp as any).filterService;
    fixture.detectChanges();
  });

  describe('when the isChecked method is called with a value', () => {
    beforeEach(() => {
      spyOn(filterService, 'isFilterActiveWithValue');
      comp.isChecked(values[1]);
    });

    it('should call isFilterActiveWithValue on the filterService with the correct filter parameter name and the passed value', () => {
      expect(filterService.isFilterActiveWithValue).toHaveBeenCalledWith(mockFilterConfig.paramName, values[1].value)
    });
  });

  describe('when the getSearchLink method is triggered', () => {
    let link: string;
    beforeEach(() => {
      link = comp.getSearchLink();
    });

    it('should return the value of the searchLink variable in the filter service', () => {
      expect(link).toEqual(filterService.searchLink);
    });
  });

  describe('when the getQueryParamsWith method is called wih a value', () => {
    beforeEach(() => {
      spyOn(filterService, 'getQueryParamsWith');
      comp.getQueryParamsWith(values[1].value);
    });

    it('should call getQueryParamsWith on the filterService with the correct filter parameter name and the passed value', () => {
      expect(filterService.getQueryParamsWith).toHaveBeenCalledWith(mockFilterConfig, values[1].value)
    });
  });

  describe('when the getQueryParamsWithout method is called wih a value', () => {
    beforeEach(() => {
      spyOn(filterService, 'getQueryParamsWithout');
      comp.getQueryParamsWithout(values[1].value);
    });

    it('should call getQueryParamsWithout on the filterService with the correct filter parameter name and the passed value', () => {
      expect(filterService.getQueryParamsWithout).toHaveBeenCalledWith(mockFilterConfig, values[1].value)
    });
  });

  describe('when the facetCount method is triggered when there are less items than the amount of pages should display', () => {
    let count: Observable<number>;
    beforeEach(() => {
      comp.currentPage = Observable.of(3);
      // 2 x 3 = 6, there are only 3 values
      count = comp.facetCount;
    });

    it('should return the correct number of items shown (this equals the total amount of values for this filter)', () => {
      const sub = count.subscribe((c) => expect(c).toBe(values.length));
      sub.unsubscribe();
    });
  });

  describe('when the facetCount method is triggered when there are more items than the amount of pages should display', () => {
    let count: Observable<number>;
    beforeEach(() => {
      comp.currentPage = Observable.of(1);
      // 2 x 1 = 2, there are more than 2 (3) items
      count = comp.facetCount;
    });

    it('should return the correct number of items shown (this equals the page count x page size)', () => {
      const sub = count.subscribe((c) => {
        const subsub = comp.currentPage.subscribe((page) => {
          expect(c).toBe(page * mockFilterConfig.pageSize);
        });
        subsub.unsubscribe()
      });
      sub.unsubscribe();
    });
  });

  describe('when the showMore method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'incrementPage');
      comp.showMore();
    });

    it('should call incrementPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.incrementPage).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });

  describe('when the showFirstPageOnly method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'resetPage');
      comp.showFirstPageOnly();
    });

    it('should call resetPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.resetPage).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });

  describe('when the getCurrentPage method is called', () => {
    beforeEach(() => {
      spyOn(filterService, 'getPage');
      comp.getCurrentPage();
    });

    it('should call getPage on the filterService with the correct filter parameter name', () => {
      expect(filterService.getPage).toHaveBeenCalledWith(mockFilterConfig.name)
    });
  });
});