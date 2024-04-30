import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
import { BrowseService } from '../../core/browse/browse.service';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Community } from '../../core/shared/community.model';
import { Item } from '../../core/shared/item.model';
import { ThemedBrowseByComponent } from '../../shared/browse-by/themed-browse-by.component';
import { ThemedComcolPageBrowseByComponent } from '../../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ComcolPageContentComponent } from '../../shared/comcol/comcol-page-content/comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { RouterMock } from '../../shared/mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { toRemoteData } from '../browse-by-metadata/browse-by-metadata.component.spec';
import { BrowseByDateComponent } from './browse-by-date.component';

describe('BrowseByDateComponent', () => {
  let comp: BrowseByDateComponent;
  let fixture: ComponentFixture<BrowseByDateComponent>;
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

  const firstItem = Object.assign(new Item(), {
    id: 'first-item-id',
    metadata: {
      'dc.date.issued': [
        {
          value: '1950-01-01',
        },
      ],
    },
  });
  const lastItem = Object.assign(new Item(), {
    id: 'last-item-id',
    metadata: {
      'dc.date.issued': [
        {
          value: '1960-01-01',
        },
      ],
    },
  });

  const mockBrowseService = {
    getBrowseEntriesFor: (options: BrowseEntrySearchOptions) => toRemoteData([]),
    getBrowseItemsFor: (value: string, options: BrowseEntrySearchOptions) => toRemoteData([firstItem]),
    getFirstItemFor: (definition: string, scope?: string, sortDirection?: SortDirection) => null,
  };

  const mockDsoService = {
    findById: () => createSuccessfulRemoteDataObject$(mockCommunity),
  };

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({}),
    queryParams: observableOf({}),
    data: observableOf({ metadata: 'dateissued', metadataField: 'dc.date.issued' }),
  });

  const mockCdRef = Object.assign({
    detectChanges: () => fixture.detectChanges(),
  });

  paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NgbModule,
        BrowseByDateComponent,
        EnumKeysPipe,
        VarDirective,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BrowseService, useValue: mockBrowseService },
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
        { provide: Router, useValue: new RouterMock() },
        { provide: PaginationService, useValue: paginationService },
        { provide: ChangeDetectorRef, useValue: mockCdRef },
        { provide: Store, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BrowseByDateComponent, {
        remove: {
          imports: [
            ComcolPageHeaderComponent,
            ComcolPageLogoComponent,
            ThemedComcolPageHandleComponent,
            ComcolPageContentComponent,
            ThemedComcolPageBrowseByComponent,
            ThemedLoadingComponent,
            ThemedBrowseByComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByDateComponent);
    const browseService = fixture.debugElement.injector.get(BrowseService);
    spyOn(browseService, 'getFirstItemFor')
      // ok to expect the default browse as first param since we just need the mock items obtained via sort direction.
      .withArgs('author', undefined, SortDirection.ASC).and.returnValue(createSuccessfulRemoteDataObject$(firstItem))
      .withArgs('author', undefined, SortDirection.DESC).and.returnValue(createSuccessfulRemoteDataObject$(lastItem));
    comp = fixture.componentInstance;
    route = (comp as any).route;
    fixture.detectChanges();
  });

  it('should initialize the list of items', (done: DoneFn) => {
    expect(comp.loading$).toBeObservable(cold('(a|)', {
      a: false,
    }));
    comp.items$.subscribe((result) => {
      expect(result.payload.page).toEqual([firstItem]);
      done();
    });
  });

  it('should create a list of startsWith options with the earliest year at the end (rounded down by 10)', () => {
    expect(comp.startsWithOptions[comp.startsWithOptions.length - 1]).toEqual(1950);
  });

  it('should create a list of startsWith options with the current year first', () => {
    //expect(comp.startsWithOptions[0]).toEqual(new Date().getUTCFullYear());
    expect(comp.startsWithOptions[0]).toEqual(1960);
  });
});
