import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ItemCollectionMapperComponent } from './item-collection-mapper.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchConfigurationService } from '../../../+search-page/search-service/search-configuration.service';
import { SearchService } from '../../../+search-page/search-service/search.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedSearchOptions } from '../../../+search-page/paginated-search-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { RouterStub } from '../../../shared/testing/router-stub';
import { ActivatedRouteStub } from '../../../shared/testing/active-router-stub';
import { EventEmitter } from '@angular/core';
import { SearchServiceStub } from '../../../shared/testing/search-service-stub';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service-stub';
import { HostWindowService } from '../../../shared/host-window.service';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service-stub';
import { By } from '@angular/platform-browser';
import { Item } from '../../../core/shared/item.model';
import { ObjectSelectService } from '../../../shared/object-select/object-select.service';
import { ObjectSelectServiceStub } from '../../../shared/testing/object-select-service-stub';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { RestResponse } from '../../../core/cache/response.models';
import { CollectionSelectComponent } from '../../../shared/object-select/collection-select/collection-select.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { EnumKeysPipe } from '../../../shared/utils/enum-keys-pipe';
import { VarDirective } from '../../../shared/utils/var.directive';
import { SearchFormComponent } from '../../../shared/search-form/search-form.component';
import { Collection } from '../../../core/shared/collection.model';
import { ErrorComponent } from '../../../shared/error/error.component';
import { LoadingComponent } from '../../../shared/loading/loading.component';

describe('ItemCollectionMapperComponent', () => {
  let comp: ItemCollectionMapperComponent;
  let fixture: ComponentFixture<ItemCollectionMapperComponent>;

  let route: ActivatedRoute;
  let router: Router;
  let searchConfigService: SearchConfigurationService;
  let searchService: SearchService;
  let notificationsService: NotificationsService;
  let itemDataService: ItemDataService;

  const mockCollection = Object.assign(new Collection(), { id: 'collection1' });
  const mockItem: Item = Object.assign(new Item(), {
    id: '932c7d50-d85a-44cb-b9dc-b427b12877bd',
    name: 'test-item'
  });
  const mockItemRD: RemoteData<Item> = new RemoteData<Item>(false, false, true, null, mockItem);
  const mockSearchOptions = of(new PaginatedSearchOptions({
    pagination: Object.assign(new PaginationComponentOptions(), {
      id: 'search-page-configuration',
      pageSize: 10,
      currentPage: 1
    }),
    sort: new SortOptions('dc.title', SortDirection.ASC)
  }));
  const url = 'http://test.url';
  const urlWithParam = url + '?param=value';
  const routerStub = Object.assign(new RouterStub(), {
    url: urlWithParam,
    navigateByUrl: {},
    navigate: {}
  });
  const searchConfigServiceStub = {
    paginatedSearchOptions: mockSearchOptions
  };
  const mockCollectionsRD = new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []));
  const itemDataServiceStub = {
    mapToCollection: () => of(new RestResponse(true, 200, 'OK')),
    removeMappingFromCollection: () => of(new RestResponse(true, 200, 'OK')),
    getMappedCollections: () => of(mockCollectionsRD),
    /* tslint:disable:no-empty */
    clearMappedCollectionsRequests: () => {}
    /* tslint:enable:no-empty */
  };
  const searchServiceStub = Object.assign(new SearchServiceStub(), {
    search: () => of(mockCollectionsRD),
    /* tslint:disable:no-empty */
    clearDiscoveryRequests: () => {}
    /* tslint:enable:no-empty */
  });
  const activatedRouteStub = new ActivatedRouteStub({}, { item: mockItemRD });
  const translateServiceStub = {
    get: () => of('test-message of item ' + mockItem.name),
    onLangChange: new EventEmitter(),
    onTranslationChange: new EventEmitter(),
    onDefaultLangChange: new EventEmitter()
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [ItemCollectionMapperComponent, CollectionSelectComponent, SearchFormComponent, PaginationComponent, EnumKeysPipe, VarDirective, ErrorComponent, LoadingComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: SearchConfigurationService, useValue: searchConfigServiceStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ItemDataService, useValue: itemDataServiceStub },
        { provide: SearchService, useValue: searchServiceStub },
        { provide: ObjectSelectService, useValue: new ObjectSelectServiceStub() },
        { provide: TranslateService, useValue: translateServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCollectionMapperComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    route = (comp as any).route;
    router = (comp as any).router;
    searchConfigService = (comp as any).searchConfigService;
    notificationsService = (comp as any).notificationsService;
    itemDataService = (comp as any).itemDataService;
    searchService = (comp as any).searchService;
  });

  it('should display the correct collection name', () => {
    const name: HTMLElement = fixture.debugElement.query(By.css('#item-name')).nativeElement;
    expect(name.innerHTML).toContain(mockItem.name);
  });

  describe('mapCollections', () => {
    const ids = ['id1', 'id2', 'id3', 'id4'];

    it('should display a success message if at least one mapping was successful', () => {
      comp.mapCollections(ids);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(notificationsService.error).not.toHaveBeenCalled();
    });

    it('should display an error message if at least one mapping was unsuccessful', () => {
      spyOn(itemDataService, 'mapToCollection').and.returnValue(of(new RestResponse(false, 404, 'Not Found')));
      comp.mapCollections(ids);
      expect(notificationsService.success).not.toHaveBeenCalled();
      expect(notificationsService.error).toHaveBeenCalled();
    });
  });

  describe('removeMappings', () => {
    const ids = ['id1', 'id2', 'id3', 'id4'];

    it('should display a success message if the removal of at least one mapping was successful', () => {
      comp.removeMappings(ids);
      expect(notificationsService.success).toHaveBeenCalled();
      expect(notificationsService.error).not.toHaveBeenCalled();
    });

    it('should display an error message if the removal of at least one mapping was unsuccessful', () => {
      spyOn(itemDataService, 'removeMappingFromCollection').and.returnValue(of(new RestResponse(false, 404, 'Not Found')));
      comp.removeMappings(ids);
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
    const expected = `${query} AND -search.resourceid:${mockCollection.id}`;

    let result;

    beforeEach(() => {
      result = comp.buildQuery([mockCollection], query);
    });

    it('should build a solr query to exclude the provided collection', () => {
      expect(result).toEqual(expected);
    })
  });

  describe('onCancel', () => {
    beforeEach(() => {
      spyOn(routerStub, 'navigate');
      comp.onCancel();
    });

    it('should navigate to the item page', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/items/', mockItem.id]);
    });
  });

});
