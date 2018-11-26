import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Item} from '../../../core/shared/item.model';
import {RouterStub} from '../../../shared/testing/router-stub';
import {CommonModule} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule} from '@ngx-translate/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {ItemMoveComponent} from './item-move.component';
import {NotificationsServiceStub} from '../../../shared/testing/notifications-service-stub';
import {NotificationsService} from '../../../shared/notifications/notifications.service';
import {SearchService} from '../../../+search-page/search-service/search.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ItemDataService} from '../../../core/data/item-data.service';
import {RestResponse} from '../../../core/cache/response-cache.models';
import {RemoteData} from '../../../core/data/remote-data';
import {PaginatedList} from '../../../core/data/paginated-list';

let comp: ItemMoveComponent;
let fixture: ComponentFixture<ItemMoveComponent>;

const mockItem = Object.assign(new Item(), {
  id: 'fake-id',
  handle: 'fake/handle',
  lastModified: '2018'
});

const itemPageUrl = `fake-url/${mockItem.id}`;
const routerStub = Object.assign(new RouterStub(), {
  url: `${itemPageUrl}/edit`
});

const mockItemDataService = jasmine.createSpyObj({
  moveToCollection: Observable.of(new RestResponse(true, '200'))
});

const mockItemDataServiceFail = jasmine.createSpyObj({
  moveToCollection: Observable.of(new RestResponse(false, '500'))
});

const routeStub = {
  data: Observable.of({
    item: new RemoteData(false, false, true, null, {
      id: 'item1'
    })
  })
};

const mockSearchService = {
  search: () => {
    return Observable.of(new RemoteData(false, false, true, null,
      new PaginatedList(null, [
        {
          dspaceObject: {
            name: 'Test collection 1',
            uuid: 'collection1'
          }, hitHighlights: {}
        }, {
          dspaceObject: {
            name: 'Test collection 2',
            uuid: 'collection2'
          }, hitHighlights: {}
        }
      ])));
  }
};

const notificationsServiceStub = new NotificationsServiceStub();

describe('ItemMoveComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [ItemMoveComponent],
      providers: [
        {provide: ActivatedRoute, useValue: routeStub},
        {provide: Router, useValue: routerStub},
        {provide: ItemDataService, useValue: mockItemDataService},
        {provide: NotificationsService, useValue: notificationsServiceStub},
        {provide: SearchService, useValue: mockSearchService},
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMoveComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should load suggestions', () => {
    const expected = [
      {
        displayValue: 'Test collection 1',
        value: {
          name: 'Test collection 1',
          id: 'collection1',
        }
      },
      {
        displayValue: 'Test collection 2',
        value: {
          name: 'Test collection 2',
          id: 'collection2',
        }
      }
    ];

    comp.CollectionSearchResults.subscribe((value) => {
        expect(value).toEqual(expected);
      }
    );
  });
  it('should get current url ', () => {
    expect(comp.getCurrentUrl()).toEqual('fake-url/fake-id/edit');
  });
  it('should on click select the correct collection name and id', () => {
    const data = {
      name: 'Test collection 1',
      id: 'collection1',
    };
    comp.onClick(data);

    expect(comp.selectedCollection).toEqual('Test collection 1');
    expect(comp.selectedCollectionId).toEqual('collection1');
  });
  describe('moveCollection', () => {
    it('should call itemDataService.moveToCollection', () => {
      comp.itemId = 'item-id';
      comp.selectedCollectionId = 'selected-collection-id';
      comp.moveCollection();

      expect(mockItemDataService.moveToCollection).toHaveBeenCalledWith('item-id', 'selected-collection-id');
    });
    it('should call notificationsService success message on success', () => {
      spyOn(notificationsServiceStub, 'success');

      comp.moveCollection();

      expect(notificationsServiceStub.success).toHaveBeenCalled();
    });
  });
});

describe('ItemMoveComponent fail', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [ItemMoveComponent],
      providers: [
        {provide: ActivatedRoute, useValue: routeStub},
        {provide: Router, useValue: routerStub},
        {provide: ItemDataService, useValue: mockItemDataServiceFail},
        {provide: NotificationsService, useValue: notificationsServiceStub},
        {provide: SearchService, useValue: mockSearchService},
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemMoveComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call notificationsService error message on fail', () => {
    spyOn(notificationsServiceStub, 'error');

    comp.moveCollection();

    expect(notificationsServiceStub.error).toHaveBeenCalled();
  });
});
