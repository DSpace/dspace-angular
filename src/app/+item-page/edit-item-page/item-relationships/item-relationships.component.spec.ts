import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { GLOBAL_CONFIG } from '../../../../config';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { RestResponse } from '../../../core/cache/response.models';
import { EntityTypeService } from '../../../core/data/entity-type.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { FieldChangeType } from '../../../core/data/object-updates/object-updates.actions';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { PaginatedList } from '../../../core/data/paginated-list';
import { RelationshipService } from '../../../core/data/relationship.service';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { RelationshipType } from '../../../core/shared/item-relationships/relationship-type.model';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { Item } from '../../../core/shared/item.model';
import { PageInfo } from '../../../core/shared/page-info.model';
import { NotificationType } from '../../../shared/notifications/models/notification-type';
import {
  INotification,
  Notification
} from '../../../shared/notifications/models/notification.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { SharedModule } from '../../../shared/shared.module';
import { RouterStub } from '../../../shared/testing/router-stub';
import { ItemRelationshipsComponent } from './item-relationships.component';

let comp: any;
let fixture: ComponentFixture<ItemRelationshipsComponent>;
let de: DebugElement;
let el: HTMLElement;
let objectUpdatesService;
let relationshipService;
let requestService;
let entityTypeService;
let objectCache;
const infoNotification: INotification = new Notification('id', NotificationType.Info, 'info');
const warningNotification: INotification = new Notification('id', NotificationType.Warning, 'warning');
const successNotification: INotification = new Notification('id', NotificationType.Success, 'success');
const notificationsService = jasmine.createSpyObj('notificationsService',
  {
    info: infoNotification,
    warning: warningNotification,
    success: successNotification
  }
);
const router = new RouterStub();
let routeStub;
let itemService;

const url = 'http://test-url.com/test-url';
router.url = url;

let scheduler: TestScheduler;
let item;
let author1;
let author2;
let fieldUpdate1;
let fieldUpdate2;
let entityType;
let relationships;
let relationshipType;

