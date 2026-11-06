// eslint-disable-next-line max-classes-per-file
import {
  Component,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Item } from '@dspace/core/shared/item.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { SearchServiceStub } from '@dspace/core/testing/search-service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
import { ListableObjectComponentLoaderComponent } from '../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { RSSComponent } from '../../shared/rss-feed/rss.component';
import { SearchService } from '../../shared/search/search.service';
import { SearchConfigurationService } from '../../shared/search/search-configuration.service';
import { RecentItemListComponent } from './recent-item-list.component';

@Component({
  selector: 'ds-listable-object-component-loader',
  template: '',
})
class MockListableObjectComponentLoaderComponent {
  @Input() object: Item;
  @Input() viewMode: ViewMode;
}

@Component({
  selector: 'ds-rss',
  template: '',
})
class MockRSSComponent {
  @Input() searchOptions?: PaginatedSearchOptions;
}

describe('RecentItemListComponent', () => {
  let component: RecentItemListComponent;
  let fixture: ComponentFixture<RecentItemListComponent>;
  const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));
  let paginationService;
  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: (_options?: PaginatedSearchOptions) => of(emptyList),
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    clearDiscoveryRequests: () => {},
    /* eslint-enable no-empty,@typescript-eslint/no-empty-function */
  });
  paginationService = new PaginationServiceStub();
  const mockSearchOptions = of(new PaginatedSearchOptions({
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
      imports: [
        RecentItemListComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigServiceStub },
        { provide: APP_CONFIG, useValue: environment },
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: TranslateService,
          useValue: {
            get: (key: string) => of(key),
            instant: (key: string) => key,
            stream: (key: string) => of(key),
            getCurrentLang: () => 'en',
            onLangChange: of({ lang: 'en', translations: {} }),
            onTranslationChange: of({}),
            onFallbackLangChange: of({}),
            onDefaultLangChange: of({}),
          },
        },
      ],
    }).overrideComponent(RecentItemListComponent, {
      remove: {
        imports: [
          RSSComponent,
          ListableObjectComponentLoaderComponent,
        ],
      },
      add: {
        imports: [
          MockRSSComponent,
          MockListableObjectComponentLoaderComponent,
        ],
      },
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentItemListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call the navigate method on the Router with view mode list parameter as a parameter when setViewMode is called', () => {
    fixture.detectChanges();
    component.onLoadMore();
    expect(paginationService.updateRouteWithUrl).toHaveBeenCalledWith(undefined, ['search'], Object({ sortField: 'dc.date.accessioned', sortDirection: 'DESC', page: 1 }));
  });

  it('should pass the same search options to the search service and RSS component', () => {
    const itemList = createSuccessfulRemoteDataObject(
      createPaginatedList([new Item()]),
    );

    const searchSpy = spyOn(searchServiceStub, 'search')
      .and.returnValue(of(itemList));

    fixture.detectChanges();

    expect(searchSpy.calls.mostRecent().args[0]).toBe(component.searchOptions);

    const rssComponent = fixture.debugElement.query(By.directive(MockRSSComponent));

    expect(rssComponent).not.toBeNull();
    expect(rssComponent.componentInstance.searchOptions).toBe(component.searchOptions);
  });
});


