import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ItemDataService } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { getMockRequestService } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { Collection } from '@dspace/core';
import { Item } from '@dspace/core';
import { SearchService } from '@dspace/core';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core';
import { NotificationsServiceStub } from '@dspace/core';
import { RouterStub } from '@dspace/core';
import { createPaginatedList } from '@dspace/core';
import { AuthorizedCollectionSelectorComponent } from '../../../shared/dso-selector/dso-selector/authorized-collection-selector/authorized-collection-selector.component';
import { ItemMoveComponent } from './item-move.component';

describe('ItemMoveComponent', () => {
  let comp: ItemMoveComponent;
  let fixture: ComponentFixture<ItemMoveComponent>;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
  });

  const itemPageUrl = `fake-url/${mockItem.id}`;
  const routerStub = Object.assign(new RouterStub(), {
    url: `${itemPageUrl}/edit`,
  });

  const collection1 = Object.assign(new Collection(), {
    uuid: 'collection-uuid-1',
    name: 'Test collection 1',
  });

  const collection2 = Object.assign(new Collection(), {
    uuid: 'collection-uuid-2',
    name: 'Test collection 2',
  });

  let itemDataService;

  const mockItemDataServiceSuccess = jasmine.createSpyObj({
    moveToCollection: createSuccessfulRemoteDataObject$(collection1),
    findById: createSuccessfulRemoteDataObject$(mockItem),
  });

  const mockItemDataServiceFail = jasmine.createSpyObj({
    moveToCollection: createFailedRemoteDataObject$('Internal server error', 500),
    findById: createSuccessfulRemoteDataObject$(mockItem),
  });

  const routeStub = {
    data: observableOf({
      dso: createSuccessfulRemoteDataObject(Object.assign(new Item(), {
        id: 'item1',
        owningCollection: createSuccessfulRemoteDataObject$(Object.assign(new Collection(), {
          id: 'originalOwningCollection',
        })),
      })),
    }),
  };

  const mockSearchService = {
    search: () => {
      return createSuccessfulRemoteDataObject$(createPaginatedList([
        {
          indexableObject: collection1,
          hitHighlights: {},
        }, {
          indexableObject: collection2,
          hitHighlights: {},
        },
      ]));
    },
  };

  const notificationsServiceStub = new NotificationsServiceStub();

  const init = (mockItemDataService) => {
    itemDataService = mockItemDataService;

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, ItemMoveComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: ItemDataService, useValue: mockItemDataService },
        { provide: NotificationsService, useValue: notificationsServiceStub },
        { provide: SearchService, useValue: mockSearchService },
        { provide: RequestService, useValue: getMockRequestService() },
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
    })
      .overrideComponent(ItemMoveComponent, {
        remove: {
          imports: [AuthorizedCollectionSelectorComponent],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(ItemMoveComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('ItemMoveComponent success', () => {
    beforeEach(() => {
      init(mockItemDataServiceSuccess);
    });

    it('should get current url ', () => {
      expect(comp.getCurrentUrl()).toEqual('fake-url/fake-id/edit');
    });
    it('should select the correct collection name and id on click', () => {
      const data = collection1;

      comp.selectDso(data);

      expect(comp.selectedCollectionName).toEqual('Test collection 1');
      expect(comp.selectedCollection).toEqual(collection1);
    });
    describe('moveCollection', () => {
      it('should call itemDataService.moveToCollection', () => {
        comp.item = Object.assign(new Item(), {
          id: 'item-id',
          uuid: 'item-id',
        });
        comp.selectedCollectionName = 'selected-collection-id';
        comp.selectedCollection = collection1;
        comp.inheritPolicies = false;
        comp.moveToCollection();

        expect(itemDataService.moveToCollection).toHaveBeenCalledWith('item-id', collection1, false);
      });
      it('should call notificationsService success message on success', () => {
        comp.moveToCollection();

        expect(notificationsServiceStub.success).toHaveBeenCalled();
      });
    });
  });

  describe('ItemMoveComponent fail', () => {
    beforeEach(() => {
      init(mockItemDataServiceFail);
    });

    it('should call notificationsService error message on fail', () => {
      comp.moveToCollection();

      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  });
});
