import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { DSpaceObjectType } from '@dspace/core/shared/dspace-object-type.model';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';

import { ListableObjectComponentLoaderComponent } from '../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchService } from '../../search/search.service';
import { DSOSelectorComponent } from './dso-selector.component';

describe('DSOSelectorComponent', () => {
  let component: DSOSelectorComponent;
  let fixture: ComponentFixture<DSOSelectorComponent>;
  let debugElement: DebugElement;

  const currentDSOId = 'test-uuid-ford-sose';
  const type = DSpaceObjectType.ITEM;
  const searchResult = createSearchResult('current');

  const firstPageResults = [
    createSearchResult('1'),
    createSearchResult('2'),
    createSearchResult('3'),
  ];

  const nextPageResults = [
    createSearchResult('4'),
    createSearchResult('5'),
    createSearchResult('6'),
  ];

  const searchService = {
    search: (options: PaginatedSearchOptions, responseMsToLive?: number, useCachedVersionIfAvailable = true) => {
      if (hasValue(options.query) && options.query.startsWith('search.resourceid')) {
        return createSuccessfulRemoteDataObject$(createPaginatedList([searchResult]));
      } else if (options.pagination.currentPage === 1) {
        return createSuccessfulRemoteDataObject$(createPaginatedList(firstPageResults));
      } else {
        return createSuccessfulRemoteDataObject$(createPaginatedList(nextPageResults));
      }
    },
  };

  function createSearchResult(name: string): ItemSearchResult {
    return Object.assign(new ItemSearchResult(), {
      indexableObject: Object.assign(new Item(), {
        id: `test-result-${name}`,
        metadata: {
          'dc.title': [
            {
              value: `test result - ${name}`,
            },
          ],
        },
      }),
    });
  }

  let notificationsService: NotificationsService;

  beforeEach(waitForAsync(() => {
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DSOSelectorComponent],
      providers: [
        { provide: SearchService, useValue: searchService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DSOSelectorComponent, {
        remove: { imports: [ListableObjectComponentLoaderComponent] },
      })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DSOSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.currentDSOId = currentDSOId;
    component.types = [type];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('populating listEntries', () => {
    it('should not be empty', (done) => {
      component.listEntries$.subscribe((listEntries) => {
        expect(listEntries.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should contain a combination of the current DSO and first page results', (done) => {
      component.listEntries$.subscribe((listEntries) => {
        expect(listEntries).toEqual([searchResult, ...firstPageResults]);
        done();
      });
    });

    describe('when current page increases', () => {
      beforeEach(() => {
        component.currentPage$.next(2);
      });

      it('should contain a combination of the current DSO, as well as first and second page results', (done) => {
        component.listEntries$.subscribe((listEntries) => {
          expect(listEntries).toEqual([searchResult, ...firstPageResults, ...nextPageResults]);
          done();
        });
      });
    });
  });

  describe('search', () => {
    beforeEach(() => {
      spyOn(searchService, 'search').and.callThrough();
    });

    it('should specify how to sort if no query is given', () => {
      component.sort = new SortOptions('dc.title', SortDirection.ASC);
      component.search(undefined, 0);

      expect(searchService.search).toHaveBeenCalledWith(
        jasmine.objectContaining({
          query: undefined,
          sort: jasmine.objectContaining({
            field: 'dc.title',
            direction: SortDirection.ASC,
          }),
        }),
        null,
        true,
      );
    });

    it('should not specify how to sort if a query is given', () => {
      component.sort = new SortOptions('dc.title', SortDirection.ASC);
      component.search('testQuery', 0);

      expect(searchService.search).toHaveBeenCalledWith(
        jasmine.objectContaining({
          query: 'testQuery',
          sort: null,
        }),
        null,
        true,
      );
    });
  });

  describe('when search returns an error', () => {
    beforeEach(() => {
      spyOn(searchService, 'search').and.returnValue(createFailedRemoteDataObject$());
      component.ngOnInit();
    });

    it('should display an error notification', () => {
      expect(notificationsService.error).toHaveBeenCalled();
    });
  });
});
