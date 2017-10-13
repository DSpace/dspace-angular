import { ComponentFixture, TestBed, async, fakeAsync, inject, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Location, CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By, Meta } from '@angular/platform-browser';
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
          { path: 'items/:id', component: DummyItemComponent, pathMatch: 'full', data: { type: NormalizedItem } }
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
    spyOn(remoteDataBuildService, 'build').and.returnValue(MockItem);
  });

  it('upon navigation should call meta tag setters', () => {
    router.navigate(['/items/0ec7ff22-f211-40ab-a69e-c819b0b1f357']);
  });

});
