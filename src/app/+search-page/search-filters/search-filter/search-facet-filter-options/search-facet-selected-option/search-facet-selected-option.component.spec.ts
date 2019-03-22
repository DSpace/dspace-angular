import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterConfig } from '../../../../search-service/search-filter-config.model';
import { FilterType } from '../../../../search-service/filter-type.model';
import { FormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { SearchService } from '../../../../search-service/search.service';
import { SearchServiceStub } from '../../../../../shared/testing/search-service-stub';
import { Router } from '@angular/router';
import { RouterStub } from '../../../../../shared/testing/router-stub';
import { SearchConfigurationService } from '../../../../search-service/search-configuration.service';
import { SearchFilterService } from '../../search-filter.service';
import { SearchFacetSelectedOptionComponent } from './search-facet-selected-option.component';

describe('SearchFacetSelectedOptionComponent', () => {
  let comp: SearchFacetSelectedOptionComponent;
  let fixture: ComponentFixture<SearchFacetSelectedOptionComponent>;
  const filterName1 = 'test name';
  const value1 = 'testvalue1';
  const value2 = 'test2';
  const mockFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.range,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2,
    minValue: 200,
    maxValue: 3000,
  });

  const searchLink = '/search';
  const selectedValues = [value1, value2];
  const selectedValues$ = observableOf(selectedValues);
  let filterService;
  let searchService;
  let router;
  const page = observableOf(0);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchFacetSelectedOptionComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: Router, useValue: new RouterStub() },
        {
          provide: SearchConfigurationService, useValue: {
            searchOptions: observableOf({})
          }
        },
        {
          provide: SearchFilterService, useValue: {
            getSelectedValuesForFilter: () => selectedValues,
            isFilterActiveWithValue: (paramName: string, filterValue: string) => observableOf(true),
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
    }).overrideComponent(SearchFacetSelectedOptionComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetSelectedOptionComponent);
    comp = fixture.componentInstance; // SearchFacetSelectedOptionComponent test instance
    filterService = (comp as any).filterService;
    searchService = (comp as any).searchService;
    router = (comp as any).router;
    comp.selectedValue = value2;
    comp.selectedValues$ = selectedValues$;
    comp.filterConfig = mockFilterConfig;
    fixture.detectChanges();
  });

  describe('when the updateRemoveParams method is called wih a value', () => {
    it('should update the removeQueryParams with the new parameter values', () => {
      comp.removeQueryParams = {};
      (comp as any).updateRemoveParams(selectedValues);
      expect(comp.removeQueryParams).toEqual({
        [mockFilterConfig.paramName]: [value1],
        page: 1
      });
    });
  });
});
