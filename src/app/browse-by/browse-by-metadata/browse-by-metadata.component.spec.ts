import { CommonModule } from '@angular/common';
import {
  NO_ERRORS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import {
  Observable,
  of,
} from 'rxjs';
import { RouteService } from 'src/app/core/services/route.service';
import { DsoEditMenuComponent } from 'src/app/shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { HostWindowService } from 'src/app/shared/host-window.service';
import { ThemedLoadingComponent } from 'src/app/shared/loading/themed-loading.component';
import { getMockThemeService } from 'src/app/shared/mocks/theme-service.mock';
import { SelectableListService } from 'src/app/shared/object-list/selectable-list/selectable-list.service';
import { routeServiceStub } from 'src/app/shared/testing/route-service.stub';
import { ThemeService } from 'src/app/shared/theme-support/theme.service';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { BrowseService } from '../../core/browse/browse.service';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import {
  buildPaginatedList,
  PaginatedList,
} from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { BrowseEntry } from '../../core/shared/browse-entry.model';
import { Community } from '../../core/shared/community.model';
import { Item } from '../../core/shared/item.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { RouterMock } from '../../shared/mocks/router.mock';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import {
  BrowseByMetadataComponent,
  browseParamsToOptions,
  getBrowseSearchOptions,
} from './browse-by-metadata.component';

describe('BrowseByMetadataComponent', () => {
  let comp: BrowseByMetadataComponent;
  let fixture: ComponentFixture<BrowseByMetadataComponent>;
  let browseService: BrowseService;
  let route: ActivatedRoute;
  let paginationService;

  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    metadata: [
      {
        key: 'dc.title',
        value: 'test community',
      },
    ],
  });

  const environmentMock = {
    browseBy: {
      showThumbnails: true,
      pageSize: 10,
    },
  };

  const mockEntries = [
    {
      type: BrowseEntry.type,
      authority: null,
      value: 'John Doe',
      language: 'en',
      count: 1,
    },
    {
      type: BrowseEntry.type,
      authority: null,
      value: 'James Doe',
      language: 'en',
      count: 3,
    },
    {
      type: BrowseEntry.type,
      authority: null,
      value: 'Fake subject',
      language: 'en',
      count: 2,
    },
  ];

  const mockItems = [
    Object.assign(new Item(), {
      id: 'fakeId',
    }),
  ];

  const mockBrowseService = {
    getBrowseEntriesFor: (options: BrowseEntrySearchOptions) => toRemoteData(mockEntries),
    getBrowseItemsFor: (value: string, options: BrowseEntrySearchOptions) => toRemoteData(mockItems),
  };

  const mockDsoService = {
    findById: () => createSuccessfulRemoteDataObject$(mockCommunity),
  };

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: of({}),
  });

  paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NgbModule,
        BrowseByMetadataComponent,
        EnumKeysPipe,
        VarDirective,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BrowseService, useValue: mockBrowseService },
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
        { provide: PaginationService, useValue: paginationService },
        { provide: Router, useValue: new RouterMock() },
        { provide: APP_CONFIG, useValue: environmentMock },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: SelectableListService, useValue: {} },
        { provide: HostWindowService, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BrowseByMetadataComponent, {
        remove: {
          imports: [ThemedLoadingComponent, DsoEditMenuComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByMetadataComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    browseService = (comp as any).browseService;
    route = (comp as any).route;
    route.params = of({});
    comp.ngOnInit();
    fixture.detectChanges();
  });

  it('should not fetch any items when no value is provided', () => {
    expect(comp.items$).toBeUndefined();
  });

  it('should set embed thumbnail property to true', () => {
    expect(comp.fetchThumbnails).toBeTrue();
  });

  describe('when a value is provided', () => {
    beforeEach(() => {
      const paramsWithValue = {
        metadata: 'author',
        value: 'John Doe',
      };

      route.params = of(paramsWithValue);
      comp.ngOnInit();
      fixture.detectChanges();
    });

    it('should fetch items', (done: DoneFn) => {
      expect(comp.loading$).toBeObservable(cold('(a|)', {
        a: false,
      }));
      comp.items$.subscribe((result) => {
        expect(result.payload.page).toEqual(mockItems);
        done();
      });
    });
  });

  describe('when calling browseParamsToOptions', () => {
    let result: BrowseEntrySearchOptions;

    beforeEach(() => {
      const paramsScope = {
        scope: 'fake-scope',
      };
      const paginationOptions = Object.assign(new PaginationComponentOptions(), {
        currentPage: 5,
        pageSize: comp.appConfig.browseBy.pageSize,
      });
      const sortOptions = {
        direction: SortDirection.ASC,
        field: 'fake-field',
      };

      result = browseParamsToOptions(paramsScope, 'fake-scope', paginationOptions, sortOptions, 'author', comp.fetchThumbnails);
    });

    it('should return BrowseEntrySearchOptions with the correct properties', () => {

      expect(result.metadataDefinition).toEqual('author');
      expect(result.pagination.currentPage).toEqual(5);
      expect(result.pagination.pageSize).toEqual(10);
      expect(result.sort.direction).toEqual(SortDirection.ASC);
      expect(result.sort.field).toEqual('fake-field');
      expect(result.scope).toEqual('fake-scope');
      expect(result.fetchThumbnail).toBeTrue();
    });
  });

  describe('calling getBrowseSearchOptions', () => {
    let result: BrowseEntrySearchOptions;

    beforeEach(() => {
      const paramsScope = {
        scope: 'fake-scope',
      };
      const paginationOptions = Object.assign(new PaginationComponentOptions(), {
        currentPage: 5,
        pageSize: comp.appConfig.browseBy.pageSize,
      });
      const sortOptions = {
        direction: SortDirection.ASC,
        field: 'fake-field',
      };

      result = getBrowseSearchOptions('title', paginationOptions, sortOptions, comp.fetchThumbnails);
    });
    it('should return BrowseEntrySearchOptions with the correct properties', () => {

      expect(result.metadataDefinition).toEqual('title');
      expect(result.pagination.currentPage).toEqual(5);
      expect(result.pagination.pageSize).toEqual(10);
      expect(result.sort.direction).toEqual(SortDirection.ASC);
      expect(result.sort.field).toEqual('fake-field');
      expect(result.fetchThumbnail).toBeTrue();
    });
  });

  describe('when rendered in SSR', () => {
    beforeEach(() => {
      comp.ssrRenderingDisabled = true;
      spyOn((comp as any).browseService, 'getBrowseEntriesFor').and.returnValue(createSuccessfulRemoteDataObject$(null));
    });

    it('should not call getBrowseEntriesFor on init', (done) => {
      comp.ngOnInit();
      expect((comp as any).browseService.getBrowseEntriesFor).not.toHaveBeenCalled();
      comp.loading$.subscribe((res) => {
        expect(res).toBeFalsy();
        done();
      });
    });
  });

  describe('when rendered in CSR', () => {
    beforeEach(() => {
      comp.ssrRenderingDisabled = false;
      spyOn((comp as any).browseService, 'getBrowseEntriesFor').and.returnValue(createSuccessfulRemoteDataObject$(new BrowseEntry()));
    });

    it('should call getBrowseEntriesFor on init', fakeAsync(() => {
      comp.ngOnInit();
      tick(100);
      expect((comp as any).browseService.getBrowseEntriesFor).toHaveBeenCalled();
    }));
  });
});

export function toRemoteData(objects: any[]): Observable<RemoteData<PaginatedList<any>>> {
  return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), objects));
}
