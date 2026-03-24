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

    const entityType = environment.homePage.recentSubmissions.entityType;

    const extraParams: Record<string, unknown> = {};

    if (entityType && entityType.trim()) {
      extraParams['f.entityType'] = `${entityType},equals`;
    }
    component.onLoadMore();

    expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith('search-page-configuration', ['search'], { sortField: environment.homePage.recentSubmissions.sortField, sortDirection: 'DESC', page: 1 }, extraParams);
  });

  it('should clear pagination on destroy', () => {
    component.ngOnDestroy();

    expect(paginationService.clearPagination).toHaveBeenCalledWith(component.paginationConfig.id);
  });

  it('should not add filter when entityType is undefined', () => {
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
    expect(searchOptions.filters).toEqual([]);
  });

  it('should not add filter when entityType is empty string', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: '',
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
    expect(searchOptions.filters).toEqual([]);
  });

  it('should add filter when entityType is valid string', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: 'Publication',
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
    expect(searchOptions.filters.length).toBe(1);
    expect(searchOptions.filters[0].key).toBe('f.entityType');
    expect(searchOptions.filters[0].values).toEqual(['Publication']);
    expect(searchOptions.filters[0].operator).toBe('equals');
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

  it('should add extra params when entityType is valid string in onLoadMore', () => {
    const mockEnvironment = {
      ...environment,
      homePage: {
        ...environment.homePage,
        recentSubmissions: {
          ...environment.homePage.recentSubmissions,
          entityType: 'Publication',
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
      { 'f.entityType': 'Publication,equals' },
    );
  });

});
