import {
  AsyncPipe,
  CommonModule,
} from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { environment } from '../../../environments/environment';
import { BrowseService } from '../../core/browse/browse.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Community } from '../../core/shared/community.model';
import { Item } from '../../core/shared/item.model';
import { ThemedBrowseByComponent } from '../../shared/browse-by/themed-browse-by.component';
import { ThemedComcolPageBrowseByComponent } from '../../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ComcolPageContentComponent } from '../../shared/comcol/comcol-page-content/comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { DsoEditMenuComponent } from '../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { RouterMock } from '../../shared/mocks/router.mock';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { PaginationServiceStub } from '../../shared/testing/pagination-service.stub';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { toRemoteData } from '../browse-by-metadata/browse-by-metadata.component.spec';
import { BrowseByTitleComponent } from './browse-by-title.component';

describe('BrowseByTitleComponent', () => {
  let comp: BrowseByTitleComponent;
  let fixture: ComponentFixture<BrowseByTitleComponent>;
  let itemDataService: ItemDataService;
  let route: ActivatedRoute;

  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    metadata: [
      {
        key: 'dc.title',
        value: 'test community',
      },
    ],
  });

  const mockItems = [
    Object.assign(new Item(), {
      id: 'fakeId',
      metadata: [
        {
          key: 'dc.title',
          value: 'Fake Title',
        },
      ],
    }),
  ];

  const mockBrowseService = {
    getBrowseItemsFor: () => toRemoteData(mockItems),
    getBrowseEntriesFor: () => toRemoteData([]),
  };

  const mockDsoService = {
    findById: () => createSuccessfulRemoteDataObject$(mockCommunity),
  };

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({}),
    data: observableOf({ metadata: 'title' }),
  });

  const paginationService = new PaginationServiceStub();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, BrowseByTitleComponent, EnumKeysPipe, VarDirective, AsyncPipe],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BrowseService, useValue: mockBrowseService },
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
        { provide: PaginationService, useValue: paginationService },
        { provide: Router, useValue: new RouterMock() },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BrowseByTitleComponent, {
        remove: { imports: [
          ComcolPageHeaderComponent,
          ComcolPageLogoComponent,
          ThemedComcolPageHandleComponent,
          ComcolPageContentComponent,
          DsoEditMenuComponent,
          ThemedComcolPageBrowseByComponent,
          ThemedLoadingComponent,
          ThemedBrowseByComponent,
        ] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByTitleComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    itemDataService = (comp as any).itemDataService;
    route = (comp as any).route;
  });

  it('should initialize the list of items', () => {
    comp.items$.subscribe((result) => {
      expect(result.payload.page).toEqual(mockItems);
    });
  });
});
