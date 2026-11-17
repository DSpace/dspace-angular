import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SearchService } from '../../shared/search/search.service';
import { SearchConfigurationService } from '../../shared/search/search-configuration.service';
import { RecentItemListComponent } from './recent-item-list.component';

describe('RecentItemListComponent', () => {
  let component: RecentItemListComponent;
  let fixture: ComponentFixture<RecentItemListComponent>;
  let paginationService;
  let searchServiceSpy;

  const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));

  function createTestBed(mockEnvironment?: any) {
    searchServiceSpy = jasmine.createSpyObj('SearchService', ['search', 'clearDiscoveryRequests']);
    searchServiceSpy.search.and.returnValue(of(emptyList));
    searchServiceSpy.clearDiscoveryRequests.and.returnValue();

    paginationService = new PaginationServiceStub();

    const searchConfigServiceStub = {
      paginationID: 'search-page-configuration',
    };

    return TestBed.configureTestingModule({
      imports: [RecentItemListComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigServiceStub },
        { provide: APP_CONFIG, useValue: mockEnvironment || environment },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
  }

  beforeEach(async () => {
    await createTestBed().compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load items on init', () => {
    component.ngOnInit();
    expect(component.itemRD$).toBeDefined();
  });

  it('should call paginationService.updateRouteWithUrl when onLoadMore is called', () => {
    component.onLoadMore();

    expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith(
      'search-page-configuration',
      ['search'],
      { sortField: environment.homePage.recentSubmissions.sortField, sortDirection: 'DESC', page: 1 },
      {},
    );
  });

  it('should clear pagination on destroy', () => {
    component.ngOnDestroy();

    expect(paginationService.clearPagination).toHaveBeenCalledWith(component.paginationConfig.id);
  });

  it('should not add query when entityType is undefined', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: undefined,
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(searchServiceSpy.search).toHaveBeenCalled();
    const searchCall = searchServiceSpy.search.calls.mostRecent();
    const searchOptions = searchCall.args[0];
    expect(searchOptions.query).toBeUndefined();
  });

  it('should not add query when entityType is empty array', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: [],
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(searchServiceSpy.search).toHaveBeenCalled();
    const searchCall = searchServiceSpy.search.calls.mostRecent();
    const searchOptions = searchCall.args[0];
    expect(searchOptions.query).toBeUndefined();
  });

  it('should add query when entityType is single item array', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: ['Publication'],
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(searchServiceSpy.search).toHaveBeenCalled();
    const searchCall = searchServiceSpy.search.calls.mostRecent();
    const searchOptions = searchCall.args[0];
    expect(searchOptions.query).toBe('search.entitytype:Publication');
  });

  it('should not add extra params when entityType is undefined in onLoadMore', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: undefined,
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.onLoadMore();

    expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith(
      'search-page-configuration',
      ['search'],
      { sortField: mockEnvironment.homePage.recentSubmissions.sortField, sortDirection: 'DESC', page: 1 },
      {},
    );
  });

  it('should add query param when entityType is single item array in onLoadMore', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: ['Publication'],
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.onLoadMore();

    expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith(
      'search-page-configuration',
      ['search'],
      { sortField: mockEnvironment.homePage.recentSubmissions.sortField, sortDirection: 'DESC', page: 1 },
      { query: 'search.entitytype:Publication' },
    );
  });

  it('should add query with OR clause when entityType is an array', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: ['Publication', 'Project', 'Person'],
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(searchServiceSpy.search).toHaveBeenCalled();
    const searchCall = searchServiceSpy.search.calls.mostRecent();
    const searchOptions = searchCall.args[0];
    expect(searchOptions.query).toBe('search.entitytype:(Publication OR Project OR Person)');
  });

  it('should add query param with OR clause when entityType is an array in onLoadMore', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: ['Publication', 'Project'],
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.onLoadMore();

    expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith(
      'search-page-configuration',
      ['search'],
      { sortField: mockEnvironment.homePage.recentSubmissions.sortField, sortDirection: 'DESC', page: 1 },
      { query: 'search.entitytype:(Publication OR Project)' },
    );
  });

  it('should filter out empty strings from entityType array', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: ['Publication', '', 'Person', '   '],
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(searchServiceSpy.search).toHaveBeenCalled();
    const searchCall = searchServiceSpy.search.calls.mostRecent();
    const searchOptions = searchCall.args[0];
    expect(searchOptions.query).toBe('search.entitytype:(Publication OR Person)');
  });

  it('should not add query when all entityType values are empty', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: ['', '   '],
        },
      },
    };

    TestBed.resetTestingModule();
    createTestBed(mockEnvironment).compileComponents();

    const testFixture = TestBed.createComponent(RecentItemListComponent);
    const testComponent = testFixture.componentInstance;

    testComponent.ngOnInit();

    expect(searchServiceSpy.search).toHaveBeenCalled();
    const searchCall = searchServiceSpy.search.calls.mostRecent();
    const searchOptions = searchCall.args[0];
    expect(searchOptions.query).toBeUndefined();
  });

});
