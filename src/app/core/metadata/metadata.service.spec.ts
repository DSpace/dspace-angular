import { CommonModule, Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Store, StoreModule } from '@ngrx/store';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmptyError, Observable, of } from 'rxjs';

import { RemoteData } from '../data/remote-data';
import { Item } from '../shared/item.model';

import {
  ItemMock,
  MockBitstream1,
  MockBitstream2,
  MockBitstreamFormat1,
  MockBitstreamFormat2
} from '../../shared/mocks/item.mock';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { AuthService } from '../auth/auth.service';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';

import { CoreState } from '../core.reducers';
import { BitstreamDataService } from '../data/bitstream-data.service';
import { BitstreamFormatDataService } from '../data/bitstream-format-data.service';
import { CommunityDataService } from '../data/community-data.service';
import { DefaultChangeAnalyzer } from '../data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';

import { ItemDataService } from '../data/item-data.service';
import { buildPaginatedList, PaginatedList } from '../data/paginated-list.model';
import { FindListOptions } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BitstreamFormat } from '../shared/bitstream-format.model';
import { Bitstream } from '../shared/bitstream.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { MetadataValue } from '../shared/metadata.models';
import { PageInfo } from '../shared/page-info.model';
import { UUIDService } from '../shared/uuid.service';

import { MetadataService } from './metadata.service';
import { environment } from '../../../environments/environment';
import { storeModuleConfig } from '../../app.reducer';
import { HardRedirectService } from '../services/hard-redirect.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { RootDataService } from '../data/root-data.service';
import { Root } from '../data/root.model';

/* tslint:disable:max-classes-per-file */
@Component({
  template: `
    <router-outlet></router-outlet>`
})
class TestComponent {
  constructor(private metadata: MetadataService) {
    metadata.listenForRouteChange();
  }
}

@Component({ template: '' })
class DummyItemComponent {
  constructor(private route: ActivatedRoute, private items: ItemDataService, private metadata: MetadataService) {
    this.route.params.subscribe((params) => {
      this.metadata.processRemoteData(this.items.findById(params.id));
    });
  }
}

/* tslint:enable:max-classes-per-file */

