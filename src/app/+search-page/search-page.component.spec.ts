import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { HostWindowService } from '../shared/host-window.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchPageComponent } from './search-page.component';
import { SearchService } from './search-service/search.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { SearchFilterService } from './search-filters/search-filter/search-filter.service';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { RemoteData } from '../core/data/remote-data';
import { SEARCH_CONFIG_SERVICE } from '../+my-dspace-page/my-dspace-page.component';
import { RouteService } from '../core/services/route.service';
import { SearchConfigurationServiceStub } from '../shared/testing/search-configuration-service-stub';
import { PaginatedSearchOptions } from './paginated-search-options.model';
import { SearchFixedFilterService } from './search-filters/search-filter/search-fixed-filter.service';
import { createSuccessfulRemoteDataObject$ } from '../shared/testing/utils';

let comp: SearchPageComponent;
let fixture: ComponentFixture<SearchPageComponent>;
let searchServiceObject: SearchService;
let searchConfigurationServiceObject: SearchConfigurationService;
const store: Store<SearchPageComponent> = jasmine.createSpyObj('store', {
  /* tslint:disable:no-empty */
  dispatch: {},
  /* tslint:enable:no-empty */
  select: observableOf(true)
});
const pagination: PaginationComponentOptions = new PaginationComponentOptions();
pagination.id = 'search-results-pagination';
pagination.currentPage = 1;
pagination.pageSize = 10;
const sort: SortOptions = new SortOptions('score', SortDirection.DESC);
const mockResults = createSuccessfulRemoteDataObject$(['test', 'data']);
const searchServiceStub = jasmine.createSpyObj('SearchService', {
  search: mockResults,
  getSearchLink: '/search',
  getScopes: observableOf(['test-scope'])
});
const configurationParam = 'default';
const queryParam = 'test query';
const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
const fixedFilter = 'fixed filter';
const paginatedSearchOptions = new PaginatedSearchOptions({
  configuration: configurationParam,
  query: queryParam,
  scope: scopeParam,
  fixedFilter: fixedFilter,
  pagination,
  sort
});
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
const sidebarService = {
  isCollapsed: observableOf(true),
  collapse: () => this.isCollapsed = observableOf(true),
  expand: () => this.isCollapsed = observableOf(false)
};

const routeServiceStub = {
  getRouteParameterValue: () => {
    return observableOf('');
  },
  getQueryParameterValue: () => {
    return observableOf('')
  },
  getQueryParamsWithPrefix: () => {
    return observableOf('')
  }
};
const mockFixedFilterService: SearchFixedFilterService = {
  getQueryByFilterName: (filter: string) => {
    return observableOf(undefined)
  }
} as SearchFixedFilterService;

export function configureSearchComponentTestingModule(compType) {
  TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, NgbCollapseModule.forRoot()],
    declarations: [compType],
    providers: [
      { provide: SearchService, useValue: searchServiceStub },
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
        provide: SearchSidebarService,
        useValue: sidebarService
      },
      {
        provide: SearchFilterService,
        useValue: {}
      },
      {
        provide: SearchFixedFilterService,
        useValue: mockFixedFilterService
      },
      {
        provide: SearchConfigurationService,
        useValue: {
          paginatedSearchOptions: hot('a', {
            a: paginatedSearchOptions
          }),
          getCurrentScope: (a) => observableOf('test-id'),
          /* tslint:disable:no-empty */
          updateFixedFilter: (newFilter) => {
          }
          /* tslint:enable:no-empty */
        }
      },
      {
        provide: SEARCH_CONFIG_SERVICE,
        useValue: new SearchConfigurationServiceStub()
      },
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).overrideComponent(compType, {
    set: { changeDetection: ChangeDetectionStrategy.Default }
  }).compileComponents();
}

describe('SearchPageComponent', () => {
  beforeEach(async(() => {
    configureSearchComponentTestingModule(SearchPageComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    fixture.detectChanges();
    searchServiceObject = (comp as any).service;
    searchConfigurationServiceObject = (comp as any).searchConfigService;
  });

  afterEach(() => {
    comp = null;
    searchServiceObject = null;
    searchConfigurationServiceObject = null;
  });

  it('should get the scope and query from the route parameters', () => {

    searchConfigurationServiceObject.paginatedSearchOptions.next(paginatedSearchOptions);
    expect(comp.searchOptions$).toBeObservable(cold('b', {
      b: paginatedSearchOptions
    }));

  });

  describe('when the open sidebar button is clicked in mobile view', () => {

    beforeEach(() => {
      spyOn(comp, 'openSidebar');
      const openSidebarButton = fixture.debugElement.query(By.css('.open-sidebar'));
      openSidebarButton.triggerEventHandler('click', null);
    });

    it('should trigger the openSidebar function', () => {
      expect(comp.openSidebar).toHaveBeenCalled();
    });

  });

  describe('when sidebarCollapsed is true in mobile view', () => {
    let menu: HTMLElement;

    beforeEach(() => {
      menu = fixture.debugElement.query(By.css('#search-sidebar-sm')).nativeElement;
      (comp as any).isSidebarCollapsed$ = observableOf(true);
      fixture.detectChanges();
    });

    it('should close the sidebar', () => {
      expect(menu.classList).not.toContain('active');
    });

  });

  describe('when sidebarCollapsed is false in mobile view', () => {
    let menu: HTMLElement;

    beforeEach(() => {
      menu = fixture.debugElement.query(By.css('#search-sidebar-sm')).nativeElement;
      (comp as any).isSidebarCollapsed$ = observableOf(false);
      fixture.detectChanges();
    });

    it('should open the menu', () => {
      expect(menu.classList).toContain('active');
    });

  });
});
