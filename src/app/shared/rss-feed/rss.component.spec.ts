import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { GroupDataService } from '@dspace/core/eperson/group-data.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { LinkHeadService } from '@dspace/core/services/link-head.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { SearchFilter } from '@dspace/core/shared/search/models/search-filter.model';
import { MockActivatedRoute } from '@dspace/core/testing/active-router.mock';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { RouterMock } from '@dspace/core/testing/router.mock';
import { SearchConfigurationServiceStub } from '@dspace/core/testing/search-configuration-service.stub';
import { getMockTranslateService } from '@dspace/core/testing/translate.service.mock';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateService } from '@ngx-translate/core';

import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { Community } from '../../core/shared/community.model';
import { SearchConfigurationService } from '../search/search-configuration.service';
import { RSSComponent } from './rss.component';

describe('RssComponent', () => {
  let comp: RSSComponent;
  let options: SortOptions;
  let fixture: ComponentFixture<RSSComponent>;
  let uuid: string;
  let query: string;
  let configurationDataService: jasmine.SpyObj<ConfigurationDataService>;
  let groupDataService: jasmine.SpyObj<GroupDataService>;
  let dspaceObjectService: jasmine.SpyObj<DSpaceObjectDataService>;
  let linkHeadService: jasmine.SpyObj<LinkHeadService>;
  let paginationService;

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

  const mockCommunity: Community = Object.assign(new Community(), {
    id: 'da9a4b37-3e8e-402e-9b14-7c5b8a1d4f21',
    name: 'test-community',
    _links: {
      self: {
        href: 'https://rest.api/communities/da9a4b37-3e8e-402e-9b14-7c5b8a1d4f21',
      },
    },
  });

  /**
   * Reconfigure the configurationDataService spy and reinitialise the component.
   * @param formats The raw format values to expose via websvc.opensearch.formats
   * @param dso Either the collection or community that we are acting like the rss page is loaded on
   */
  function setupComponent(formats: string[], scopedDso?: Collection | Community): void {
    configurationDataService = TestBed.inject(ConfigurationDataService) as jasmine.SpyObj<ConfigurationDataService>;
    (configurationDataService.findByPropertyName as jasmine.Spy).and.callFake((property: string) => {
      switch (property) {
        case 'websvc.opensearch.enable':
          return createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
            name: 'websvc.opensearch.enable',
            values: ['true'],
          }));
        case 'websvc.opensearch.formats':
          return createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
            name: 'websvc.opensearch.formats',
            values: formats,
          }));
        case 'websvc.opensearch.svccontext':
          return createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
            name: 'websvc.opensearch.svccontext',
            values: ['opensearch/search'],
          }));
        default:
          return createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
            name: property,
            values: [],
          }));
      }
    });

    groupDataService = TestBed.inject(GroupDataService) as jasmine.SpyObj<GroupDataService>;
    groupDataService.findListByHref.and.returnValue(
      createSuccessfulRemoteDataObject$(createPaginatedList([])),
    );
    groupDataService.getGroupRegistryRouterLink.and.returnValue('');

    linkHeadService = TestBed.inject(LinkHeadService) as jasmine.SpyObj<LinkHeadService>;
    linkHeadService.addTag.calls.reset();
    linkHeadService.removeTag.calls.reset();

    dspaceObjectService = TestBed.inject(DSpaceObjectDataService) as jasmine.SpyObj<DSpaceObjectDataService>;
    if (scopedDso) {
      dspaceObjectService.findById.and.returnValue(createSuccessfulRemoteDataObject$(scopedDso));
      groupDataService.getUUIDFromString.and.returnValue(scopedDso.id);
    }

    fixture = TestBed.createComponent(RSSComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(waitForAsync(() => {
    paginationService = new PaginationServiceStub();

    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigurationDataService, useValue: jasmine.createSpyObj('ConfigurationDataService', ['findByPropertyName']) },
        { provide: GroupDataService, useValue: jasmine.createSpyObj('GroupDataService', ['findListByHref', 'getGroupRegistryRouterLink', 'getUUIDFromString']) },
        { provide: DSpaceObjectDataService, useValue: jasmine.createSpyObj('DSpaceObjectDataService', ['findById']) },
        { provide: LinkHeadService, useValue: jasmine.createSpyObj('LinkHeadService', ['addTag', 'removeTag']) },
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
  });

  describe('formulateRoute', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(RSSComponent);
      comp = fixture.componentInstance;
    });

    it('should formulate the correct url given params in url', () => {
      const route = comp.formulateRoute(uuid, 'opensearch/search', 'atom', options, query);
      expect(route).toBe('/opensearch/search?format=atom&scope=2cfcf65e-0a51-4bcb-8592-b8db7b064790&sort=dc.title&sort_direction=DESC&query=test');
    });

    it('should skip uuid if its null', () => {
      const route = comp.formulateRoute(null, 'opensearch/search', 'atom', options, query);
      expect(route).toBe('/opensearch/search?format=atom&sort=dc.title&sort_direction=DESC&query=test');
    });

    it('should default to query * if none provided', () => {
      const route = comp.formulateRoute(null, 'opensearch/search', 'atom', options, null);
      expect(route).toBe('/opensearch/search?format=atom&sort=dc.title&sort_direction=DESC&query=*');
    });

    it('should include filters in opensearch url if provided', () => {
      const filters = [
        new SearchFilter('f.test', ['value', 'another value'], 'contains'),
        new SearchFilter('f.range', ['[1987 TO 1988]'], 'equals'),
      ];
      const route = comp.formulateRoute(uuid, 'opensearch/search', 'atom', options, query, filters);
      expect(route).toBe('/opensearch/search?format=atom&scope=2cfcf65e-0a51-4bcb-8592-b8db7b064790&sort=dc.title&sort_direction=DESC&query=test&f.test=value,contains&f.test=another%20value,contains&f.range=%5B1987%20TO%201988%5D,equals');
    });

    it('should include configuration in opensearch url if provided', () => {
      const route = comp.formulateRoute(uuid, 'opensearch/search', 'atom', options, query, null, 'adminConfiguration');
      expect(route).toBe('/opensearch/search?format=atom&scope=2cfcf65e-0a51-4bcb-8592-b8db7b064790&sort=dc.title&sort_direction=DESC&query=test&configuration=adminConfiguration');
    });

    it('should include rpp in opensearch url if provided', () => {
      const route = comp.formulateRoute(uuid, 'opensearch/search', 'atom', options, query, null, null, 50);
      expect(route).toBe('/opensearch/search?format=atom&scope=2cfcf65e-0a51-4bcb-8592-b8db7b064790&sort=dc.title&sort_direction=DESC&query=test&rpp=50');
    });
  });

  describe('when formats are configured as html,atom,rss', () => {
    beforeEach(() => {
      setupComponent(['html', 'atom', 'rss']);
    });

    it('should set formats$ to only the recognised formats, dropping html', () => {
      expect(comp.formats$.getValue()).toEqual(['atom', 'rss']);
    });

    it('should set route$ to the atom feed (first recognised format)', () => {
      expect(comp.route$.getValue()).toContain('format=atom');
    });

    it('should add a rel="search" link pointing to the atom feed', () => {
      const searchTag = (linkHeadService.addTag as jasmine.Spy).calls.all()
        .map(c => c.args[0])
        .find(tag => tag.rel === 'search');
      expect(searchTag).toBeTruthy();
      expect(searchTag.type).toBe('application/atom+xml');
    });

    it('should add a rel="alternate" link for atom', () => {
      const alternateTags = (linkHeadService.addTag as jasmine.Spy).calls.all()
        .map(c => c.args[0])
        .filter(tag => tag.rel === 'alternate');
      expect(alternateTags.some(t => t.type === 'application/atom+xml')).toBeTrue();
    });

    it('should add a rel="alternate" link for rss', () => {
      const alternateTags = (linkHeadService.addTag as jasmine.Spy).calls.all()
        .map(c => c.args[0])
        .filter(tag => tag.rel === 'alternate');
      expect(alternateTags.some(t => t.type === 'application/rss+xml')).toBeTrue();
    });
  });

  describe('when formats are configured as html,rss', () => {
    beforeEach(() => {
      setupComponent(['html', 'rss']);
    });

    it('should set formats$ to only the recognised formats, dropping html', () => {
      expect(comp.formats$.getValue()).toEqual(['rss']);
    });

    it('should set route$ to the rss feed (first recognised format)', () => {
      expect(comp.route$.getValue()).toContain('format=rss');
    });

    it('should add a rel="search" link pointing to the rss feed', () => {
      const searchTag = (linkHeadService.addTag as jasmine.Spy).calls.all()
        .map(c => c.args[0])
        .find(tag => tag.rel === 'search');
      expect(searchTag).toBeTruthy();
      expect(searchTag.type).toBe('application/rss+xml');
    });

    it('should add a rel="alternate" link only for rss', () => {
      const alternateTags = (linkHeadService.addTag as jasmine.Spy).calls.all()
        .map(c => c.args[0])
        .filter(tag => tag.rel === 'alternate');
      expect(alternateTags.length).toBe(1);
      expect(alternateTags[0].type).toBe('application/rss+xml');
    });

    it('should not add a rel="alternate" link for atom', () => {
      const alternateTags = (linkHeadService.addTag as jasmine.Spy).calls.all()
        .map(c => c.args[0])
        .filter(tag => tag.rel === 'alternate');
      expect(alternateTags.some(t => t.type === 'application/atom+xml')).toBeFalse();
    });
  });

  describe('when scoped to a collection', () => {
    beforeEach(() => {
      setupComponent(['html', 'atom', 'rss'], mockCollection);
    });

    it('should include the collection name in the rel="alternate" link titles', () => {
      const alternateTags = (linkHeadService.addTag as jasmine.Spy).calls.all()
        .map(c => c.args[0])
        .filter(tag => tag.rel === 'alternate');
      for (const tag of alternateTags) {
        expect(tag.title).toContain(mockCollection.name);
      }
    });

    describe('when scoped to a community', () => {
      beforeEach(() => {
        setupComponent(['html', 'atom', 'rss'], mockCommunity);
      });

      it('should include the community name in the rel="alternate" link titles', () => {
        const alternateTags = (linkHeadService.addTag as jasmine.Spy).calls.all()
          .map(c => c.args[0])
          .filter(tag => tag.rel === 'alternate');
        for (const tag of alternateTags) {
          expect(tag.title).toContain(mockCommunity.name);
        }
      });
    });
  });
});
