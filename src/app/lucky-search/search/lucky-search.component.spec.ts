import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LuckySearchComponent} from './lucky-search.component';
import {LuckySearchService} from '../lucky-search.service';
import {SearchConfigurationService} from '../../core/shared/search/search-configuration.service';
import {Router, UrlTree} from '@angular/router';
import {createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$} from '../../shared/remote-data.utils';
import {createPaginatedList} from '../../shared/testing/utils.test';
import {Item} from '../../core/shared/item.model';
import {of as observableOf} from 'rxjs';
import {PaginatedSearchOptions} from '../../shared/search/models/paginated-search-options.model';
import {PaginationComponentOptions} from '../../shared/pagination/pagination-component-options.model';
import {SortDirection, SortOptions} from '../../core/cache/models/sort-options.model';
import {TranslateModule} from '@ngx-translate/core';
import {By} from '@angular/platform-browser';
import {SearchResult} from '../../shared/search/models/search-result.model';
import {DSpaceObject} from '../../core/shared/dspace-object.model';
import {BitstreamDataService, MetadataFilter} from '../../core/data/bitstream-data.service';
import {Bitstream} from '../../core/shared/bitstream.model';
import {RouterMock} from '../../shared/mocks/router.mock';
import {MetadataMap, MetadataValue} from '../../core/shared/metadata.models';
import {FileSizePipe} from '../../shared/utils/file-size-pipe';
import {HardRedirectService} from '../../core/services/hard-redirect.service';
import {getBitstreamDownloadRoute} from '../../app-routing-paths';
import {PLATFORM_ID} from '@angular/core';
import {NotificationsService} from '../../shared/notifications/notifications.service';
import {NotificationsServiceStub} from '../../shared/testing/notifications-service.stub';

