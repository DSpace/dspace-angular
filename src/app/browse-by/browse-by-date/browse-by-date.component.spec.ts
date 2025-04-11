import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
import { BrowseService } from '../../core/browse/browse.service';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { BrowseEntry } from '../../core/shared/browse-entry.model';
import { Community } from '../../core/shared/community.model';
import { Item } from '../../core/shared/item.model';
import { SearchService } from '../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SearchConfig } from '../../core/shared/search/search-filters/search-config.model';
import { ThemedBrowseByComponent } from '../../shared/browse-by/themed-browse-by.component';
import { ThemedComcolPageBrowseByComponent } from '../../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ComcolPageContentComponent } from '../../shared/comcol/comcol-page-content/comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { RouterMock } from '../../shared/mocks/router.mock';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { FacetValues } from '../../shared/search/models/facet-values.model';
import { FilterType } from '../../shared/search/models/filter-type.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { SearchFilterConfig } from '../../shared/search/models/search-filter-config.model';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { toRemoteData } from '../browse-by-metadata/browse-by-metadata.component.spec';
import { BrowseByDateComponent } from './browse-by-date.component';

describe('BrowseByDateComponent', () => {
  let comp: BrowseByDateComponent;
  let fixture: ComponentFixture<BrowseByDateComponent>;
  let route: ActivatedRoute;
  let paginationService;

  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    metadata: [
      {
        key: 'dc.title',
        value: 'test community',
      },
    ],
  });

  const firstItem = Object.assign(new Item(), {
    id: 'first-item-id',
    metadata: {
      'dc.date.issued': [
        {
          value: '1950-01-01',
        },
      ],
    },
  });
  const lastItem = Object.assign(new Item(), {
    id: 'last-item-id',
    metadata: {
      'dc.date.issued': [
        {
          value: '1960-01-01',
        },
      ],
    },
  });

  const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType.range,
    hasFacets: false,
    isOpenByDefault: false,
    pageSize: 1,
  });

  const mockFacetValue: FacetValues  =
    Object.assign(new FacetValues(), {
      authorityKey: null,
      count: 1,
      label: '2009 - 2009',
      value: '2009 - 2009',
      type: 'discover',
    });


  const filtersConfigRD = createSuccessfulRemoteDataObject([mockFilterConfig]);
  const filtersConfigRD$ = observableOf(filtersConfigRD);

  const mockBrowseService = {
    getBrowseEntriesFor: (options: BrowseEntrySearchOptions) => toRemoteData([]),
    getBrowseItemsFor: (value: string, options: BrowseEntrySearchOptions) => toRemoteData([firstItem]),
    getFirstItemFor: (definition: string, scope?: string, sortDirection?: SortDirection) => null,
  };

  const mockSearchConfigService = {
    getConfig: () => filtersConfigRD$,
  };

  const mockSearchService = {
    getFacetValuesFor: (filterConfig: SearchFilterConfig, valuePage: number, searchOptions?: PaginatedSearchOptions, filterQuery?: string, useCachedVersionIfAvailable = true) => toRemoteData([mockFacetValue]),
  };

  const mockDsoService = {
    findById: () => createSuccessfulRemoteDataObject$(mockCommunity),
  };

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({}),
    queryParams: observableOf({}),
    data: observableOf({ metadata: 'dateissued', metadataField: 'dc.date.issued' }),
  });

  const mockCdRef = Object.assign({
    detectChanges: () => fixture.detectChanges(),
  });

  paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NgbModule,
        BrowseByDateComponent,
        EnumKeysPipe,
        VarDirective,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BrowseService, useValue: mockBrowseService },
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
        { provide: Router, useValue: new RouterMock() },
        { provide: PaginationService, useValue: paginationService },
        { provide: ChangeDetectorRef, useValue: mockCdRef },
        { provide: Store, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SearchConfigurationService, useValue: mockSearchConfigService },
        { provide: SearchService, useValue: mockSearchService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BrowseByDateComponent, {
        remove: {
          imports: [
            ComcolPageHeaderComponent,
            ComcolPageLogoComponent,
            ThemedComcolPageHandleComponent,
            ComcolPageContentComponent,
            ThemedComcolPageBrowseByComponent,
            ThemedLoadingComponent,
            ThemedBrowseByComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByDateComponent);
    comp = fixture.componentInstance;
    comp.browseId = 'dateissued';
    route = (comp as any).route;
    fixture.detectChanges();
  });

  it('should initialize the list of items', (done: DoneFn) => {
    expect(comp.loading$).toBeObservable(cold('(a|)', {
      a: false,
    }));
    comp.items$.subscribe((result) => {
      expect(result.payload.page).toEqual([firstItem]);
      done();
    });
  });

  it('should create a list of startsWith options with the earliest year at the end (rounded down by 10)', () => {
    expect(comp.startsWithOptions[comp.startsWithOptions.length - 1]).toEqual(2009);
  });

  it('should create a list of startsWith options with the current year first', () => {
    //expect(comp.startsWithOptions[0]).toEqual(new Date().getUTCFullYear());
    expect(comp.startsWithOptions[0]).toEqual(2009);
  });

  describe('when rendered in SSR', () => {
    beforeEach(() => {
      comp.platformId = 'server';
      spyOn((comp as any).browseService, 'getBrowseItemsFor');
    });

    it('should not call getBrowseItemsFor on init', (done) => {
      comp.ngOnInit();
      expect((comp as any).browseService.getBrowseItemsFor).not.toHaveBeenCalled();
      comp.loading$.subscribe((res) => {
        expect(res).toBeFalsy();
        done();
      });
    });
  });

  describe('when rendered in CSR', () => {
    beforeEach(() => {
      comp.platformId = 'browser';
      spyOn((comp as any).browseService, 'getBrowseItemsFor').and.returnValue(createSuccessfulRemoteDataObject$(new BrowseEntry()));
      spyOn((comp as any).searchConfigService, 'getConfig').and.returnValue(createSuccessfulRemoteDataObject$([new SearchConfig()]));
      spyOn((comp as any).searchService, 'getFacetValuesFor').and.returnValue(createSuccessfulRemoteDataObject$([new FacetValues()]));
    });

    it('should call getBrowseItemsFor on init', fakeAsync(() => {
      comp.ngOnInit();
      tick(100);
      expect((comp as any).browseService.getBrowseItemsFor).toHaveBeenCalled();
      expect((comp as any).searchConfigService.getConfig).toHaveBeenCalled();
      expect((comp as any).searchService.getFacetValuesFor).toHaveBeenCalled();
    }));
  });
});
