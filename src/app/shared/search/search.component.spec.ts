import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';

import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { BehaviorSubject, Observable, of, of as observableOf } from 'rxjs';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { HostWindowService } from '../host-window.service';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SearchComponent } from './search.component';
import { SearchService } from '../../core/shared/search/search.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from '../sidebar/sidebar.service';
import { SearchFilterService } from '../../core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-page.component';
import { XSRFService } from '../../core/xsrf/xsrf.service';
import { RouteService } from '../../core/services/route.service';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { PaginatedSearchOptions } from './models/paginated-search-options.model';
import { SidebarServiceStub } from '../testing/sidebar-service.stub';
import { SearchConfig, SortConfig } from '../../core/shared/search/search-filters/search-config.model';
import { Item } from '../../core/shared/item.model';
import { RemoteData } from '../../core/data/remote-data';
import { SearchObjects } from './models/search-objects.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchManager } from '../../core/browse/search-manager';
import { SearchFilterConfig } from './models/search-filter-config.model';
import { FilterType } from './models/filter-type.model';
import { getCommunityPageRoute } from '../../community-page/community-page-routing-paths';
import { getCollectionPageRoute } from '../../collection-page/collection-page-routing-paths';
import { environment } from '../../../environments/environment.test';
import { APP_CONFIG } from '../../../config/app-config.interface';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';

let comp: SearchComponent;
let fixture: ComponentFixture<SearchComponent>;
let searchServiceObject: SearchService;
let searchConfigurationServiceObject: SearchConfigurationService;

const authorizationDataService = jasmine.createSpyObj('authorizationDataService', {
  isAuthorized: of(true)
});

const store: Store<SearchComponent> = jasmine.createSpyObj('store', {
  /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
  dispatch: {},
  /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
  select: observableOf(true)
});
const sortConfigList: SortConfig[] = [
  { name: 'score', sortOrder: SortDirection.DESC },
  { name: 'dc.title', sortOrder: SortDirection.ASC },
  { name: 'dc.title', sortOrder: SortDirection.DESC }
];
const sortOptionsList: SortOptions[] = [
  new SortOptions('score', SortDirection.DESC),
  new SortOptions('dc.title', SortDirection.ASC),
  new SortOptions('dc.title', SortDirection.DESC)
];
const searchConfig = Object.assign(new SearchConfig(), {
  sortOptions: sortConfigList
});
const paginationId = 'search-test-page-id';
const pagination: PaginationComponentOptions = new PaginationComponentOptions();
pagination.id = paginationId;
pagination.currentPage = 1;
pagination.pageSize = 10;
const mockDso = Object.assign(new Item(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Item nr 1'
      }
    ]
  },
  _links: {
    self: {
      href: 'selfLink1'
    }
  }
});

const mockDso2 = Object.assign(new Item(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Item nr 2'
      }
    ]
  },
  _links: {
    self: {
      href: 'selfLink2'
    }
  }
});
const mockSearchResults: SearchObjects<DSpaceObject> = Object.assign(new SearchObjects(), {
  page: [mockDso, mockDso2]
});
const mockResultsRD: RemoteData<SearchObjects<DSpaceObject>> = createSuccessfulRemoteDataObject(mockSearchResults);
const mockResultsRD$: Observable<RemoteData<SearchObjects<DSpaceObject>>> = observableOf(mockResultsRD);

const mockFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
  name: 'test1',
  filterType: FilterType.text,
  hasFacets: false,
  isOpenByDefault: false,
  pageSize: 2
});
const mockFilterConfig2: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
  name: 'test2',
  filterType: FilterType.text,
  hasFacets: false,
  isOpenByDefault: false,
  pageSize: 1
});
const mockChartFilterConfig: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
  name: 'line',
  filterType: FilterType['chart.line'],
  hasFacets: false,
  isOpenByDefault: false,
  pageSize: 1
});

const filtersConfigRD = createSuccessfulRemoteDataObject([mockFilterConfig, mockFilterConfig2, mockChartFilterConfig]);
const resultFiltersConfigRD = createSuccessfulRemoteDataObject([mockFilterConfig, mockFilterConfig2]);
const filtersConfigRD$ = observableOf(filtersConfigRD);

const searchServiceStub = jasmine.createSpyObj('SearchService', {
  getSearchLink: '/search',
  getScopes: observableOf(['test-scope']),
  getSearchConfigurationFor: createSuccessfulRemoteDataObject$(searchConfig),
  getConfig: filtersConfigRD$,
  trackSearch: {},
}) as SearchService;
const searchManagerStub = jasmine.createSpyObj('SearchManager', {
  search: mockResultsRD$,
});
const configurationParam = 'default';
const queryParam = 'test query';
const hiddenQuery = 'hidden query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';

