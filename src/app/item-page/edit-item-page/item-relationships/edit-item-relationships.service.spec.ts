import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { EntityTypeDataService } from '../../../core/data/entity-type-data.service';
import { ItemDataService } from '../../../core/data/item-data.service';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import {
  DeleteRelationship,
  RelationshipIdentifiable,
} from '../../../core/data/object-updates/object-updates.reducer';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { RelationshipDataService } from '../../../core/data/relationship-data.service';
import { Item } from '../../../core/shared/item.model';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { Relationship } from '../../../core/shared/item-relationships/relationship.model';
import { RelationshipType } from '../../../core/shared/item-relationships/relationship-type.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { EntityTypeDataServiceStub } from '../../../shared/testing/entity-type-data.service.stub';
import { ItemDataServiceStub } from '../../../shared/testing/item-data.service.stub';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { ObjectUpdatesServiceStub } from '../../../shared/testing/object-updates.service.stub';
import { RelationshipDataServiceStub } from '../../../shared/testing/relationship-data.service.stub';
import { EditItemRelationshipsService } from './edit-item-relationships.service';

describe('EditItemRelationshipsService', () => {
  let service: EditItemRelationshipsService;

  let itemService: ItemDataServiceStub;
  let objectUpdatesService: ObjectUpdatesServiceStub;
  let notificationsService: NotificationsServiceStub;
  let relationshipService: RelationshipDataServiceStub;
  let entityTypeDataService: EntityTypeDataServiceStub;

  let currentItem: Item;

  let relationshipItem1: Item;
  let relationshipIdentifiable1: RelationshipIdentifiable;
  let relationship1: Relationship;

  let relationshipItem2: Item;
  let relationshipIdentifiable2: RelationshipIdentifiable;
  let relationship2: Relationship;

  let orgUnitType: ItemType;
  let orgUnitToOrgUnitType: RelationshipType;

  beforeEach(() => {
    itemService = new ItemDataServiceStub();
    objectUpdatesService = new ObjectUpdatesServiceStub();
    notificationsService = new NotificationsServiceStub();
    relationshipService = new RelationshipDataServiceStub();
    entityTypeDataService = new EntityTypeDataServiceStub();

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ItemDataService, useValue: itemService },
        { provide: ObjectUpdatesService, useValue: objectUpdatesService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: RelationshipDataService, useValue: relationshipService },
        { provide: EntityTypeDataService, useValue: entityTypeDataService },
      ],
    });
    service = TestBed.inject(EditItemRelationshipsService);
  });

  beforeEach(() => {
    currentItem = Object.assign(new Item(), {
      uuid: uuidv4(),
      metadata: {
        'dspace.entity.type': 'OrgUnit',
      },
      _links: {
        self: {
          href: 'selfLink1',
        },
      },
    });

    relationshipItem1 = Object.assign(new Item(), {
      uuid: uuidv4(),
      metadata: {
        'dspace.entity.type': 'OrgUnit',
      },
      _links: {
        self: {
          href: 'selfLink2',
        },
      },
    });
    relationshipIdentifiable1 = {
      originalItem: currentItem,
      relatedItem: relationshipItem1,
      type: orgUnitToOrgUnitType,
      uuid: `1-${relationshipItem1.uuid}`,
    } as RelationshipIdentifiable;
    relationship1 = Object.assign(new Relationship(), {
      _links: {
        leftItem: currentItem._links.self,
        rightItem: relationshipItem1._links.self,
      },
    });

    relationshipItem2 = Object.assign(new Item(), {
      uuid: uuidv4(),
      metadata: {
        'dspace.entity.type': 'OrgUnit',
      },
      _links: {
        self: {
          href: 'selfLink3',
        },
      },
    });
    relationshipIdentifiable2 = {
      originalItem: currentItem,
      relatedItem: relationshipItem2,
      type: orgUnitToOrgUnitType,
      uuid: `1-${relationshipItem2.uuid}`,
    } as RelationshipIdentifiable;
    relationship2 = Object.assign(new Relationship(), {
      _links: {
        leftItem: currentItem._links.self,
        rightItem: relationshipItem2._links.self,
      },
    });

    orgUnitType = Object.assign(new ItemType(), {
      id: '2',
      label: 'OrgUnit',
    });
    orgUnitToOrgUnitType = Object.assign(new RelationshipType(), {
      id: '1',
      leftMaxCardinality: null,
      leftMinCardinality: 0,
      leftType: createSuccessfulRemoteDataObject$(orgUnitType),
      leftwardType: 'isOrgUnitOfOrgUnit',
      rightMaxCardinality: null,
      rightMinCardinality: 0,
      rightType: createSuccessfulRemoteDataObject$(orgUnitType),
      rightwardType: 'isOrgUnitOfOrgUnit',
      uuid: 'relationshiptype-1',
    });
  });

  describe('submit', () => {
    let fieldUpdateAddRelationship1: FieldUpdate;
    let fieldUpdateRemoveRelationship2: FieldUpdate;

    beforeEach(() => {
      fieldUpdateAddRelationship1 = {
        changeType: FieldChangeType.ADD,
        field: relationshipIdentifiable1,
      };
      fieldUpdateRemoveRelationship2 = {
        changeType: FieldChangeType.REMOVE,
        field: relationshipIdentifiable2,
      };

      spyOn(service, 'addRelationship').withArgs(relationshipIdentifiable1).and.returnValue(createSuccessfulRemoteDataObject$(relationship1));
      spyOn(service, 'deleteRelationship').withArgs(relationshipIdentifiable2 as DeleteRelationship).and.returnValue(createSuccessfulRemoteDataObject$({}));
      spyOn(itemService, 'invalidateByHref').and.callThrough();
    });

    it('should support performing multiple relationships manipulations in one submit() call', () => {
      spyOn(objectUpdatesService, 'getFieldUpdates').and.returnValue(of({
        [`1-${relationshipItem1.uuid}`]: fieldUpdateAddRelationship1,
        [`1-${relationshipItem2.uuid}`]: fieldUpdateRemoveRelationship2,
      } as FieldUpdates));
      service.submit(currentItem, `/entities/orgunit/${currentItem.uuid}/edit/relationships`);

      expect(service.addRelationship).toHaveBeenCalledWith(relationshipIdentifiable1);
      expect(service.deleteRelationship).toHaveBeenCalledWith(relationshipIdentifiable2 as DeleteRelationship);

      expect(itemService.invalidateByHref).toHaveBeenCalledWith(currentItem.self);
      expect(itemService.invalidateByHref).toHaveBeenCalledWith(relationshipItem1.self);
      expect(itemService.invalidateByHref).toHaveBeenCalledWith(relationshipItem2.self);

      expect(notificationsService.success).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteRelationship', () => {
    beforeEach(() => {
      spyOn(relationshipService, 'deleteRelationship').and.callThrough();
    });

    it('should pass "all" as copyVirtualMetadata when the user want to keep the data on both sides', () => {
      service.deleteRelationship({
        uuid: relationshipItem1.uuid,
        keepLeftVirtualMetadata: true,
        keepRightVirtualMetadata: true,
      } as DeleteRelationship);

      expect(relationshipService.deleteRelationship).toHaveBeenCalledWith(relationshipItem1.uuid, 'all', false);
    });

    it('should pass "left" as copyVirtualMetadata when the user only want to keep the data on the left side', () => {
      service.deleteRelationship({
        uuid: relationshipItem1.uuid,
        keepLeftVirtualMetadata: true,
        keepRightVirtualMetadata: false,
      } as DeleteRelationship);

      expect(relationshipService.deleteRelationship).toHaveBeenCalledWith(relationshipItem1.uuid, 'left', false);
    });

    it('should pass "right" as copyVirtualMetadata when the user only want to keep the data on the right side', () => {
      service.deleteRelationship({
        uuid: relationshipItem1.uuid,
        keepLeftVirtualMetadata: false,
        keepRightVirtualMetadata: true,
      } as DeleteRelationship);

      expect(relationshipService.deleteRelationship).toHaveBeenCalledWith(relationshipItem1.uuid, 'right', false);
    });

    it('should pass "none" as copyVirtualMetadata when the user doesn\'t want to keep the virtual metadata', () => {
      service.deleteRelationship({
        uuid: relationshipItem1.uuid,
        keepLeftVirtualMetadata: false,
        keepRightVirtualMetadata: false,
      } as DeleteRelationship);

      expect(relationshipService.deleteRelationship).toHaveBeenCalledWith(relationshipItem1.uuid, 'none', false);
    });
  });

  describe('addRelationship', () => {
    beforeEach(() => {
      spyOn(relationshipService, 'addRelationship').and.callThrough();
    });

    it('should call the addRelationship from relationshipService correctly when original item is on the right', () => {
      service.addRelationship({
        originalItem: currentItem,
        originalIsLeft: false,
        relatedItem: relationshipItem1,
        type: orgUnitToOrgUnitType,
        uuid: `1-${relationshipItem1.uuid}`,
      } as RelationshipIdentifiable);
      expect(relationshipService.addRelationship).toHaveBeenCalledWith(orgUnitToOrgUnitType.id, relationshipItem1, currentItem, undefined, null, false);
    });

    it('should call the addRelationship from relationshipService correctly when original item is on the left', () => {
      service.addRelationship({
        originalItem: currentItem,
        originalIsLeft: true,
        relatedItem: relationshipItem1,
        type: orgUnitToOrgUnitType,
        uuid: `1-${relationshipItem1.uuid}`,
      } as RelationshipIdentifiable);

      expect(relationshipService.addRelationship).toHaveBeenCalledWith(orgUnitToOrgUnitType.id, currentItem, relationshipItem1, null, undefined, false);
    });
  });

  describe('isProvidedItemTypeLeftType', () => {
    it('should return true if the provided item corresponds to the left type of the relationship', (done) => {
      const relationshipType = Object.assign(new RelationshipType(), {
        leftType: createSuccessfulRemoteDataObject$({ id: 'leftType' }),
        rightType: createSuccessfulRemoteDataObject$({ id: 'rightType' }),
      });
      const itemType = Object.assign(new ItemType(), { id: 'leftType' } );
      const item = Object.assign(new Item(), { uuid: 'item-uuid' });

      const result = service.isProvidedItemTypeLeftType(relationshipType, itemType, item);
      result.subscribe((resultValue) => {
        expect(resultValue).toBeTrue();
        done();
      });
    });

    it('should return false if the provided item corresponds to the right type of the relationship', (done) => {
      const relationshipType = Object.assign(new RelationshipType(), {
        leftType: createSuccessfulRemoteDataObject$({ id: 'leftType' }),
        rightType: createSuccessfulRemoteDataObject$({ id: 'rightType' }),
      });
      const itemType = Object.assign(new ItemType(), { id: 'rightType' } );
      const item = Object.assign(new Item(), { uuid: 'item-uuid' });

      const result = service.isProvidedItemTypeLeftType(relationshipType, itemType, item);
      result.subscribe((resultValue) => {
        expect(resultValue).toBeFalse();
        done();
      });
    });

    it('should return undefined if the provided item corresponds does not match any of the relationship types', (done) => {
      const relationshipType = Object.assign(new RelationshipType(), {
        leftType: createSuccessfulRemoteDataObject$({ id: 'leftType' }),
        rightType: createSuccessfulRemoteDataObject$({ id: 'rightType' }),
      });
      const itemType = Object.assign(new ItemType(), { id: 'something-else' } );
      const item = Object.assign(new Item(), { uuid: 'item-uuid' });

      const result = service.isProvidedItemTypeLeftType(relationshipType, itemType, item);
      result.subscribe((resultValue) => {
        expect(resultValue).toBeUndefined();
        done();
      });
    });
  });

  describe('relationshipMatchesBothSameTypes', () => {
    it('should return true if both left and right type of the relationship type are the same and match the provided itemtype', (done) => {
      const relationshipType = Object.assign(new RelationshipType(), {
        leftType: createSuccessfulRemoteDataObject$({ id: 'sameType' }),
        rightType: createSuccessfulRemoteDataObject$({ id:'sameType' }),
        leftwardType: 'isDepartmentOfDivision',
        rightwardType: 'isDivisionOfDepartment',
      });
      const itemType = Object.assign(new ItemType(), { id: 'sameType' } );

      const result = service.shouldDisplayBothRelationshipSides(relationshipType, itemType);
      result.subscribe((resultValue) => {
        expect(resultValue).toBeTrue();
        done();
      });
    });
    it('should return false if both left and right type of the relationship type are the same and match the provided itemtype but the leftwardType & rightwardType is identical', (done) => {
      const relationshipType = Object.assign(new RelationshipType(), {
        leftType: createSuccessfulRemoteDataObject$({ id: 'sameType' }),
        rightType: createSuccessfulRemoteDataObject$({ id: 'sameType' }),
        leftwardType: 'isOrgUnitOfOrgUnit',
        rightwardType: 'isOrgUnitOfOrgUnit',
      });
      const itemType = Object.assign(new ItemType(), { id: 'sameType' });

      const result = service.shouldDisplayBothRelationshipSides(relationshipType, itemType);
      result.subscribe((resultValue) => {
        expect(resultValue).toBeFalse();
        done();
      });
    });
    it('should return false if both left and right type of the relationship type are the same and do not match the provided itemtype', (done) => {
      const relationshipType = Object.assign(new RelationshipType(), {
        leftType: createSuccessfulRemoteDataObject$({ id: 'sameType' }),
        rightType: createSuccessfulRemoteDataObject$({ id: 'sameType' }),
        leftwardType: 'isDepartmentOfDivision',
        rightwardType: 'isDivisionOfDepartment',
      });
      const itemType = Object.assign(new ItemType(), { id: 'something-else' } );

      const result = service.shouldDisplayBothRelationshipSides(relationshipType, itemType);
      result.subscribe((resultValue) => {
        expect(resultValue).toBeFalse();
        done();
      });
    });
    it('should return false if both left and right type of the relationship type are different', (done) => {
      const relationshipType = Object.assign(new RelationshipType(), {
        leftType: createSuccessfulRemoteDataObject$({ id: 'leftType' }),
        rightType: createSuccessfulRemoteDataObject$({ id: 'rightType' }),
        leftwardType: 'isAuthorOfPublication',
        rightwardType: 'isPublicationOfAuthor',
      });
      const itemType = Object.assign(new ItemType(), { id: 'leftType' } );

      const result = service.shouldDisplayBothRelationshipSides(relationshipType, itemType);
      result.subscribe((resultValue) => {
        expect(resultValue).toBeFalse();
        done();
      });
    });
  });

  describe('displayNotifications', () => {
    it('should show one success notification when multiple requests succeeded', () => {
      service.displayNotifications([
        createSuccessfulRemoteDataObject({}),
        createSuccessfulRemoteDataObject({}),
      ]);

      expect(notificationsService.success).toHaveBeenCalledTimes(1);
    });

    it('should show one success notification even when some requests failed', () => {
      service.displayNotifications([
        createSuccessfulRemoteDataObject({}),
        createFailedRemoteDataObject('Request Failed'),
        createSuccessfulRemoteDataObject({}),
      ]);

      expect(notificationsService.success).toHaveBeenCalledTimes(1);
      expect(notificationsService.error).toHaveBeenCalledTimes(1);
    });

    it('should show a separate error notification for each failed request', () => {
      service.displayNotifications([
        createSuccessfulRemoteDataObject({}),
        createFailedRemoteDataObject('Request Failed 1'),
        createSuccessfulRemoteDataObject({}),
        createFailedRemoteDataObject('Request Failed 2'),
      ]);

      expect(notificationsService.success).toHaveBeenCalledTimes(1);
      expect(notificationsService.error).toHaveBeenCalledTimes(2);
    });
  });
});