describe('MetadataService', () => {
  let metadataService: MetadataService;

  let meta: Meta;

  let title: Title;

  let store: Store<CoreState>;

  let objectCacheService: ObjectCacheService;
  let requestService: RequestService;
  let uuidService: UUIDService;
  let remoteDataBuildService: RemoteDataBuildService;
  let itemDataService: ItemDataService;
  let authService: AuthService;
  let rootService: RootDataService;
  let translateService: TranslateService;

  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<TestComponent>;

  let tagStore: Map<string, MetaDefinition[]>;

  beforeEach(() => {

    store = new Store<CoreState>(undefined, undefined, undefined);
    spyOn(store, 'dispatch');

    objectCacheService = new ObjectCacheService(store, undefined);
    uuidService = new UUIDService();
    requestService = new RequestService(objectCacheService, uuidService, store, undefined);
    remoteDataBuildService = new RemoteDataBuildService(objectCacheService, undefined, requestService);
    const mockBitstreamDataService = {
      findAllByItemAndBundleName(item: Item, bundleName: string, options?: FindListOptions, ...linksToFollow: FollowLinkConfig<Bitstream>[]): Observable<RemoteData<PaginatedList<Bitstream>>> {
        if (item.equals(ItemMock)) {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [MockBitstream1, MockBitstream2]));
        } else {
          return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), []));
        }
      },
    };
    const mockBitstreamFormatDataService = {
      findByBitstream(bitstream: Bitstream): Observable<RemoteData<BitstreamFormat>> {
        switch (bitstream) {
          case MockBitstream1:
            return createSuccessfulRemoteDataObject$(MockBitstreamFormat1);
            break;
          case MockBitstream2:
            return createSuccessfulRemoteDataObject$(MockBitstreamFormat2);
            break;
          default:
            return createSuccessfulRemoteDataObject$(new BitstreamFormat());
        }
      }
    };
    rootService = jasmine.createSpyObj('rootService', {
      findRoot: createSuccessfulRemoteDataObject$(Object.assign(new Root(), {
        dspaceVersion: 'mock-dspace-version'
      }))
    });

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        RouterTestingModule.withRoutes([
          { path: 'items/:id', component: DummyItemComponent, pathMatch: 'full' },
          {
            path: 'other',
            component: DummyItemComponent,
            pathMatch: 'full',
            data: { title: 'Dummy Title', description: 'This is a dummy item component for testing!' }
          }
        ])
      ],
      declarations: [
        TestComponent,
        DummyItemComponent
      ],
      providers: [
        { provide: ObjectCacheService, useValue: objectCacheService },
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: remoteDataBuildService },
        { provide: HALEndpointService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: BitstreamFormatDataService, useValue: mockBitstreamFormatDataService },
        { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        { provide: RootDataService, useValue: rootService },
        Meta,
        Title,
        // tslint:disable-next-line:no-empty
        { provide: ItemDataService, useValue: { findById: () => {} } },
        BrowseService,
        MetadataService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);
    itemDataService = TestBed.inject(ItemDataService);
    metadataService = TestBed.inject(MetadataService);
    authService = TestBed.inject(AuthService);
    translateService = TestBed.inject(TranslateService);

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(TestComponent);

    tagStore = metadataService.getTagStore();
  });

  it('items page should set meta tags', fakeAsync(() => {
    spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(ItemMock));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(title.getTitle()).toEqual('Test PowerPoint Document');
    expect(tagStore.get('citation_title')[0].content).toEqual('Test PowerPoint Document');
    expect(tagStore.get('citation_author')[0].content).toEqual('Doe, Jane');
    expect(tagStore.get('citation_date')[0].content).toEqual('1650-06-26');
    expect(tagStore.get('citation_issn')[0].content).toEqual('123456789');
    expect(tagStore.get('citation_language')[0].content).toEqual('en');
    expect(tagStore.get('citation_keywords')[0].content).toEqual('keyword1; keyword2; keyword3');
  }));

  it('items page should set meta tags as published Thesis', fakeAsync(() => {
    spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(mockPublisher(mockType(ItemMock, 'Thesis'))));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.get('citation_dissertation_name')[0].content).toEqual('Test PowerPoint Document');
    expect(tagStore.get('citation_dissertation_institution')[0].content).toEqual('Mock Publisher');
    expect(tagStore.get('citation_abstract_html_url')[0].content).toEqual([environment.ui.baseUrl, router.url].join(''));
    expect(tagStore.get('citation_pdf_url')[0].content).toEqual('/bitstreams/99b00f3c-1cc6-4689-8158-91965bee6b28/download');
  }));

  it('items page should set meta tags as published Technical Report', fakeAsync(() => {
    spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(mockPublisher(mockType(ItemMock, 'Technical Report'))));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.get('citation_technical_report_institution')[0].content).toEqual('Mock Publisher');
  }));

  it('other navigation should add title, description and Generator', fakeAsync(() => {
    spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(ItemMock));
    spyOn(translateService, 'get').and.returnValues(of('DSpace :: '), of('Dummy Title'), of('This is a dummy item component for testing!'));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.size).toBeGreaterThan(0);
    router.navigate(['/other']);
    tick();
    expect(tagStore.size).toEqual(3);
    expect(title.getTitle()).toEqual('DSpace :: Dummy Title');
    expect(tagStore.get('title')[0].content).toEqual('DSpace :: Dummy Title');
    expect(tagStore.get('description')[0].content).toEqual('This is a dummy item component for testing!');
    expect(tagStore.get('Generator')[0].content).toEqual('mock-dspace-version');
  }));

  describe('when the item has no bitstreams', () => {

    beforeEach(() => {
      // this.bitstreamDataService.findAllByItemAndBundleName(this.item, 'ORIGINAL')
      // spyOn(MockItem, 'getFiles').and.returnValue(observableOf([]));
    });

    it('processRemoteData should not produce an EmptyError', fakeAsync(() => {
      spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(ItemMock));
      spyOn(metadataService, 'processRemoteData').and.callThrough();
      router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
      tick();
      expect(metadataService.processRemoteData).not.toThrow(new EmptyError());
    }));

  });

  const mockRemoteData = (mockItem: Item): Observable<RemoteData<Item>> => {
    return createSuccessfulRemoteDataObject$(ItemMock);
  };

  const mockType = (mockItem: Item, type: string): Item => {
    const typedMockItem = Object.assign(new Item(), mockItem) as Item;
    typedMockItem.metadata['dc.type'] = [{ value: type }] as MetadataValue[];
    return typedMockItem;
  };

  const mockPublisher = (mockItem: Item): Item => {
    const publishedMockItem = Object.assign(new Item(), mockItem) as Item;
    publishedMockItem.metadata['dc.publisher'] = [
      {
        language: 'en_US',
        value: 'Mock Publisher'
      }
    ] as MetadataValue[];
    return publishedMockItem;
  };

});
