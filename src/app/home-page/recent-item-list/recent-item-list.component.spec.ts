import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { SearchServiceStub } from '@dspace/core/testing/search-service.stub';
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

  const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));

  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: () => of(emptyList),
    clearDiscoveryRequests: () => { },
  });

  paginationService = new PaginationServiceStub();

  const searchConfigServiceStub = {
    paginationID: 'search-page-configuration',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentItemListComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigServiceStub },
        { provide: APP_CONFIG, useValue: environment },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(paginationService, 'updateRouteWithUrl');
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

    if (entityType) {
      extraParams['f.entityType'] = `${entityType},equals`;
    }
    component.onLoadMore();

    expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith('search-page-configuration', ['search'], { sortField: environment.homePage.recentSubmissions.sortField, sortDirection: 'DESC', page: 1 }, extraParams);
  });

  it('should clear pagination on destroy', () => {
    spyOn(paginationService, 'clearPagination');

    component.ngOnDestroy();

    expect(paginationService.clearPagination).toHaveBeenCalledWith(component.paginationConfig.id);
  });

});
