import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { HostWindowService } from '../shared/host-window.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchComponent } from './search.component';
import { SearchService } from '../core/shared/search/search.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SearchFilterService } from '../core/shared/search/search-filter.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../my-dspace-page/my-dspace-page.component';
import { RouteService } from '../core/services/route.service';
import { SearchConfigurationServiceStub } from '../shared/testing/search-configuration-service.stub';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SidebarServiceStub } from '../shared/testing/sidebar-service.stub';

let comp: SearchComponent;
let fixture: ComponentFixture<SearchComponent>;
let searchServiceObject: SearchService;
let searchConfigurationServiceObject: SearchConfigurationService;
const store: Store<SearchComponent> = jasmine.createSpyObj('store', {
  /* tslint:disable:no-empty */
  dispatch: {},
  /* tslint:enable:no-empty */
  select: observableOf(true)
});
const pagination: PaginationComponentOptions = new PaginationComponentOptions();
pagination.id = 'search-results-pagination';
pagination.currentPage = 1;
pagination.pageSize = 10;
const sortOption = { name: 'score', sortOrder: 'DESC', metadata: null };
const sort: SortOptions = new SortOptions('score', SortDirection.DESC);
const mockResults = createSuccessfulRemoteDataObject$(['test', 'data']);
const searchServiceStub = jasmine.createSpyObj('SearchService', {
  search: mockResults,
  getSearchLink: '/search',
  getScopes: observableOf(['test-scope']),
  getSearchConfigurationFor: createSuccessfulRemoteDataObject$({ sortOptions: [sortOption]})
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

const routeServiceStub = {
  getRouteParameterValue: () => {
    return observableOf('');
  },
  getQueryParameterValue: () => {
    return observableOf('');
  },
  getQueryParamsWithPrefix: () => {
    return observableOf('');
  }
};

export function configureSearchComponentTestingModule(compType, additionalDeclarations: any[] = []) {
  TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, NgbCollapseModule],
    declarations: [compType, ...additionalDeclarations],
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
        provide: SidebarService,
        useValue: SidebarServiceStub
      },
      {
        provide: SearchFilterService,
        useValue: {}
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

describe('SearchComponent', () => {
  beforeEach(waitForAsync(() => {
    configureSearchComponentTestingModule(SearchComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    comp = fixture.componentInstance; // SearchComponent test instance
    comp.inPlaceSearch = false;
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

  describe('when stable', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have initialized the sortOptions$ observable', (done) => {

      comp.sortOptions$.subscribe((sortOptions) => {

        expect(sortOptions.length).toEqual(2);
        expect(sortOptions[0]).toEqual(new SortOptions('score', SortDirection.ASC));
        expect(sortOptions[1]).toEqual(new SortOptions('score', SortDirection.DESC));
        done();
      });

    });

  });
});
