import { CollectionItemMapperComponent } from './collection-item-mapper.component';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SearchFormComponent } from '../../shared/search-form/search-form.component';
import { SearchPageModule } from '../../+search-page/search-page.module';
import { ObjectCollectionComponent } from '../../shared/object-collection/object-collection.component';
import { ItemSelectComponent } from '../../shared/item-select/item-select.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { RouterStub } from '../../shared/testing/router-stub';
import { SearchConfigurationService } from '../../+search-page/search-service/search-configuration.service';
import { SearchService } from '../../+search-page/search-service/search.service';
import { SearchServiceStub } from '../../shared/testing/search-service-stub';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service-stub';
import { ItemDataService } from '../../core/data/item-data.service';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { Collection } from '../../core/shared/collection.model';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { PaginatedSearchOptions } from '../../+search-page/paginated-search-options.model';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { EventEmitter } from '@angular/core';
import { HostWindowService } from '../../shared/host-window.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service-stub';
import { By } from '@angular/platform-browser';
import { RestResponse } from '../../core/cache/response-cache.models';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';

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
    name: 'test-collection'
  });
  const mockCollectionRD: RemoteData<Collection> = new RemoteData<Collection>(false, false, true, null, mockCollection);
  const mockSearchOptions = Observable.of(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      id: 'search-page-configuration',
      pageSize: 10,
      currentPage: 1
    }),
    sort: new SortOptions('dc.title', SortDirection.ASC),
    scope: mockCollection.id
  }));
  const routerStub = Object.assign(new RouterStub(), {
    url: 'http://test.url'
  });
  const searchConfigServiceStub = {
    paginatedSearchOptions: mockSearchOptions
  };
  const itemDataServiceStub = {
    mapToCollection: () => Observable.of(new RestResponse(true, '200'))
  };
  const activatedRouteStub = new ActivatedRouteStub({}, { collection: mockCollectionRD });
  const translateServiceStub = {
    get: () => Observable.of('test-message of collection ' + mockCollection.name),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };
  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: () => Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), [])))
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, SharedModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [CollectionItemMapperComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: SearchConfigurationService, useValue: searchConfigServiceStub },
        { provide: SearchService, useValue: searchServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ItemDataService, useValue: itemDataServiceStub },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) }
      ]
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

    beforeEach(() => {
      spyOn(notificationsService, 'success').and.callThrough();
      spyOn(notificationsService, 'error').and.callThrough();
    });

    it('should display a success message if at least one mapping was successful', () => {
      comp.mapItems(ids);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(notificationsService.error).not.toHaveBeenCalled();
    });

    it('should display an error message if at least one mapping was unsuccessful', () => {
      spyOn(itemDataService, 'mapToCollection').and.returnValue(Observable.of(new RestResponse(false, '404')));
      comp.mapItems(ids);
      expect(notificationsService.success).not.toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
    });
  });

});
