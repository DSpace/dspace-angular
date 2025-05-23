import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { SearchService } from '../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { FacetValue } from '../../shared/search/models/facet-value.model';
import { FilterType } from '../../shared/search/models/filter-type.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { SearchFilterConfig } from '../../shared/search/models/search-filter-config.model';
import { SearchServiceStub } from '../../shared/testing/search-service.stub';
import { BrowseByGeospatialDataComponent } from './browse-by-geospatial-data.component';

// create route stub
const scope = 'test scope';
const activatedRouteStub = {
  queryParams: of({
    scope: scope,
  }),
};

// Mock search filter config
const mockFilterConfig = Object.assign(new SearchFilterConfig(), {
  name: 'point',
  type: FilterType.text,
  hasFacets: true,
  isOpenByDefault: false,
  pageSize: 2,
  minValue: 200,
  maxValue: 3000,
});

// Mock facet values with and without point data
const facetValue: FacetValue = {
  label: 'test',
  value: 'test',
  count: 20,
  _links: {
    self: { href: 'selectedValue-self-link2' },
    search: { href: `` },
  },
};
const pointFacetValue: FacetValue = {
  label: 'test point',
  value: 'Point ( +174.000000 -042.000000 )',
  count: 20,
  _links: {
    self: { href: 'selectedValue-self-link' },
    search: { href: `` },
  },
};
const mockValues = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [facetValue]));
const mockPointValues = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [pointFacetValue]));

// Expected search options used in getFacetValuesFor call
const expectedSearchOptions: PaginatedSearchOptions = Object.assign({
  'configuration': environment.geospatialMapViewer.spatialFacetDiscoveryConfiguration,
  'scope': scope,
  'facetLimit': 99999,
});

// Mock search config service returns mock search filter config on getConfig()
const mockSearchConfigService = jasmine.createSpyObj('searchConfigurationService', {
  getConfig: createSuccessfulRemoteDataObject$([mockFilterConfig]),
});
let searchService: SearchServiceStub = new SearchServiceStub();

// initialize testing environment
describe('BrowseByGeospatialDataComponent', () => {
  let component: BrowseByGeospatialDataComponent;
  let fixture: ComponentFixture<BrowseByGeospatialDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot(), StoreModule.forRoot(), BrowseByGeospatialDataComponent],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: SearchConfigurationService, useValue: mockSearchConfigService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByGeospatialDataComponent);
    component = fixture.componentInstance;
  });

  it('component should be created successfully', () => {
    expect(component).toBeTruthy();
  });
  describe('BrowseByGeospatialDataComponent component with valid facet values', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(BrowseByGeospatialDataComponent);
      component = fixture.componentInstance;
      spyOn(searchService, 'getFacetValuesFor').and.returnValue(mockPointValues);
      component.scope$ = of('');
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call searchConfigService.getConfig() after init', waitForAsync(() => {
      expect(mockSearchConfigService.getConfig).toHaveBeenCalled();
    }));

    it('should call searchService.getFacetValuesFor() with expected parameters', waitForAsync(() => {
      component.getFacetValues().subscribe(() => {
        expect(searchService.getFacetValuesFor).toHaveBeenCalledWith(mockFilterConfig, 1, expectedSearchOptions, null, true);
      });
    }));
  });

  describe('BrowseByGeospatialDataComponent component with invalid facet values (no point data)', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(BrowseByGeospatialDataComponent);
      component = fixture.componentInstance;
      spyOn(searchService, 'getFacetValuesFor').and.returnValue(mockValues);
      component.scope$ = of('');
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should call searchConfigService.getConfig() after init', waitForAsync(() => {
      expect(mockSearchConfigService.getConfig).toHaveBeenCalled();
    }));

    it('should call searchService.getFacetValuesFor() with expected parameters', waitForAsync(() => {
      component.getFacetValues().subscribe(() => {
        expect(searchService.getFacetValuesFor).toHaveBeenCalledWith(mockFilterConfig, 1, expectedSearchOptions, null, true);
      });
    }));
  });

});
