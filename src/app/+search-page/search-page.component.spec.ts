import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
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

describe('SearchPageComponent', () => {
  let comp: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let searchServiceObject: SearchService;
  const store: Store<SearchPageComponent> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of(true)
  });
  const pagination: PaginationComponentOptions = new PaginationComponentOptions();
  pagination.id = 'search-results-pagination';
  pagination.currentPage = 1;
  pagination.pageSize = 10;
  const sort: SortOptions = new SortOptions('score', SortDirection.DESC);
  const mockResults = Observable.of(new RemoteData(false, false, true, null,['test', 'data']));
  const searchServiceStub = jasmine.createSpyObj('SearchService', {
    search: mockResults,
    getSearchLink: '/search',
    getScopes: Observable.of(['test-scope'])
  });
  const queryParam = 'test query';
  const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
  const paginatedSearchOptions = {
      query: queryParam,
      scope: scopeParam,
      pagination,
      sort
    };
  const activatedRouteStub = {
    queryParams: Observable.of({
      query: queryParam,
      scope: scopeParam
    })
  };
  const sidebarService = {
    isCollapsed: Observable.of(true),
    collapse: () => this.isCollapsed = Observable.of(true),
    expand: () => this.isCollapsed = Observable.of(false)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule, NgbCollapseModule.forRoot()],
      declarations: [SearchPageComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        {
          provide: CommunityDataService,
          useValue: jasmine.createSpyObj('communityService', ['findById', 'findAll'])
        },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: Store, useValue: store
        },
        {
          provide: HostWindowService, useValue: jasmine.createSpyObj('hostWindowService',
            {
              isXs: Observable.of(true),
              isSm: Observable.of(false),
              isXsOrSm: Observable.of(true)
            })
        },
        {
          provide: SearchSidebarService,
          useValue: sidebarService
        },
        {
          provide: SearchFilterService,
          useValue: {}
        }, {
          provide: SearchConfigurationService,
          useValue: {
            paginatedSearchOptions: hot('a', {
              a: paginatedSearchOptions
            }),
            getCurrentScope: (a) => Observable.of('test-id')
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchPageComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    fixture.detectChanges();
    searchServiceObject = (comp as any).service;
  });

  it('should get the scope and query from the route parameters', () => {
    expect(comp.searchOptions$).toBeObservable(cold('b', {
      b: paginatedSearchOptions
    }));
  });

  describe('when the closeSidebar event is emitted clicked in mobile view', () => {

    beforeEach(() => {
      spyOn(comp, 'closeSidebar');
      const closeSidebarButton = fixture.debugElement.query(By.css('#search-sidebar-sm'));
      closeSidebarButton.triggerEventHandler('toggleSidebar', null);
    });

    it('should trigger the closeSidebar function', () => {
      expect(comp.closeSidebar).toHaveBeenCalled();
    });

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
      comp.isSidebarCollapsed = () => Observable.of(true);
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
      comp.isSidebarCollapsed = () => Observable.of(false);
      fixture.detectChanges();
    });

    it('should open the menu', () => {
      expect(menu.classList).toContain('active');
    });

  });
})
;
