import { ComponentFixture, TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Location, CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
          { path: 'other', component: DummyItemComponent, pathMatch: 'full' }
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

    router = TestBed.get(Router);
    location = TestBed.get(Location);

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
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
    const tagStore: Map<string, MetaDefinition[]> = metadataService.getTagStore();
    expect(tagStore.get('citation_title').length).toEqual(1);
    expect(tagStore.get('citation_title')[0].content).toEqual('Test PowerPoint Document');
  }));

  it('items page should set meta tags as published Thesis', fakeAsync(() => {
    spyOn(remoteDataBuildService, 'build').and.returnValue(mockPublisher(mockType(MockItem, 'Thesis')));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    const tagStore: Map<string, MetaDefinition[]> = metadataService.getTagStore();
    expect(tagStore.get('citation_dissertation_name').length).toEqual(1);
    expect(tagStore.get('citation_dissertation_name')[0].content).toEqual('Test PowerPoint Document');
    expect(tagStore.get('citation_dissertation_institution').length).toEqual(1);
    expect(tagStore.get('citation_dissertation_institution')[0].content).toEqual('Mock Publisher');
  }));

  it('items page should set meta tags as published Technical Report', fakeAsync(() => {
    spyOn(remoteDataBuildService, 'build').and.returnValue(mockPublisher(mockType(MockItem, 'Technical Report')));
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
    tick();
    const tagStore: Map<string, MetaDefinition[]> = metadataService.getTagStore();
    expect(tagStore.get('citation_technical_report_institution').length).toEqual(1);
    expect(tagStore.get('citation_technical_report_institution')[0].content).toEqual('Mock Publisher');
  }));

  it('other navigation should clear meta tags', fakeAsync(() => {
    router.navigate(['/other']);
    tick();
    const tagStore: Map<string, MetaDefinition[]> = metadataService.getTagStore();
    expect(tagStore.size).toEqual(0);
  }));

  const mockType = (mockItem: Item, type: string): Item => {
    const typedMockItem = Object.assign({}, mockItem) as Item;
    for (const metadatum of typedMockItem.metadata) {
      if (metadatum.key === 'dc.type') {
        metadatum.value = type;
        break;
      }
    }
    return typedMockItem;
  }

  const mockPublisher = (mockItem: Item): Item => {
    const publishedMockItem = Object.assign({}, mockItem) as Item;
    publishedMockItem.metadata.push({
      key: 'dc.publisher',
      language: 'en_US',
      value: 'Mock Publisher'
    });
    return publishedMockItem;
  }

});
