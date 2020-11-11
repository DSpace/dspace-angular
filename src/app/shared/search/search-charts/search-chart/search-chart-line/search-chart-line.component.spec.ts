import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { SEARCH_CONFIG_SERVICE } from '../../../../../+my-dspace-page/my-dspace-page.component';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { RouteService } from '../../../../../core/services/route.service';
import { FILTER_CONFIG, IN_PLACE_SEARCH, SearchFilterService } from '../../../../../core/shared/search/search-filter.service';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { RouterStub } from '../../../../testing/router.stub';
import { SearchConfigurationServiceStub } from '../../../../testing/search-configuration-service.stub';
import { SearchServiceStub } from '../../../../testing/search-service.stub';
import { FacetValue } from '../../../facet-value.model';
import { FilterType } from '../../../filter-type.model';
import { SearchFilterConfig } from '../../../search-filter-config.model';
import { SearchChartLineComponent } from './search-chart-line.component';

describe('SearchChartLineComponent', () => {
  let comp: SearchChartLineComponent;
  let fixture: ComponentFixture<SearchChartLineComponent>;
  const value1 = 'Value 1';
  const value2 = 'Value 2';
  const value3 = 'Value 3';
  const filterName1 = 'test name';
  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: filterName1,
    type: FilterType.range,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 2,
    minValue: 200,
    maxValue: 3000,
  });
  const values: FacetValue[] = [
    {
      label: value1,
      value: value1,
      count: 52,
      _links: {
        self: {
          href:''
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
          href:''
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
          href:''
        },
        search: {
          href: ''
        }
      }
    }
  ];

  const searchLink = '/search';
  const selectedValues = observableOf([]);
  const page = observableOf(0);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [SearchChartLineComponent],
      providers: [
        { provide: SearchService, useValue: new SearchServiceStub(searchLink) },
        { provide: Router, useValue: new RouterStub() },
        { provide: FILTER_CONFIG, useValue: mockFilterConfig },
        { provide: RemoteDataBuildService, useValue: {aggregate: () => observableOf({})} },
        { provide: RouteService, useValue: {getQueryParameterValue: () => observableOf({})} },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() },
        { provide: IN_PLACE_SEARCH, useValue: false },
        {
          provide: SearchFilterService, useValue: {
            getSelectedValuesForFilter: () => selectedValues,
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
    }).overrideComponent(SearchChartLineComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChartLineComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
