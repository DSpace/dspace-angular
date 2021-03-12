import { TestBed, waitForAsync } from '@angular/core/testing';

import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';

import { RelationshipEffects } from './relationship.effects';
import { AddRelationshipAction, RelationshipActionTypes, RemoveRelationshipAction } from './relationship.actions';
import { Item } from '../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { RelationshipTypeService } from '../../../../../core/data/relationship-type.service';
import { RelationshipService } from '../../../../../core/data/relationship.service';
import { Relationship } from '../../../../../core/shared/item-relationships/relationship.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { RelationshipType } from '../../../../../core/shared/item-relationships/relationship-type.model';
import { ItemType } from '../../../../../core/shared/item-relationships/item-type.model';
import { RestResponse } from '../../../../../core/cache/response.models';
import { SubmissionObjectDataService } from '../../../../../core/submission/submission-object-data.service';
import { WorkspaceItem } from '../../../../../core/submission/models/workspaceitem.model';
import { ObjectCacheService } from '../../../../../core/cache/object-cache.service';
import { RequestService } from '../../../../../core/data/request.service';
import { NotificationsService } from '../../../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';

describe('RelationshipEffects', () => {
  let relationEffects: RelationshipEffects;
  let actions: Observable<any>;

  let testUUID1;
  let testUUID2;
  let leftTypeString;
  let rightTypeString;
  let leftType;
  let rightType;
  let leftTypeMD;
  let rightTypeMD;
  let relationshipID;
  let identifier;

  let leftItem;

  let rightItem;

  let relationshipType: RelationshipType;

  let relationship;
  let mockRelationshipService;
  let mockRelationshipTypeService;
  let notificationsService;
  let translateService;
  let selectableListService;
  let testScheduler: TestScheduler;

  function init() {
    testUUID1 = '20e24c2f-a00a-467c-bdee-c929e79bf08d';
    testUUID2 = '7f66a4d0-8557-4e77-8b1e-19930895f10a';
    leftTypeString = 'Publication';
    rightTypeString = 'Person';
    leftType = Object.assign(new ItemType(), { label: leftTypeString });
    rightType = Object.assign(new ItemType(), { label: rightTypeString });
    leftTypeMD = Object.assign(new MetadataValue(), { value: leftTypeString });
    rightTypeMD = Object.assign(new MetadataValue(), { value: rightTypeString });
    relationshipID = '1234';

    leftItem = Object.assign(new Item(), {
      uuid: testUUID1,
      metadata: { 'relationship.type': [leftTypeMD] }
    });

    rightItem = Object.assign(new Item(), {
      uuid: testUUID2,
      metadata: { 'relationship.type': [rightTypeMD] }
    });

    relationshipType = Object.assign(new RelationshipType(), {
      leftwardType: 'isAuthorOfPublication',
      rightwardType: 'isPublicationOfAuthor',
      leftType: createSuccessfulRemoteDataObject$(leftType),
      rightType: createSuccessfulRemoteDataObject$(rightType)
    });

    relationship = Object.assign(new Relationship(),
      {
        uuid: relationshipID,
        id: relationshipID,
        leftItem: createSuccessfulRemoteDataObject$(leftItem),
        rightItem: createSuccessfulRemoteDataObject$(rightItem),
        relationshipType: createSuccessfulRemoteDataObject$(relationshipType)
      });

    mockRelationshipService = {
      getRelationshipByItemsAndLabel:
        () => observableOf(relationship),
      deleteRelationship: () => observableOf(new RestResponse(true, 200, 'OK')),
      addRelationship: () => observableOf(new RestResponse(true, 200, 'OK'))

    };
    mockRelationshipTypeService = {
      getRelationshipTypeByLabelAndTypes:
        () => observableOf(relationshipType)
    };
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    translateService = jasmine.createSpyObj('translateService', {
      instant: 'translated-message'
    });
    selectableListService = jasmine.createSpyObj('selectableListService', {
      findSelectedByCondition: observableOf({}),
      deselectSingle: {}
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      providers: [
        RelationshipEffects,
        provideMockActions(() => actions),
        { provide: RelationshipTypeService, useValue: mockRelationshipTypeService },
        { provide: RelationshipService, useValue: mockRelationshipService },
        {
          provide: SubmissionObjectDataService, useValue: {
            findById: () => createSuccessfulRemoteDataObject$(new WorkspaceItem())
          },
          getHrefByID: () => observableOf('')
        },
        { provide: Store, useValue: jasmine.createSpyObj('store', ['dispatch']) },
        { provide: ObjectCacheService, useValue: {} },
        { provide: RequestService, useValue: {} },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: TranslateService, useValue: translateService },
        { provide: SelectableListService, useValue: selectableListService },
      ],
    });
  }));

  beforeEach(() => {
    relationEffects = TestBed.inject(RelationshipEffects);
    identifier = (relationEffects as any).createIdentifier(leftItem, rightItem, relationshipType.leftwardType);
    spyOn((relationEffects as any), 'addRelationship').and.stub();
    spyOn((relationEffects as any), 'removeRelationship').and.stub();
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('mapLastActions$', () => {
    describe('When an ADD_RELATIONSHIP action is triggered', () => {
      describe('When it\'s the first time for this identifier', () => {
        let action;

        it('should set the current value debounceMap and the value of the initialActionMap to ADD_RELATIONSHIP', () => {
          testScheduler.run(({ hot, expectObservable, flush }) => {
            action = new AddRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
            actions = hot('--a-|', { a: action });
            expectObservable(relationEffects.mapLastActions$).toBe('--b-|', { b: undefined });
            flush();
            // TODO check following expectations with the implementation
            // expect((relationEffects as any).initialActionMap[identifier]).toBe(action.type);
            // expect((relationEffects as any).debounceMap[identifier].value).toBe(action.type);
          });
        });
      });

      describe('When it\'s not the first time for this identifier', () => {
        let action;
        const testActionType = 'TEST_TYPE';
        beforeEach(() => {
          (relationEffects as any).initialActionMap[identifier] = testActionType;
          (relationEffects as any).debounceMap[identifier] = new BehaviorSubject<string>(testActionType);
        });

        it('should set the current value debounceMap to ADD_RELATIONSHIP but not change the value of the initialActionMap', () => {
          testScheduler.run(({ hot, expectObservable, flush }) => {
            action = new AddRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
            actions = hot('--a-|', { a: action });
            expectObservable(relationEffects.mapLastActions$).toBe('--b-|', { b: undefined });
            flush();
            expect((relationEffects as any).initialActionMap[identifier]).toBe(testActionType);
            expect((relationEffects as any).debounceMap[identifier].value).toBe(action.type);
          });
        });
      });

      describe('When the initialActionMap contains an ADD_RELATIONSHIP action', () => {
        let action;
        describe('When the last value in the debounceMap is also an ADD_RELATIONSHIP action', () => {
          beforeEach(() => {
            (relationEffects as any).initialActionMap[identifier] = RelationshipActionTypes.ADD_RELATIONSHIP;
          });
          it('should call addRelationship on the effect', () => {
            testScheduler.run(({ hot, expectObservable, flush }) => {
              action = new AddRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
              actions = hot('--a-|', { a: action });
              expectObservable(relationEffects.mapLastActions$).toBe('--b-|', { b: undefined });
              flush();
              expect((relationEffects as any).addRelationship).toHaveBeenCalledWith(leftItem, rightItem, relationshipType.leftwardType, '1234', undefined);
            });
          });
        });

        describe('When the last value in the debounceMap is instead a REMOVE_RELATIONSHIP action', () => {

          it('should <b>not</b> call removeRelationship or addRelationship on the effect', () => {
            testScheduler.run(({ hot, expectObservable, flush }) => {
              const actiona = new AddRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
              const actionb = new RemoveRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
              actions = hot('--ab-|', { a: actiona, b: actionb });
              expectObservable(relationEffects.mapLastActions$).toBe('--bb-|', { b: undefined });
              flush();
              expect((relationEffects as any).addRelationship).not.toHaveBeenCalled();
              expect((relationEffects as any).removeRelationship).not.toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe('When an REMOVE_RELATIONSHIP action is triggered', () => {
      describe('When it\'s the first time for this identifier', () => {
        let action;

        it('should set the current value debounceMap and the value of the initialActionMap to REMOVE_RELATIONSHIP', () => {
          testScheduler.run(({ hot, expectObservable, flush }) => {
            action = new RemoveRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
            actions = hot('--a-|', { a: action });
            expectObservable(relationEffects.mapLastActions$).toBe('--b-|', { b: undefined });
            flush();
            // TODO check following expectations with the implementation
            // expect((relationEffects as any).initialActionMap[identifier]).toBe(action.type);
            // expect((relationEffects as any).debounceMap[identifier].value).toBe(action.type);
          });
        });
      });

      describe('When it\'s not the first time for this identifier', () => {
        let action;
        const testActionType = 'TEST_TYPE';
        beforeEach(() => {
          (relationEffects as any).initialActionMap[identifier] = testActionType;
          (relationEffects as any).debounceMap[identifier] = new BehaviorSubject<string>(testActionType);
        });

        it('should set the current value debounceMap to REMOVE_RELATIONSHIP but not change the value of the initialActionMap', () => {
          testScheduler.run(({ hot, expectObservable, flush }) => {
            action = new RemoveRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
            actions = hot('--a-|', { a: action });
            expectObservable(relationEffects.mapLastActions$).toBe('--b-|', { b: undefined });
            flush();
            // TODO check following expectations with the implementation
            // expect((relationEffects as any).initialActionMap[identifier]).toBe(testActionType);
            // expect((relationEffects as any).debounceMap[identifier].value).toBe(action.type);
          });
        });
      });

      describe('When the initialActionMap contains an REMOVE_RELATIONSHIP action', () => {
        let action;
        describe('When the last value in the debounceMap is also an REMOVE_RELATIONSHIP action', () => {
          beforeEach(() => {
            (relationEffects as any).initialActionMap[identifier] = RelationshipActionTypes.REMOVE_RELATIONSHIP;
          });

          it('should call removeRelationship on the effect', () => {
            testScheduler.run(({ hot, expectObservable, flush }) => {
              action = new RemoveRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
              actions = hot('a', { a: action });
              expectObservable(relationEffects.mapLastActions$).toBe('b', { b: undefined });
              flush();
              expect((relationEffects as any).removeRelationship).toHaveBeenCalledWith(leftItem, rightItem, relationshipType.leftwardType, '1234',);
            });
          });
        });

        describe('When the last value in the debounceMap is instead a ADD_RELATIONSHIP action', () => {

          it('should <b>not</b> call addRelationship or removeRelationship on the effect', () => {
            testScheduler.run(({ hot, expectObservable, flush }) => {
              const actionb = new RemoveRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
              const actiona = new AddRelationshipAction(leftItem, rightItem, relationshipType.leftwardType, '1234');
              actions = hot('--ab-|', { a: actiona, b: actionb });
              expectObservable(relationEffects.mapLastActions$).toBe('--bb-|', { b: undefined });
              flush();
              expect((relationEffects as any).addRelationship).not.toHaveBeenCalled();
              expect((relationEffects as any).removeRelationship).not.toHaveBeenCalled();
            });
          });
        });
      });
    });
  });
});
