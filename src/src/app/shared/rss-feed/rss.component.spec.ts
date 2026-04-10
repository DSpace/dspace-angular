import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { Collection } from '../../core/shared/collection.model';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { MockActivatedRoute } from '../mocks/active-router.mock';
import { RouterMock } from '../mocks/router.mock';
import { getMockTranslateService } from '../mocks/translate.service.mock';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../remote-data.utils';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { SearchFilter } from '../search/models/search-filter.model';
import { PaginationServiceStub } from '../testing/pagination-service.stub';
import { SearchConfigurationServiceStub } from '../testing/search-configuration-service.stub';
import { createPaginatedList } from '../testing/utils.test';
import { RSSComponent } from './rss.component';

describe('RssComponent', () => {
  let comp: RSSComponent;
  let options: SortOptions;
  let fixture: ComponentFixture<RSSComponent>;
  let uuid: string;
  let query: string;
  let groupDataService: GroupDataService;
  let linkHeadService: LinkHeadService;
  let configurationDataService: ConfigurationDataService;
  let paginationService;

  beforeEach(waitForAsync(() => {
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
    configurationDataService = jasmine.createSpyObj('configurationDataService', {
      findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
        name: 'test',
        values: [
          'org.dspace.ctask.general.ProfileFormats = test',
        ],
      })),
    });
    linkHeadService = jasmine.createSpyObj('linkHeadService', {
      addTag: '',
    });
    const mockCollectionRD: RemoteData<Collection> = createSuccessfulRemoteDataObject(mockCollection);
    const mockSearchOptions = of(new PaginatedSearchOptions({
      pagination: Object.assign(new PaginationComponentOptions(), {
        id: 'search-page-configuration',
        pageSize: 10,
        currentPage: 1,
      }),
      sort: new SortOptions('dc.title', SortDirection.ASC),
    }));
    groupDataService = jasmine.createSpyObj('groupsDataService', {
      findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
      getGroupRegistryRouterLink: '',
      getUUIDFromString: '',
    });
    paginationService = new PaginationServiceStub();
    const searchConfigService = {
      paginatedSearchOptions: mockSearchOptions,
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: GroupDataService, useValue: groupDataService },
        { provide: LinkHeadService, useValue: linkHeadService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: SearchConfigurationService, useValue: new SearchConfigurationServiceStub() },
        { provide: PaginationService, useValue: paginationService },
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new MockActivatedRoute },
        { provide: TranslateService, useValue: getMockTranslateService() },
      ],
      declarations: [],
    }).compileComponents();
  }));

  beforeEach(() => {
    options = new SortOptions('dc.title', SortDirection.DESC);
    uuid = '2cfcf65e-0a51-4bcb-8592-b8db7b064790';
    query = 'test';
    fixture = TestBed.createComponent(RSSComponent);
    comp = fixture.componentInstance;
  });

  it('should formulate the correct url given params in url', () => {
    const route = comp.formulateRoute(uuid, 'opensearch/search', options, query);
    expect(route).toBe('/opensearch/search?format=atom&scope=2cfcf65e-0a51-4bcb-8592-b8db7b064790&sort=dc.title&sort_direction=DESC&query=test');
  });

  it('should skip uuid if its null', () => {
    const route = comp.formulateRoute(null, 'opensearch/search', options, query);
    expect(route).toBe('/opensearch/search?format=atom&sort=dc.title&sort_direction=DESC&query=test');
  });

  it('should default to query * if none provided', () => {
    const route = comp.formulateRoute(null, 'opensearch/search', options, null);
    expect(route).toBe('/opensearch/search?format=atom&sort=dc.title&sort_direction=DESC&query=*');
  });

  it('should include filters in opensearch url if provided', () => {
    const filters = [
      new SearchFilter('f.test', ['value','another value'], 'contains'), // should be split into two arguments, spaces should be URI-encoded
      new SearchFilter('f.range', ['[1987 TO 1988]'], 'equals'), // value should be URI-encoded, ',equals' should not
    ];
    const route = comp.formulateRoute(uuid, 'opensearch/search', options, query, filters);
    expect(route).toBe('/opensearch/search?format=atom&scope=2cfcf65e-0a51-4bcb-8592-b8db7b064790&sort=dc.title&sort_direction=DESC&query=test&f.test=value,contains&f.test=another%20value,contains&f.range=%5B1987%20TO%201988%5D,equals');
  });

  it('should include configuration in opensearch url if provided', () => {
    const route = comp.formulateRoute(uuid, 'opensearch/search', options, query, null, 'adminConfiguration');
    expect(route).toBe('/opensearch/search?format=atom&scope=2cfcf65e-0a51-4bcb-8592-b8db7b064790&sort=dc.title&sort_direction=DESC&query=test&configuration=adminConfiguration');
  });

  it('should include rpp in opensearch url if provided', () => {
    const route = comp.formulateRoute(uuid, 'opensearch/search', options, query, null, null, 50);
    expect(route).toBe('/opensearch/search?format=atom&scope=2cfcf65e-0a51-4bcb-8592-b8db7b064790&sort=dc.title&sort_direction=DESC&query=test&rpp=50');
  });
});

