import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { RestResponse } from '../../../core/cache/response.models';
import { ItemDataService } from '../../../core/data/item-data.service';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';
import { Item } from '../../../core/shared/item.model';
import { SearchService } from '../../../core/shared/search/search.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { ItemMoveComponent } from './item-move.component';

describe('ItemMoveComponent', () => {
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
    moveToCollection: observableOf(new RestResponse(true, 200, 'Success'))
  });

  const mockItemDataServiceFail = jasmine.createSpyObj({
    moveToCollection: observableOf(new RestResponse(false, 500, 'Internal server error'))
  });

  const routeStub = {
    data: observableOf({
      item: new RemoteData(false, false, true, null, {
        id: 'item1'
      })
    })
  };

  const collection1 = Object.assign(new Collection(), {
    uuid: 'collection-uuid-1',
    name: 'Test collection 1'
  });

  const collection2 = Object.assign(new Collection(), {
    uuid: 'collection-uuid-2',
    name: 'Test collection 2'
  });

  const mockSearchService = {
    search: () => {
      return observableOf(new RemoteData(false, false, true, null,
        new PaginatedList(null, [
          {
            indexableObject: collection1,
            hitHighlights: {}
          }, {
            indexableObject: collection2,
            hitHighlights: {}
          }
        ])));
    }
  };

  const notificationsServiceStub = new NotificationsServiceStub();

  describe('ItemMoveComponent success', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule],
        declarations: [ItemMoveComponent],
        providers: [
          { provide: ActivatedRoute, useValue: routeStub },
          { provide: Router, useValue: routerStub },
          { provide: ItemDataService, useValue: mockItemDataService },
          { provide: NotificationsService, useValue: notificationsServiceStub },
          { provide: SearchService, useValue: mockSearchService },
        ], schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(ItemMoveComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });
    it('should load suggestions', () => {
      const expected = [
        collection1,
        collection2
      ];

      comp.collectionSearchResults.subscribe((value) => {
          expect(value).toEqual(expected);
        }
      );
    });
    it('should get current url ', () => {
      expect(comp.getCurrentUrl()).toEqual('fake-url/fake-id/edit');
    });
    it('should on click select the correct collection name and id', () => {
      const data = collection1;

      comp.onClick(data);

      expect(comp.selectedCollectionName).toEqual('Test collection 1');
      expect(comp.selectedCollection).toEqual(collection1);
    });
    describe('moveCollection', () => {
      it('should call itemDataService.moveToCollection', () => {
        comp.itemId = 'item-id';
        comp.selectedCollectionName = 'selected-collection-id';
        comp.selectedCollection = collection1;
        comp.moveCollection();

        expect(mockItemDataService.moveToCollection).toHaveBeenCalledWith('item-id', collection1);
      });
      it('should call notificationsService success message on success', () => {
        comp.moveCollection();

        expect(notificationsServiceStub.success).toHaveBeenCalled();
      });
    });
  });

  describe('ItemMoveComponent fail', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule],
        declarations: [ItemMoveComponent],
        providers: [
          { provide: ActivatedRoute, useValue: routeStub },
          { provide: Router, useValue: routerStub },
          { provide: ItemDataService, useValue: mockItemDataServiceFail },
          { provide: NotificationsService, useValue: notificationsServiceStub },
          { provide: SearchService, useValue: mockSearchService },
        ], schemas: [
          CUSTOM_ELEMENTS_SCHEMA
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(ItemMoveComponent);
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should call notificationsService error message on fail', () => {
      comp.moveCollection();

      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  });
});
