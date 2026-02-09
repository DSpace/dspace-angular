import {
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { authReducer } from '@dspace/core/auth/auth.reducer';
import { AuthTokenInfo } from '@dspace/core/auth/models/auth-token-info.model';
import { BrowseService } from '@dspace/core/browse/browse.service';
import { BrowseByDataType } from '@dspace/core/browse/browse-by-data-type';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { FlatBrowseDefinition } from '@dspace/core/shared/flat-browse-definition.model';
import { HierarchicalBrowseDefinition } from '@dspace/core/shared/hierarchical-browse-definition.model';
import { Item } from '@dspace/core/shared/item.model';
import { ValueListBrowseDefinition } from '@dspace/core/shared/value-list-browse-definition.model';
import { EPersonMock } from '@dspace/core/testing/eperson.mock';
import { HostWindowServiceStub } from '@dspace/core/testing/host-window-service.stub';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import {
  Store,
  StoreModule,
} from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  AppState,
  storeModuleConfig,
} from '../app.reducer';
import { HostWindowService } from '../shared/host-window.service';
import { MenuService } from '../shared/menu/menu.service';
import { MenuServiceStub } from '../shared/menu/menu-service.stub';
import { getMockThemeService } from '../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../shared/theme-support/theme.service';
import { NavbarComponent } from './navbar.component';

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;
let store: Store<AppState>;
let initialState: any;

const authorizationService = jasmine.createSpyObj('authorizationService', {
  isAuthorized: of(true),
});

const mockItem = Object.assign(new Item(), {
  id: 'fake-id',
  uuid: 'fake-id',
  handle: 'fake/handle',
  lastModified: '2018',
  _links: {
    self: {
      href: 'https://localhost:8000/items/fake-id',
    },
  },
});

const routeStub = {
  data: of({
    dso: createSuccessfulRemoteDataObject(mockItem),
  }),
  children: [],
};



describe('NavbarComponent', () => {
  const menuService = new MenuServiceStub();
  let browseDefinitions;
  // waitForAsync beforeEach
  beforeEach(waitForAsync(() => {
    browseDefinitions = [
      Object.assign(
        new FlatBrowseDefinition(), {
          id: 'title',
          dataType: BrowseByDataType.Title,
        },
      ),
      Object.assign(
        new FlatBrowseDefinition(), {
          id: 'dateissued',
          dataType: BrowseByDataType.Date,
          metadataKeys: ['dc.date.issued'],
        },
      ),
      Object.assign(
        new ValueListBrowseDefinition(), {
          id: 'author',
          dataType: BrowseByDataType.Metadata,
        },
      ),
      Object.assign(
        new ValueListBrowseDefinition(), {
          id: 'subject',
          dataType: BrowseByDataType.Metadata,
        },
      ),
      Object.assign(
        new HierarchicalBrowseDefinition(), {
          id: 'srsc',
        },
      ),
    ];
    initialState = {
      core: {
        auth: {
          authenticated: true,
          loaded: true,
          blocking: false,
          loading: false,
          authToken: new AuthTokenInfo('test_token'),
          userId: EPersonMock.id,
          authMethods: [],
        },
      },
    };

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        StoreModule.forRoot({ auth: authReducer }, storeModuleConfig),
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NavbarComponent,
      ],
      providers: [
        Injector,
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: MenuService, useValue: menuService },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: BrowseService, useValue: { getBrowseDefinitions: createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, browseDefinitions)) } },
        { provide: AuthorizationDataService, useValue: authorizationService },
        provideMockStore({ initialState }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(NavbarComponent);

    comp = fixture.componentInstance;

  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });


});