const defaultSearchOptions = new PaginatedSearchOptions({ pagination });

const paginatedSearchOptions$ = new BehaviorSubject(defaultSearchOptions);

const activatedRouteStub = {
  snapshot: {
    queryParamMap: new Map([
      ['query', queryParam],
      ['scope', scopeParam]
    ])
  },
  queryParams: observableOf({
    query: queryParam,
    scope: scopeParam
  })
};

const routeServiceStub = {
  getQueryParameterValue: () => {
    return observableOf(null);
  },
  getQueryParamsWithPrefix: () => {
    return observableOf(null);
  },
  setParameter: () => {
    return;
  }
};

let searchConfigurationServiceStub;

export function configureSearchComponentTestingModule(compType, additionalDeclarations: any[] = []) {
  searchConfigurationServiceStub = jasmine.createSpyObj('SearchConfigurationService', {
    getConfigurationSortOptions: sortOptionsList,
    getConfig: filtersConfigRD$,
    getConfigurationSearchConfig: observableOf(searchConfig),
    getCurrentConfiguration: observableOf('default'),
    getCurrentScope: observableOf('test-id'),
    getCurrentSort: observableOf(sortOptionsList[0]),
    updateFixedFilter: jasmine.createSpy('updateFixedFilter'),
    setPaginationId: jasmine.createSpy('setPaginationId')
  });

  searchConfigurationServiceStub.setPaginationId.and.callFake((pageId) => {
    paginatedSearchOptions$.next(Object.assign(paginatedSearchOptions$.value, {
      pagination: Object.assign(new PaginationComponentOptions(), {
        id: pageId
      })
    }));
  });
  searchConfigurationServiceStub.paginatedSearchOptions = new BehaviorSubject(new PaginatedSearchOptions({pagination: {id: 'default'} as any}));

  TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, NgbCollapseModule],
    declarations: [compType, ...additionalDeclarations],
    providers: [
      { provide: SearchService, useValue: searchServiceStub },
      { provide: SearchManager, useValue: searchManagerStub },
      {
        provide: CommunityDataService,
        useValue: jasmine.createSpyObj('communityService', ['findById', 'findAll'])
      },
      { provide: ActivatedRoute, useValue: activatedRouteStub },
      { provide: RouteService, useValue: routeServiceStub },
      {
        provide: Store, useValue: store
      },
      {
        provide: HostWindowService, useValue: jasmine.createSpyObj('hostWindowService',
          {
            isXs: observableOf(true),
            isSm: observableOf(false),
            isXsOrSm: observableOf(true)
          })
      },
      {
        provide: SidebarService,
        useValue: SidebarServiceStub
      },
      {
        provide: SearchFilterService,
        useValue: {}
      },
      { provide: XSRFService, useValue: {} },
      {
        provide: SEARCH_CONFIG_SERVICE,
        useValue: searchConfigurationServiceStub
      },
      { provide: APP_CONFIG, useValue: environment },
      { provide: PLATFORM_ID, useValue: 'browser' },
      {
        provide: AuthorizationDataService,
        useValue: authorizationDataService
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).overrideComponent(compType, {
    set: {
      changeDetection: ChangeDetectionStrategy.Default,
      providers: [{
        provide: SearchConfigurationService,
        useValue: searchConfigurationServiceStub
      }]
    },

  }).compileComponents();
}

