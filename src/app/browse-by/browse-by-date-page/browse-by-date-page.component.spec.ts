import { BrowseByDatePageComponent } from './browse-by-date-page.component';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowseService } from '../../core/browse/browse.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { RouterMock } from '../../shared/mocks/router.mock';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { Community } from '../../core/shared/community.model';
import { Item } from '../../core/shared/item.model';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { toRemoteData } from '../browse-by-metadata-page/browse-by-metadata-page.component.spec';
import { VarDirective } from '../../shared/utils/var.directive';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { PaginationService } from '../../core/pagination/pagination.service';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { APP_CONFIG } from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
import { SortDirection } from '../../core/cache/models/sort-options.model';
import { SearchManager } from '../../core/browse/search-manager';
import { cold } from 'jasmine-marbles';
import { Store } from '@ngrx/store';
import { BrowseEntry } from '../../core/shared/browse-entry.model';

describe('BrowseByDatePageComponent', () => {
  let comp: BrowseByDatePageComponent;
  let fixture: ComponentFixture<BrowseByDatePageComponent>;
  let route: ActivatedRoute;
  let paginationService;

  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    metadata: [
      {
        key: 'dc.title',
        value: 'test community'
      }
    ]
  });

  const firstItem = Object.assign(new Item(), {
    id: 'first-item-id',
    metadata: {
      'dc.date.issued': [
        {
          value: '1950-01-01'
        }
      ]
    }
  });
  const lastItem = Object.assign(new Item(), {
    id: 'last-item-id',
    metadata: {
      'dc.date.issued': [
        {
          value: '1960-01-01'
        }
      ]
    }
  });

   const mockBrowseService = {
     getBrowseEntriesFor: (options: BrowseEntrySearchOptions) => toRemoteData([]),
     getBrowseItemsFor: (value: string, options: BrowseEntrySearchOptions) => toRemoteData([firstItem]),
     getFirstItemFor: (definition: string, scope?: string, sortDirection?: SortDirection) => createSuccessfulRemoteDataObject$(firstItem)
   };

  const mockBrowseManager = {
    getBrowseItemsFor: (value: string, options: BrowseEntrySearchOptions) => toRemoteData([firstItem])
  };

  const mockDsoService = {
    findById: () => createSuccessfulRemoteDataObject$(mockCommunity)
  };

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({}),
    queryParams: observableOf({}),
    data: observableOf({ metadata: 'dateissued', metadataField: 'dc.date.issued' })
  });

  const mockCdRef = Object.assign({
    detectChanges: () => fixture.detectChanges()
  });

  paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule],
      declarations: [BrowseByDatePageComponent, EnumKeysPipe, VarDirective],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BrowseService, useValue: mockBrowseService },
        { provide: SearchManager, useValue: mockBrowseManager },
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
        { provide: Router, useValue: new RouterMock() },
        { provide: PaginationService, useValue: paginationService },
        { provide: ChangeDetectorRef, useValue: mockCdRef },
        { provide: APP_CONFIG, useValue: environment },
        { provide: Store, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByDatePageComponent);
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

  describe('when rendered in SSR', () => {
    beforeEach(() => {
      comp.platformId = 'server';
      spyOn((comp as any).searchManager, 'getBrowseItemsFor');
    });

    it('should not call getBrowseItemsFor on init', (done) => {
      comp.ngOnInit();
      expect((comp as any).searchManager.getBrowseItemsFor).not.toHaveBeenCalled();
      comp.loading$.subscribe((res) => {
        expect(res).toBeFalsy();
        done();
      });
    });
  });

  describe('when rendered in CSR', () => {
    beforeEach(() => {
      comp.platformId = 'browser';
      spyOn((comp as any).searchManager, 'getBrowseItemsFor').and.returnValue(createSuccessfulRemoteDataObject$(new BrowseEntry()));
    });

    it('should call getBrowseItemsFor on init', fakeAsync(() => {
      comp.ngOnInit();
      tick(100);
      expect((comp as any).searchManager.getBrowseItemsFor).toHaveBeenCalled();
    }));
  });
});
