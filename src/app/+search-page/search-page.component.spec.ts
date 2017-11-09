import { NO_ERRORS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { Community } from '../core/shared/community.model';
import { HostWindowService } from '../shared/host-window.service';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { SearchPageComponent } from './search-page.component';
import { SearchService } from './search-service/search.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';

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
  const mockResults = Observable.of(['test', 'data']);
  const searchServiceStub = {
    search: () => mockResults
  };
  const queryParam = 'test query';
  const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
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
  }

  const mockCommunityList = [];
  const communityDataServiceStub = {
    findAll: () => Observable.of(mockCommunityList),
    findById: () => Observable.of(new Community())
  };

  class RouterStub {
    navigateByUrl(url: string) {
      return url;
    }
  }

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
            isSm: Observable.of(false)
          })
        },
        {
          provide: SearchSidebarService,
          useValue: sidebarService
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPageComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    fixture.detectChanges();
    searchServiceObject = (comp as any).service;
  });

  it('should set the scope and query based on the route parameters', () => {
    expect(comp.query).toBe(queryParam);
    expect((comp as any).scope).toBe(scopeParam);
  });

  describe('when update search results is called', () => {
    let pagination;
    let sort;
    beforeEach(() => {
      pagination = Object.assign(
        {},
        new PaginationComponentOptions(),
        {
          currentPage: 5,
          pageSize: 15
        }
      );
      sort = Object.assign({},
        new SortOptions(),
        {
          direction: SortDirection.Ascending,
          field: 'test-field'
        }
      );
    });

    it('should call the search function of the search service with the right parameters', () => {
      spyOn(searchServiceObject, 'search').and.callThrough();

      (comp as any).updateSearchResults({
        pagination: pagination,
        sort: sort
      });

      expect(searchServiceObject.search).toHaveBeenCalledWith(queryParam, scopeParam, {
        pagination: pagination,
        sort: sort
      });
    });

    it('should update the results', () => {
      spyOn(searchServiceObject, 'search').and.callThrough();

      (comp as any).updateSearchResults({});

      expect(comp.resultsRDObs as any).toBe(mockResults);
    });

  });

  describe('when the closeSidebar event is emitted clicked in mobile view', () => {

    beforeEach(() => {
      spyOn(comp, 'closeSidebar');
      const closeSidebarButton = fixture.debugElement.query(By.css('#search-sidebar-xs'));
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
      menu = fixture.debugElement.query(By.css('#search-sidebar-xs')).nativeElement;
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
      menu = fixture.debugElement.query(By.css('#search-sidebar-xs')).nativeElement;
      comp.isSidebarCollapsed = () => Observable.of(false);
      fixture.detectChanges();
    });

    it('should open the menu', () => {
      sidebarService.isCollapsed.subscribe((a) => {console.log(a)})
      expect(menu.classList).toContain('active');
    });

  });
});
