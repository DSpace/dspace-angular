import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from '@dspace/core/data/item-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { GroupDataService } from '@dspace/core/eperson/group-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { LinkHeadService } from '@dspace/core/services/link-head.service';
import { RouteService } from '@dspace/core/services/route.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { HostWindowServiceStub } from '@dspace/core/testing/host-window-service.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { ObjectSelectServiceStub } from '@dspace/core/testing/object-select-service.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { SearchConfigurationServiceStub } from '@dspace/core/testing/search-configuration-service.stub';
import { SearchServiceStub } from '@dspace/core/testing/search-service.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { SEARCH_CONFIG_SERVICE } from '../../my-dspace-page/my-dspace-configuration.service';
import { ErrorComponent } from '../../shared/error/error.component';
import { HostWindowService } from '../../shared/host-window.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { ItemSelectComponent } from '../../shared/object-select/item-select/item-select.component';
import { ObjectSelectService } from '../../shared/object-select/object-select.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { SearchService } from '../../shared/search/search.service';
import { SearchConfigurationService } from '../../shared/search/search-configuration.service';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { getMockThemeService } from '../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { CollectionItemMapperComponent } from './collection-item-mapper.component';

describe('CollectionItemMapperComponent', () => {
  let comp: CollectionItemMapperComponent;
  let fixture: ComponentFixture<CollectionItemMapperComponent>;

  let route: ActivatedRoute;
  let router: Router;
  let searchConfigService: SearchConfigurationService;
  let searchService: SearchService;
  let notificationsService: NotificationsService;
  let itemDataService: ItemDataService;

  const mockCollection: Collection = Object.assign(new Collection(), {
    id: 'ce41d451-97ed-4a9c-94a1-7de34f16a9f4',
    name: 'test-collection',
    _links: {
      mappedItems: {
        href: 'https://rest.api/collections/ce41d451-97ed-4a9c-94a1-7de34f16a9f4/mappedItems',
      },
      self: {
        href: 'https://rest.api/collections/ce41d451-97ed-4a9c-94a1-7de34f16a9f4',
      },
    },
  });
  const mockCollectionRD: RemoteData<Collection> = createSuccessfulRemoteDataObject(mockCollection);
  const mockSearchOptions = of(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      id: 'search-page-configuration',
      pageSize: 10,
      currentPage: 1,
    }),
    sort: new SortOptions('dc.title', SortDirection.ASC),
    scope: mockCollection.id,
  }));
  const url = 'http://test.url';
  const urlWithParam = url + '?param=value';
  const routerStub = Object.assign(new RouterStub(), {
    url: urlWithParam,
    navigateByUrl: {},
    navigate: {},
  });
  const searchConfigServiceStub = {
    paginatedSearchOptions: mockSearchOptions,
  };
  const emptyList = createSuccessfulRemoteDataObject(createPaginatedList([]));
  const itemDataServiceStub = {
    mapToCollection: () => createSuccessfulRemoteDataObject$({}),
    findListByHref: () => of(emptyList),
  };
  const activatedRouteStub = {
    parent: {
      data: of({
        dso: mockCollectionRD,
      }),
    },
    snapshot: {
      queryParamMap: new Map([
        ['query', 'test'],
      ]),
    },
  };
  const translateServiceStub = {
    get: () => of('test-message of collection ' + mockCollection.name),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter(),
  };
  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: () => of(emptyList),
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    clearDiscoveryRequests: () => {},
    /* eslint-enable no-empty,@typescript-eslint/no-empty-function */
  });
  const collectionDataServiceStub = {
    getMappedItems: () => of(emptyList),
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    clearMappedItemsRequests: () => {},
    /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
  };
  const routeServiceStub = {
    getRouteParameterValue: () => {
      return of('');
    },
    getQueryParameterValue: () => {
      return of('');
    },
    getQueryParamsWithPrefix: () => {
      return of('');
    },
  };
  const fixedFilterServiceStub = {
    getQueryByFilterName: () => {
      return of('');
    },
  };

  const authorizationDataService = jasmine.createSpyObj('authorizationDataService', {
    isAuthorized: of(true),
  });

  const linkHeadService = jasmine.createSpyObj('linkHeadService', {
    addTag: '',
  });

  const groupDataService = jasmine.createSpyObj('groupsDataService', {
    findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    getGroupRegistryRouterLink: '',
    getUUIDFromString: '',
  });

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'test',
      values: [
        'org.dspace.ctask.general.ProfileFormats = test',
      ],
    })),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, CollectionItemMapperComponent, ItemSelectComponent, SearchFormComponent, PaginationComponent, EnumKeysPipe, VarDirective, ErrorComponent, LoadingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: SearchConfigurationService, useValue: searchConfigServiceStub },
        { provide: SearchService, useValue: searchServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ItemDataService, useValue: itemDataServiceStub },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: ObjectSelectService, useValue: new ObjectSelectServiceStub() },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: LinkHeadService, useValue: linkHeadService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
    }).overrideComponent(CollectionItemMapperComponent, {
      set: {
        providers: [
          {
            provide: SEARCH_CONFIG_SERVICE,
            useClass: SearchConfigurationServiceStub,
          },
        ] },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionItemMapperComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    route = (comp as any).route;
    router = (comp as any).router;
    searchConfigService = (comp as any).searchConfigService;
    searchService = (comp as any).searchService;
    notificationsService = (comp as any).notificationsService;
    itemDataService = (comp as any).itemDataService;
  });

  it('should display the correct collection name', () => {
    const name: HTMLElement = fixture.debugElement.query(By.css('#collection-name')).nativeElement;
    expect(name.innerHTML).toContain(mockCollection.name);
  });

  describe('mapItems', () => {
    const ids = ['id1', 'id2', 'id3', 'id4'];

    it('should display a success message if at least one mapping was successful', () => {
      comp.mapItems(ids);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(notificationsService.error).not.toHaveBeenCalled();
    });

    it('should display an error message if at least one mapping was unsuccessful', () => {
      spyOn(itemDataService, 'mapToCollection').and.returnValue(createFailedRemoteDataObject$('Not Found', 404));
      comp.mapItems(ids);
      expect(notificationsService.success).not.toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
    });
  });

  describe('tabChange', () => {
    beforeEach(() => {
      spyOn(routerStub, 'navigateByUrl');
      comp.tabChange({});
    });

    it('should navigate to the same page to remove parameters', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith(url);
    });
  });

  describe('buildQuery', () => {
    const query = 'query';
    const expected = `-location.coll:\"${mockCollection.id}\" AND ${query}`;

    let result;

    beforeEach(() => {
      result = comp.buildQuery(mockCollection.id, query);
    });

    it('should build a solr query to exclude the provided collection', () => {
      expect(result).toEqual(expected);
    });
  });

  describe('onCancel', () => {
    beforeEach(() => {
      spyOn(routerStub, 'navigate');
      comp.onCancel();
    });

    it('should navigate to the collection page', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/collections/', mockCollection.id]);
    });
  });

});