describe('ItemRelationshipsComponent', () => {
  beforeEach(async(() => {
    const date = new Date();

    relationshipType = Object.assign(new RelationshipType(), {
      id: '1',
      uuid: '1',
      leftwardType: 'isAuthorOfPublication',
      rightwardType: 'isPublicationOfAuthor'
    });

    relationships = [
      Object.assign(new Relationship(), {
        _links: {
          self: { href: url + '/2' }
        },
        id: '2',
        uuid: '2',
        relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
      }),
      Object.assign(new Relationship(), {
        _links: {
          self: { href: url + '/3' }
        },
        id: '3',
        uuid: '3',
        relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
      })
    ];

    item = Object.assign(new Item(), {
      _links: {
        self: { href: 'fake-item-url/publication' }
      },
      id: 'publication',
      uuid: 'publication',
      relationships: observableOf(new RemoteData(false, false, true, undefined, new PaginatedList(new PageInfo(), relationships))),
      lastModified: date
    });

    entityType = Object.assign(new ItemType(), {
      id: 'entityType',
    });

    author1 = Object.assign(new Item(), {
      id: 'author1',
      uuid: 'author1'
    });
    author2 = Object.assign(new Item(), {
      id: 'author2',
      uuid: 'author2'
    });

    relationships[0].leftItem = observableOf(new RemoteData(false, false, true, undefined, author1));
    relationships[0].rightItem = observableOf(new RemoteData(false, false, true, undefined, item));
    relationships[1].leftItem = observableOf(new RemoteData(false, false, true, undefined, author2));
    relationships[1].rightItem = observableOf(new RemoteData(false, false, true, undefined, item));

    fieldUpdate1 = {
      field: relationships[0],
      changeType: undefined
    };
    fieldUpdate2 = {
      field: Object.assign(
        relationships[1],
        {keepLeftVirtualMetadata: true, keepRightVirtualMetadata: false}
      ),
      changeType: FieldChangeType.REMOVE
    };

    itemService = jasmine.createSpyObj('itemService', {
      findById: observableOf(new RemoteData(false, false, true, undefined, item))
    });
    routeStub = {
      parent: {
        data: observableOf({ item: new RemoteData(false, false, true, null, item) })
      }
    };

    objectUpdatesService = jasmine.createSpyObj('objectUpdatesService',
      {
        getFieldUpdates: observableOf({
          [relationships[0].uuid]: fieldUpdate1,
          [relationships[1].uuid]: fieldUpdate2
        }),
        getFieldUpdatesExclusive: observableOf({
          [relationships[0].uuid]: fieldUpdate1,
          [relationships[1].uuid]: fieldUpdate2
        }),
        saveAddFieldUpdate: {},
        discardFieldUpdates: {},
        reinstateFieldUpdates: observableOf(true),
        initialize: {},
        getUpdatedFields: observableOf([author1, author2]),
        getLastModified: observableOf(date),
        hasUpdates: observableOf(true),
        isReinstatable: observableOf(false), // should always return something --> its in ngOnInit
        isValidPage: observableOf(true)
      }
    );

    relationshipService = jasmine.createSpyObj('relationshipService',
      {
        getItemRelationshipLabels: observableOf(['isAuthorOfPublication']),
        getRelatedItems: observableOf([author1, author2]),
        getRelatedItemsByLabel: observableOf([author1, author2]),
        getItemRelationshipsArray: observableOf(relationships),
        deleteRelationship: observableOf(new RestResponse(true, 200, 'OK')),
        getItemResolvedRelatedItemsAndRelationships: observableCombineLatest(observableOf([author1, author2]), observableOf([item, item]), observableOf(relationships)),
        getRelationshipsByRelatedItemIds: observableOf(relationships),
        getRelationshipTypeLabelsByItem: observableOf([relationshipType.leftwardType])
      }
    );

    requestService = jasmine.createSpyObj('requestService',
      {
        removeByHrefSubstring: {},
        hasByHrefObservable: observableOf(false)
      }
    );

    objectCache = jasmine.createSpyObj('objectCache', {
      remove: undefined
    });

    entityTypeService = jasmine.createSpyObj('entityTypeService',
      {
        getEntityTypeByLabel: observableOf(new RemoteData(
          false,
          false,
          true,
          null,
          entityType,
        )),
        getEntityTypeRelationships: observableOf(new RemoteData(
          false,
          false,
          true,
          null,
          new PaginatedList(new PageInfo(), [relationshipType]),
        )),
      }
    );

    scheduler = getTestScheduler();
    TestBed.configureTestingModule({
      imports: [SharedModule, TranslateModule.forRoot()],
      declarations: [ItemRelationshipsComponent],
      providers: [
        { provide: ItemDataService, useValue: itemService },
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: GLOBAL_CONFIG, useValue: { item: { edit: { undoTimeout: 10 } } } as any },
        { provide: RelationshipService, useValue: relationshipService },
        { provide: EntityTypeService, useValue: entityTypeService },
        { provide: ObjectCacheService, useValue: objectCache },
        { provide: RequestService, useValue: requestService },
        ChangeDetectorRef
      ], schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRelationshipsComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    comp.url = url;
    fixture.detectChanges();
  });

  describe('discard', () => {
    beforeEach(() => {
      comp.discard();
    });

    it('it should call discardFieldUpdates on the objectUpdatesService with the correct url and notification', () => {
      expect(objectUpdatesService.discardFieldUpdates).toHaveBeenCalledWith(url, infoNotification);
    });
  });

  describe('reinstate', () => {
    beforeEach(() => {
      comp.reinstate();
    });

    it('it should call reinstateFieldUpdates on the objectUpdatesService with the correct url', () => {
      expect(objectUpdatesService.reinstateFieldUpdates).toHaveBeenCalledWith(url);
    });
  });

  describe('submit', () => {
    beforeEach(() => {
      comp.submit();
    });

    it('it should delete the correct relationship', () => {
      expect(relationshipService.deleteRelationship).toHaveBeenCalledWith(relationships[1].uuid, 'left');
    });
  });
});
