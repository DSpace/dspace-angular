import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule, Location } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { Store, StoreModule } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { UUIDService } from '../shared/uuid.service';

import { MetadataService } from './metadata.service';

import { CoreState } from '../core.reducers';

import { GlobalConfig } from '../../../config/global-config.interface';
import { ENV_CONFIG, GLOBAL_CONFIG } from '../../../config';

import { ItemDataService } from '../data/item-data.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from '../data/request.service';

import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';

import { MockItem } from '../../shared/mocks/mock-item';
import { MockTranslateLoader } from '../../shared/mocks/mock-translate-loader';
import { BrowseService } from '../browse/browse.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { AuthService } from '../auth/auth.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { EmptyError } from 'rxjs/internal-compatibility';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { MetadataValue } from '../shared/metadata.models';

/* tslint:disable:max-classes-per-file */
@Component({
  template: `<router-outlet></router-outlet>`
})
class TestComponent {
  constructor(private metadata: MetadataService) {
    metadata.listenForRouteChange();
  }
}

@Component({ template: '' }) class DummyItemComponent {
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

  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<TestComponent>;

  let tagStore: Map<string, MetaDefinition[]>;

  let envConfig: GlobalConfig;

  beforeEach(() => {

    store = new Store<CoreState>(undefined, undefined, undefined);
    spyOn(store, 'dispatch');

    objectCacheService = new ObjectCacheService(store);
    uuidService = new UUIDService();
    requestService = new RequestService(objectCacheService, uuidService, store, undefined);
    remoteDataBuildService = new RemoteDataBuildService(objectCacheService, requestService);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
        RouterTestingModule.withRoutes([
          { path: 'items/:id', component: DummyItemComponent, pathMatch: 'full' },
          { path: 'other', component: DummyItemComponent, pathMatch: 'full', data: { title: 'Dummy Title', description: 'This is a dummy item component for testing!' } }
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
        { provide: GLOBAL_CONFIG, useValue: ENV_CONFIG },
        { provide: HALEndpointService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: NormalizedObjectBuildService, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        Meta,
        Title,
        ItemDataService,
        BrowseService,
        MetadataService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    meta = TestBed.get(Meta);
    title = TestBed.get(Title);
    itemDataService = TestBed.get(ItemDataService);
    metadataService = TestBed.get(MetadataService);
    authService = TestBed.get(AuthService);

    envConfig = TestBed.get(GLOBAL_CONFIG);

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(TestComponent);

    tagStore = metadataService.getTagStore();
  });

  it('items page should set meta tags', fakeAsync(() => {
    spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(MockItem));
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
    spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(mockPublisher(mockType(MockItem, 'Thesis'))));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.get('citation_dissertation_name')[0].content).toEqual('Test PowerPoint Document');
    expect(tagStore.get('citation_dissertation_institution')[0].content).toEqual('Mock Publisher');
    expect(tagStore.get('citation_abstract_html_url')[0].content).toEqual([envConfig.ui.baseUrl, router.url].join(''));
    expect(tagStore.get('citation_pdf_url')[0].content).toEqual('https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/99b00f3c-1cc6-4689-8158-91965bee6b28/content');
  }));

  it('items page should set meta tags as published Technical Report', fakeAsync(() => {
    spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(mockPublisher(mockType(MockItem, 'Technical Report'))));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.get('citation_technical_report_institution')[0].content).toEqual('Mock Publisher');
  }));

  it('other navigation should title and description', fakeAsync(() => {
    spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(MockItem));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.size).toBeGreaterThan(0);
    router.navigate(['/other']);
    tick();
    expect(tagStore.size).toEqual(2);
    expect(title.getTitle()).toEqual('Dummy Title');
    expect(tagStore.get('title')[0].content).toEqual('Dummy Title');
    expect(tagStore.get('description')[0].content).toEqual('This is a dummy item component for testing!');
  }));

  describe('when the item has no bitstreams', () => {

    beforeEach(() => {
      spyOn(MockItem, 'getFiles').and.returnValue(observableOf([]));
    });

    it('processRemoteData should not produce an EmptyError', fakeAsync(() => {
      spyOn(itemDataService, 'findById').and.returnValue(mockRemoteData(MockItem));
      spyOn(metadataService, 'processRemoteData').and.callThrough();
      router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
      tick();
      expect(metadataService.processRemoteData).not.toThrow(new EmptyError());
    }));

  });

  const mockRemoteData = (mockItem: Item): Observable<RemoteData<Item>> => {
    return observableOf(new RemoteData<Item>(
      false,
      false,
      true,
      undefined,
      MockItem
    ));
  };

  const mockType = (mockItem: Item, type: string): Item => {
    const typedMockItem = Object.assign(new Item(), mockItem) as Item;
    typedMockItem.metadata['dc.type'] = [ { value: type } ] as MetadataValue[];
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
  }

});