describe('SearchComponent', () => {
  beforeEach(waitForAsync(() => {
    configureSearchComponentTestingModule(SearchComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    comp = fixture.componentInstance; // SearchComponent test instance
    comp.inPlaceSearch = false;
    comp.paginationId = paginationId;
    comp.hiddenQuery = hiddenQuery;

    spyOn((comp as any), 'getSearchOptions').and.returnValue(paginatedSearchOptions$.asObservable());
  });

  afterEach(() => {
    comp = null;
  });

  it('should init search parameters properly and call retrieveSearchResults', fakeAsync(() => {
    spyOn((comp as any), 'retrieveSearchResults').and.callThrough();
    fixture.detectChanges();
    tick(100);

    const expectedSearchOptions = Object.assign(paginatedSearchOptions$.value, {
      configuration: 'default',
      sort: sortOptionsList[0],
      forcedEmbeddedKeys: ['metrics']
    });
    expect(comp.currentConfiguration$).toBeObservable(cold('b', {
      b: 'default'
    }));
    expect(comp.currentSortOptions$).toBeObservable(cold('b', {
      b: sortOptionsList[0]
    }));
    expect(comp.sortOptionsList$).toBeObservable(cold('b', {
      b: sortOptionsList
    }));
    expect(comp.searchOptions$).toBeObservable(cold('b', {
      b: expectedSearchOptions
    }));
    expect((comp as any).retrieveSearchResults).toHaveBeenCalledWith(expectedSearchOptions);
  }));

  it('should retrieve SearchResults', fakeAsync(() => {
    fixture.detectChanges();
    tick(100);
    const expectedResults = mockResultsRD;
    expect(comp.resultsRD$).toBeObservable(cold('b', {
      b: expectedResults
    }));
  }));

  it('should retrieve Search Filters', fakeAsync(() => {
    fixture.detectChanges();
    tick(100);
    const expectedResults = resultFiltersConfigRD;
    expect(comp.filtersRD$).toBeObservable(cold('b', {
      b: expectedResults
    }));
  }));

  it('should emit resultFound event', fakeAsync(() => {
    spyOn(comp.resultFound, 'emit');
    const expectedResults = mockSearchResults;
    fixture.detectChanges();
    tick(100);
    expect(comp.resultFound.emit).toHaveBeenCalledWith(expectedResults);
  }));

  it('should show correction badge when item is a correction', fakeAsync(() => {
    comp.ngOnInit();
    tick(100);
    expect(comp.showCorrection).toBe(true);
  }));

  describe('when the open sidebar button is clicked in mobile view', () => {

    beforeEach(() => {
      spyOn(comp, 'openSidebar');
    });

    it('should trigger the openSidebar function', fakeAsync(() => {
      fixture.detectChanges();
      tick(100);
      fixture.detectChanges();
      const openSidebarButton = fixture.debugElement.query(By.css('.open-sidebar'));
      openSidebarButton.triggerEventHandler('click', null);
      expect(comp.openSidebar).toHaveBeenCalled();
    }));

  });

  describe('getDsoUUIDFromUrl', () => {
    let url: string;
    let result: string;

    describe('when the navigated URL is an entity route', () => {
      beforeEach(() => {
        url = '/entities/publication/9a364471-3f19-4e7b-916a-a24a44ff48e3';
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return the UUID', () => {
        expect(result).toEqual('9a364471-3f19-4e7b-916a-a24a44ff48e3');
      });
    });

    describe('when the navigated URL is a community route', () => {
      beforeEach(() => {
        url = `${getCommunityPageRoute('9a364471-3f19-4e7b-916a-a24a44ff48e3')}`;
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return the UUID', () => {
        expect(result).toEqual('9a364471-3f19-4e7b-916a-a24a44ff48e3');
      });
    });

    describe('when the navigated URL is a collection route', () => {
      beforeEach(() => {
        url = `${getCollectionPageRoute('9a364471-3f19-4e7b-916a-a24a44ff48e3')}`;
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return the UUID', () => {
        expect(result).toEqual('9a364471-3f19-4e7b-916a-a24a44ff48e3');
      });
    });

    describe('when the navigated URL is an item route', () => {
      beforeEach(() => {
        url = '/items/9a364471-3f19-4e7b-916a-a24a44ff48e3';
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return the UUID', () => {
        expect(result).toEqual('9a364471-3f19-4e7b-916a-a24a44ff48e3');
      });
    });

    describe('when the navigated URL is an invalid route', () => {
      beforeEach(() => {
        url = '/invalid/object/route/9a364471-3f19-4e7b-916a-a24a44ff48e3';
        result = (comp as any).getDsoUUIDFromUrl(url);
      });

      it('should return null', () => {
        expect(result).toBeNull();
      });
    });

    describe('when rendered in SSR', () => {
      beforeEach(() => {
        comp.platformId = 'server';
      });

      it('should not call search method on init', (done) => {
        comp.ngOnInit();
        //Check that the first method from which the search depend upon is not being called
        expect(searchConfigurationServiceStub.getCurrentConfiguration).not.toHaveBeenCalled();
        comp.initialized$.subscribe((res) => {
          expect(res).toBeTruthy();
          done();
        });
      });
    });

    describe('when rendered in CSR', () => {
      beforeEach(() => {
        comp.platformId = 'browser';
      });

      it('should call search method on init', fakeAsync(() => {
        comp.ngOnInit();
        tick(100);
        //Check that the last method from which the search depend upon is being called
        expect(searchManagerStub.search).toHaveBeenCalled();
      }));
    });
  });
});
