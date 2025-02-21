import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  SortDirection,
  SortOptions,
} from '../../../../modules/core/src/lib/core/cache/models/sort-options.model';
import { APP_CONFIG } from '../../../../modules/core/src/lib/core/config/app-config.interface';
import { PaginationService } from '../../../../modules/core/src/lib/core/pagination/pagination.service';
import { PaginatedSearchOptions } from '../../../../modules/core/src/lib/core/shared/paginated-search-options.model';
import { PaginationComponentOptions } from '../../../../modules/core/src/lib/core/shared/pagination-component-options.model';
import { SearchService } from '../../../../modules/core/src/lib/core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../modules/core/src/lib/core/shared/search/search-configuration.service';
import { createSuccessfulRemoteDataObject } from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { PaginationServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/pagination-service.stub';
import { SearchServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/search-service.stub';
import { createPaginatedList } from '../../../../modules/core/src/lib/core/utilities/testing/utils.test';
import { RecentItemListComponent } from './recent-item-list.component';

describe('RecentItemListComponent', () => {
  let component: RecentItemListComponent;
  let fixture: ComponentFixture<RecentItemListComponent>;
  const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));
  let paginationService;
  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: () => observableOf(emptyList),
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    clearDiscoveryRequests: () => {},
    /* eslint-enable no-empty,@typescript-eslint/no-empty-function */
  });
  paginationService = new PaginationServiceStub();
  const mockSearchOptions = observableOf(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      id: 'search-page-configuration',
      pageSize: 10,
      currentPage: 1,
    }),
    sort: new SortOptions('dc.date.accessioned', SortDirection.DESC),
  }));
  const searchConfigServiceStub = {
    paginatedSearchOptions: mockSearchOptions,
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
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the navigate method on the Router with view mode list parameter as a parameter when setViewMode is called', () => {
    component.onLoadMore();
    expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith(undefined, ['search'], Object({ sortField: 'dc.date.accessioned', sortDirection: 'DESC', page: 1 }));
  });
});


