import { ComponentFixture, TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Location, CommonModule } from '@angular/common';
import { Component, DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By, Meta, MetaDefinition } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Store, StoreModule } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { MetadataService } from './metadata.service';

import { CoreState } from '../core.reducers';

import { GlobalConfig } from '../../../config/global-config.interface';
import { ENV_CONFIG, GLOBAL_CONFIG } from '../../../config';

import { ObjectCacheService } from '../cache/object-cache.service';
import { RequestService } from '../data/request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';

import { NormalizedItem } from '../cache/models/normalized-item.model';
import { Item } from '../../core/shared/item.model';

import { MockRouter } from '../../shared/mocks/mock-router';
import { MockNormalizedItem } from '../../shared/mocks/mock-normalized-item';
import { MockItem } from '../../shared/mocks/mock-item';

/* tslint:disable:max-classes-per-file */
@Component({
  template: `<router-outlet></router-outlet>`
})
class TestComponent {
  constructor(private metadata: MetadataService) {
    metadata.listenForRouteChange();
  }
}

@Component({ template: '' }) class DummyItemComponent { }
/* tslint:enable:max-classes-per-file */

describe('MetadataService', () => {
  let metadataService: MetadataService;

  let meta: Meta;

  let store: Store<CoreState>;

  let objectCacheService: ObjectCacheService;
  let responseCacheService: ResponseCacheService;
  let requestService: RequestService;
  let remoteDataBuildService: RemoteDataBuildService;

  let location: Location;
  let router: Router;
  let fixture: ComponentFixture<TestComponent>;

  let tagStore: Map<string, MetaDefinition[]>;

  let envConfig: GlobalConfig;

  beforeEach(() => {

    store = new Store<CoreState>(undefined, undefined, undefined);
    spyOn(store, 'dispatch');

    objectCacheService = new ObjectCacheService(store);
    responseCacheService = new ResponseCacheService(store);
    requestService = new RequestService(objectCacheService, responseCacheService, store);
    remoteDataBuildService = new RemoteDataBuildService(objectCacheService, responseCacheService, requestService);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}),
        RouterTestingModule.withRoutes([
          { path: 'items/:id', component: DummyItemComponent, pathMatch: 'full', data: { type: NormalizedItem } },
          { path: 'other', component: DummyItemComponent, pathMatch: 'full', data: { title: 'Dummy Title', description: 'This is a dummy component for testing!' } }
        ])
      ],
      declarations: [
        TestComponent,
        DummyItemComponent
      ],
      providers: [
        { provide: ObjectCacheService, useValue: objectCacheService },
        { provide: ResponseCacheService, useValue: responseCacheService },
        { provide: RequestService, useValue: requestService },
        { provide: RemoteDataBuildService, useValue: remoteDataBuildService },
        { provide: GLOBAL_CONFIG, useValue: ENV_CONFIG },
        Meta,
        MetadataService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    meta = TestBed.get(Meta);
    metadataService = TestBed.get(MetadataService);

    envConfig = TestBed.get(GLOBAL_CONFIG);

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(TestComponent);

    tagStore = metadataService.getTagStore();
  });

  beforeEach(() => {
    spyOn(objectCacheService, 'getByUUID').and.returnValue(Observable.create((observer) => {
      observer.next(MockNormalizedItem);
    }));
  });

  it('items page should set meta tags', fakeAsync(() => {
    spyOn(remoteDataBuildService, 'build').and.returnValue(MockItem);
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.get('citation_title')[0].content).toEqual('Test PowerPoint Document');
    expect(tagStore.get('citation_author')[0].content).toEqual('Doe, Jane');
    expect(tagStore.get('citation_date')[0].content).toEqual('1650-06-26T19:58:25Z');
    expect(tagStore.get('citation_issn')[0].content).toEqual('123456789');
    expect(tagStore.get('citation_language')[0].content).toEqual('en');
    expect(tagStore.get('citation_keywords')[0].content).toEqual('keyword1; keyword2; keyword3');
  }));

  it('items page should set meta tags as published Thesis', fakeAsync(() => {
    spyOn(remoteDataBuildService, 'build').and.returnValue(mockPublisher(mockType(MockItem, 'Thesis')));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.get('citation_dissertation_name')[0].content).toEqual('Test PowerPoint Document');
    expect(tagStore.get('citation_dissertation_institution')[0].content).toEqual('Mock Publisher');
    expect(tagStore.get('citation_abstract_html_url')[0].content).toEqual([envConfig.ui.baseUrl, router.url].join(''));
    expect(tagStore.get('citation_pdf_url')[0].content).toEqual('https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/99b00f3c-1cc6-4689-8158-91965bee6b28/content');
  }));

  it('items page should set meta tags as published Technical Report', fakeAsync(() => {
    spyOn(remoteDataBuildService, 'build').and.returnValue(mockPublisher(mockType(MockItem, 'Technical Report')));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.get('citation_technical_report_institution')[0].content).toEqual('Mock Publisher');
  }));

  it('other navigation should title and description', fakeAsync(() => {
    spyOn(remoteDataBuildService, 'build').and.returnValue(MockItem);
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    expect(tagStore.size).toBeGreaterThan(0)
    router.navigate(['/other']);
    tick();
    expect(tagStore.size).toEqual(2);
    expect(tagStore.get('title')[0].content).toEqual('Dummy Title');
    expect(tagStore.get('description')[0].content).toEqual('This is a dummy component for testing!');
  }));

  const mockType = (mockItem: Item, type: string): Item => {
    const typedMockItem = Object.assign(new Item(), mockItem) as Item;
    for (const metadatum of typedMockItem.metadata) {
      if (metadatum.key === 'dc.type') {
        metadatum.value = type;
        break;
      }
    }
    return typedMockItem;
  }

  const mockPublisher = (mockItem: Item): Item => {
    const publishedMockItem = Object.assign(new Item(), mockItem) as Item;
    publishedMockItem.metadata.push({
      key: 'dc.publisher',
      language: 'en_US',
      value: 'Mock Publisher'
    });
    return publishedMockItem;
  }

});