describe('LuckySearchComponent', () => {
  let fixture: ComponentFixture<LuckySearchComponent>;
  const defaultPagination: PaginatedSearchOptions = Object.assign({
    id: 'test-pg-id',
    pageSize: 10,
    currentPage: 1
  });

  const hardRedirectService = jasmine.createSpyObj('hardRedirectService', ['redirect']);

  const collection1 = Object.assign(new Item(), {
    uuid: 'item-uuid-1',
    name: 'Test item 1'
  });
  const collection2 = Object.assign(new Item(), {
    uuid: 'item-uuid-2',
    name: 'Test item 2'
  });
  const searchServiceStub = jasmine.createSpyObj('LuckySearchService', {
    getSearchLink: 'lucky-search',

    sendRequest: createSuccessfulRemoteDataObject$(createPaginatedList([
      {
        indexableObject: collection1,
        hitHighlights: {}
      }, {
        indexableObject: collection2,
        hitHighlights: {}
      }
    ]))
  });
  const bitstreamDataService = jasmine.createSpyObj('bitstreamDataService', {
    findByItem: jasmine.createSpy('findByItem')
  });
  const mockSearchOptions = observableOf(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      id: 'search-page-configuration',
      pageSize: 10,
      currentPage: 1
    }),
    sort: new SortOptions('dc.title', SortDirection.ASC)
  }));
  const searchConfigServiceStub = {
    paginatedSearchOptions: mockSearchOptions
  };
  let component: LuckySearchComponent;

  const urlTree = new UrlTree();
  urlTree.queryParams = {
    index: 'test',
    'value': 'test'
  };
  let routerStub = new RouterMock();

  const bitstreamMetadata = {
    'dc.title': [{value: 'test.pdf'} as MetadataValue],
    'dc.description': [{value: 'TestDescription'} as MetadataValue]
  } as MetadataMap;
  const bitstream = Object.assign(
    new Bitstream(),
    {_name: 'test.pdf', sizeBytes: 15, uuid: 'fa272dbf-e458-4ad2-868b-b4a27c6eac15', metadata: bitstreamMetadata}
  ) as Bitstream;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LuckySearchComponent, FileSizePipe],
      imports: [TranslateModule.forRoot()],
      providers: [
        {provide: Router, useValue: routerStub},
        {provide: SearchConfigurationService, useValue: searchConfigServiceStub},
        {provide: LuckySearchService, useValue: searchServiceStub},
        {provide: BitstreamDataService, useValue: bitstreamDataService},
        {provide: HardRedirectService, useValue: hardRedirectService},
        {provide: PLATFORM_ID, useValue: 'browser'},
        {provide: NotificationsService, useValue: new NotificationsServiceStub()},
      ],
    })
      .compileComponents();
  });

  afterEach(() => {
    routerStub = new RouterMock();
  });

  describe('should search items', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LuckySearchComponent);
      component = fixture.componentInstance;
      const firstSearchResult = Object.assign(new SearchResult(), {
        indexableObject: Object.assign(new DSpaceObject(), {
          id: 'd317835d-7b06-4219-91e2-1191900cb897',
          uuid: 'd317835d-7b06-4219-91e2-1191900cb897',
          name: 'My first publication',
          metadata: {
            'dspace.entity.type': [
              {value: 'Publication'}
            ]
          }
        })
      });

      const secondSearchResult = Object.assign(new SearchResult(), {
        indexableObject: Object.assign(new DSpaceObject(), {
          id: 'd317835d-7b06-4219-91e2-26565',
          uuid: 'd317835d-7b06-4219-91e2-26565',
          name: 'publication',
          metadata: {
            'dspace.entity.type': [
              {value: 'Publication'}
            ]
          }
        })
      });
      routerStub.parseUrl.and.returnValue(urlTree);
      const data = createSuccessfulRemoteDataObject(createPaginatedList([
        firstSearchResult, secondSearchResult
      ]));

      component.resultsRD$.next(data);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display basic search form results', () => {
      expect(fixture.debugElement.query(By.css('ds-search-results')))
        .toBeTruthy();
    });

    it('should call router.navigateByUrl when platform is browser', () => {
      component.redirect('test-url');
      expect(routerStub.navigateByUrl).toHaveBeenCalledWith('test-url', {replaceUrl: true});
    });
  });

  describe('should search bitstreams', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(LuckySearchComponent);
      component = fixture.componentInstance;

      const bitstreamSearchTree = new UrlTree();
      bitstreamSearchTree.queryParams = {
        index: 'testIndex',
        value: 'testValue',
        bitstreamMetadata: 'testMetadata',
        bitstreamValue: 'testMetadataValue'
      };

      const itemUUID = 'd317835d-7b06-4219-91e2-1191900cb897';
      const searchResult = Object.assign(new SearchResult(), {
        indexableObject: Object.assign(new DSpaceObject(), {
          id: 'd317835d-7b06-4219-91e2-12222',
          uuid: itemUUID,
          name: 'My first publication',
          metadata: {
            'dspace.entity.type': [
              {value: 'Publication'}
            ]
          }
        })
      });
      const data = createSuccessfulRemoteDataObject(createPaginatedList([searchResult]));
      const metadataFilters = [{metadataName: 'dc.title', metadataValue: 'title.pdf'}] as MetadataFilter[];
      component.bitstreamFilters$.next(metadataFilters);
      bitstreamDataService.findByItem.withArgs(itemUUID, 'ORIGINAL', metadataFilters, {})
        .and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream])));

      component.currentFilter = {identifier: 'test', value: 'test', bitstreamValue: 'test'};
      component.searchOptions$ = observableOf(defaultPagination);

      spyOn((component as any), 'getLuckySearchResults').and.returnValue(observableOf(data));
      spyOn((component as any), 'loadBitstreamsAndRedirectIfNeeded').and.returnValue(observableOf([bitstream]));
      spyOn((component as any), 'hasBitstreamFilters').and.returnValue(true);
      spyOn(component, 'redirect');
      routerStub.parseUrl.and.returnValue(bitstreamSearchTree).and.callThrough();

      component.resultsRD$.next(data);

      fixture.detectChanges();
    });

    it('should redirect to bitstream download route when only one bitstream is found', () => {
      expect(component.redirect).toHaveBeenCalledWith(getBitstreamDownloadRoute(bitstream));
    });

    it('should return bitstream filename', () => {
      expect(component.fileName(bitstream)).toEqual('test.pdf');
    });

    it('should return bitstream description', () => {
      expect(component.getDescription(bitstream)).toEqual('TestDescription');
    });

    it('should return bitstream file size', () => {
      expect(component.getSize(bitstream)).toEqual(15);
    });
  });

  describe('one item is available', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LuckySearchComponent);
      component = fixture.componentInstance;

      const bitstreamSearchTree = new UrlTree();
      bitstreamSearchTree.queryParams = {
        index: 'testIndex',
        value: 'testValue',
        bitstreamMetadata: 'testMetadata',
        bitstreamValue: 'testMetadataValue'
      };

      const itemUUID = 'd317835d-7b06-4219-91e2-1191900cb897';
      const firstSearchResult = Object.assign(new SearchResult(), {
        indexableObject: Object.assign(new DSpaceObject(), {
          id: 'd317835d-7b06-4219-91e2-1191900cb897',
          uuid: itemUUID,
          name: 'My first publication',
          metadata: {
            'dspace.entity.type': [
              {value: 'Publication'}
            ]
          }
        })
      });
      const data = createSuccessfulRemoteDataObject(createPaginatedList([firstSearchResult]));
      const metadataFilters = [{metadataName: 'dc.title', metadataValue: 'test.pdf'}] as MetadataFilter[];
      component.bitstreamFilters$.next(metadataFilters);
      bitstreamDataService.findByItem.withArgs(itemUUID, 'ORIGINAL', metadataFilters, {})
        .and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([bitstream])));

      component.currentFilter = {identifier: 'test', value: 'test', bitstreamValue: 'test'};
      component.searchOptions$ = observableOf(defaultPagination);

      spyOn((component as any), 'getLuckySearchResults').and.returnValue(observableOf(data));
      spyOn((component as any), 'loadBitstreamsAndRedirectIfNeeded').and.returnValue(observableOf([bitstream]));
      spyOn((component as any), 'hasBitstreamFilters').and.returnValue(true);
      spyOn(component, 'redirect');
      routerStub.parseUrl.and.returnValue(bitstreamSearchTree);

      component.resultsRD$.next(data);

      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should redirect to item page when only one result is found', () => {
      expect(component.redirect).toHaveBeenCalled();
    });
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LuckySearchComponent);
      component = fixture.componentInstance;
    });

  it('should not redirect when no bitstreams are found', () => {
    const item = Object.assign(new Item(), {uuid: 'item-uuid-1', name: 'Test item 1'});
    const data = createSuccessfulRemoteDataObject(createPaginatedList([
      {indexableObject: item, hitHighlights: {}}
    ])) as any;
    component.resultsRD$.next(data);
    component.bitstreamFilters$.next([{metadataName: 'dc.title', metadataValue: 'Non-existent bitstream'}]);
    bitstreamDataService.findByItem.and.returnValue(createSuccessfulRemoteDataObject$(createPaginatedList([])));
    spyOn(component, 'redirect');
    fixture.detectChanges();
    expect(component.redirect).not.toHaveBeenCalled();
  });

  it('should update showEmptySearchSection$ when no results are found', () => {
      fixture.detectChanges();
    const emptyResults = createSuccessfulRemoteDataObject(createPaginatedList([]));

    spyOn(component as any, 'getLuckySearchResults').and.returnValue(observableOf(emptyResults));
    spyOn(component as any, 'processSearchResults').and.returnValue(observableOf(emptyResults));

    component.getSearchResults();

    expect(component.showEmptySearchSection$.getValue()).toBe(true);
  });

  });
});
