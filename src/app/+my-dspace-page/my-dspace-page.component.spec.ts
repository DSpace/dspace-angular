import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { HostWindowService } from '../shared/host-window.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { MyDSpacePageComponent, SEARCH_CONFIG_SERVICE } from './my-dspace-page.component';
import { RouteService } from '../core/services/route.service';
import { routeServiceStub } from '../shared/testing/route-service.stub';
import { SearchConfigurationServiceStub } from '../shared/testing/search-configuration-service.stub';
import { SearchService } from '../core/shared/search/search.service';
import { SearchConfigurationService } from '../core/shared/search/search-configuration.service';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SidebarService } from '../shared/sidebar/sidebar.service';
import { SearchFilterService } from '../core/shared/search/search-filter.service';
import { RoleDirective } from '../shared/roles/role.directive';
import { RoleService } from '../core/roles/role.service';
import { RoleServiceMock } from '../shared/mocks/role-service.mock';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';

describe('MyDSpacePageComponent', () => {
  let comp: MyDSpacePageComponent;
  let fixture: ComponentFixture<MyDSpacePageComponent>;
  let searchServiceObject: SearchService;
  let searchConfigurationServiceObject: SearchConfigurationService;
  const store: Store<MyDSpacePageComponent> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: observableOf(true)
  });
  const pagination: PaginationComponentOptions = new PaginationComponentOptions();
  pagination.id = 'mydspace-results-pagination';
  pagination.currentPage = 1;
  pagination.pageSize = 10;
  const sort: SortOptions = new SortOptions('score', SortDirection.DESC);
  const mockResults = createSuccessfulRemoteDataObject$(['test', 'data']);
  const searchServiceStub = jasmine.createSpyObj('SearchService', {
    search: mockResults,
    getEndpoint: observableOf('discover/search/objects'),
    getSearchLink: '/mydspace',
    getScopes: observableOf(['test-scope']),
    setServiceOptions: {}
  });
  const configurationParam = 'default';
  const queryParam = 'test query';
  const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
  const paginatedSearchOptions = new PaginatedSearchOptions({
    configuration: configurationParam,
    query: queryParam,
    scope: scopeParam,
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, NgbCollapseModule],
      declarations: [MyDSpacePageComponent, RoleDirective],
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
          useValue: sidebarService
        },
        {
          provide: SearchFilterService,
          useValue: {}
        }, {
          provide: SEARCH_CONFIG_SERVICE,
          useValue: new SearchConfigurationServiceStub()
        },
        {
          provide: RoleService,
          useValue: new RoleServiceMock()
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MyDSpacePageComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDSpacePageComponent);
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
      comp.isSidebarCollapsed = () => observableOf(true);
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
      comp.isSidebarCollapsed = () => observableOf(false);
      fixture.detectChanges();
    });

    it('should open the menu', () => {
      expect(menu.classList).toContain('active');
    });

  });
});
