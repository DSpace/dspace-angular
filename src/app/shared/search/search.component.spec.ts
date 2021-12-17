import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
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
import { RouteService } from '../../core/services/route.service';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { PaginatedSearchOptions } from './models/paginated-search-options.model';
import { SidebarServiceStub } from '../testing/sidebar-service.stub';
import { SearchConfig } from '../../core/shared/search/search-filters/search-config.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

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
const sortOptionsList = [
  new SortOptions('score', SortDirection.DESC),
  new SortOptions('dc.title', SortDirection.ASC),
  new SortOptions('dc.title', SortDirection.DESC)
];
const searchConfig = Object.assign(new SearchConfig(), {
  sortOptions: sortOptionsList
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
  getSearchConfigurationFor: createSuccessfulRemoteDataObject$(searchConfig)
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


const searchConfigurationServiceStub = jasmine.createSpyObj('SearchConfigurationService', {
  getConfigurationSearchConfig: jasmine.createSpy('getConfigurationSearchConfig'),
  getCurrentConfiguration: jasmine.createSpy('getCurrentConfiguration'),
  getCurrentScope: jasmine.createSpy('getCurrentScope'),
  updateFixedFilter: jasmine.createSpy('updateFixedFilter'),
  setPaginationId: jasmine.createSpy('setPaginationId')
});

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
        provide: SEARCH_CONFIG_SERVICE,
        useValue: searchConfigurationServiceStub
      }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).overrideComponent(compType, {
    set: { changeDetection: ChangeDetectionStrategy.Default }
  }).compileComponents();
}

fdescribe('SearchComponent', () => {
  beforeEach(waitForAsync(() => {
    configureSearchComponentTestingModule(SearchComponent);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    comp = fixture.componentInstance; // SearchComponent test instance
    comp.inPlaceSearch = false;

    // searchConfigurationServiceStub.paginatedSearchOptions.and.returnValue(observableOf(paginatedSearchOptions));
    searchConfigurationServiceStub.getConfigurationSearchConfig.and.returnValue(observableOf(searchConfig));
    searchConfigurationServiceStub.getCurrentConfiguration.and.returnValue(observableOf('default'));
    searchConfigurationServiceStub.getCurrentScope.and.returnValue(observableOf('test-id'));

    searchServiceObject =  TestBed.inject(SearchService);
    searchConfigurationServiceObject = TestBed.inject(SEARCH_CONFIG_SERVICE);
    searchConfigurationServiceObject.paginatedSearchOptions = new BehaviorSubject(paginatedSearchOptions);

    fixture.detectChanges();
  });

  afterEach(() => {
    comp = null;
    searchServiceObject = null;
    searchConfigurationServiceObject = null;
  });

  it('should get the scope and query from the route parameters', () => {

    expect(comp.searchOptions$).toBeObservable(cold('b', {
      b: paginatedSearchOptions
    }));

  });

  xdescribe('when the open sidebar button is clicked in mobile view', () => {

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

      comp.sortOptionsList$.subscribe((sortOptions) => {

        expect(sortOptions.length).toEqual(2);
        expect(sortOptions[0]).toEqual(new SortOptions('score', SortDirection.ASC));
        expect(sortOptions[1]).toEqual(new SortOptions('score', SortDirection.DESC));
        done();
      });

    });

  });
});
