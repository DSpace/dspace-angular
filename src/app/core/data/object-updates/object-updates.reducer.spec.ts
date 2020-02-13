import * as deepFreeze from 'deep-freeze';
import {
  AddFieldUpdateAction, AddPageToCustomOrderAction,
  DiscardObjectUpdatesAction,
  FieldChangeType,
  InitializeFieldsAction, MoveFieldUpdateAction,
  ReinstateObjectUpdatesAction, RemoveAllObjectUpdatesAction,
  RemoveFieldUpdateAction, RemoveObjectUpdatesAction, SelectVirtualMetadataAction,
  SetEditableFieldUpdateAction, SetValidFieldUpdateAction
} from './object-updates.actions';
import { OBJECT_UPDATES_TRASH_PATH, objectUpdatesReducer } from './object-updates.reducer';
import {Relationship} from '../../shared/item-relationships/relationship.model';

class NullAction extends RemoveFieldUpdateAction {
  type = null;
  payload = null;

  constructor() {
    super(null, null);
  }
}

const identifiable1 = {
  uuid: '8222b07e-330d-417b-8d7f-3b82aeaf2320',
  key: 'dc.contributor.author',
  language: null,
  value: 'Smith, John'
};

const identifiable1update = {
  uuid: '8222b07e-330d-417b-8d7f-3b82aeaf2320',
  key: 'dc.contributor.author',
  language: null,
  value: 'Smith, James'
};
const identifiable2 = {
  uuid: '26cbb5ce-5786-4e57-a394-b9fcf8eaf241',
  key: 'dc.title',
  language: null,
  value: 'New title'
};
const identifiable3 = {
  uuid: 'c5d2c2f7-d757-48bf-84cc-8c9229c8407e',
  key: 'dc.description.abstract',
  language: null,
  value: 'Unchanged value'
};
const relationship: Relationship = Object.assign(new Relationship(), {uuid: 'test relationship uuid'});

const modDate = new Date(2010, 2, 11);
const uuid = identifiable1.uuid;
const url = 'test-object.url/edit';
describe('objectUpdatesReducer', () => {
  const testState = {
    [url]: {
      fieldStates: {
        [identifiable1.uuid]: {
          editable: true,
          isNew: false,
          isValid: true
        },
        [identifiable2.uuid]: {
          editable: false,
          isNew: true,
          isValid: true
        },
        [identifiable3.uuid]: {
          editable: false,
          isNew: false,
          isValid: false
        },
      },
      fieldUpdates: {
        [identifiable2.uuid]: {
          field: {
            uuid: identifiable2.uuid,
            key: 'dc.titl',
            language: null,
            value: 'New title'
          },
          changeType: FieldChangeType.ADD
        }
      },
      lastModified: modDate,
      virtualMetadataSources: {
        [relationship.uuid]: {[identifiable1.uuid]: true}
      },
      customOrder: {
        initialOrderPages: [
          { order: [identifiable1.uuid, identifiable2.uuid, identifiable3.uuid] }
        ],
        newOrderPages: [
          { order: [identifiable1.uuid, identifiable2.uuid, identifiable3.uuid] }
        ],
        pageSize: 10,
        changed: false
      }
    }
  };

  const discardedTestState = {
    [url]: {
      fieldStates: {
        [identifiable1.uuid]: {
          editable: true,
          isNew: false,
          isValid: true
        },
        [identifiable2.uuid]: {
          editable: false,
          isNew: true,
          isValid: true
        },
        [identifiable3.uuid]: {
          editable: false,
          isNew: false,
          isValid: true
        },
      },
      lastModified: modDate,
      virtualMetadataSources: {
        [relationship.uuid]: {[identifiable1.uuid]: true}
      },
      customOrder: {
        initialOrderPages: [
          { order: [identifiable1.uuid, identifiable2.uuid, identifiable3.uuid] }
        ],
        newOrderPages: [
          { order: [identifiable1.uuid, identifiable2.uuid, identifiable3.uuid] }
        ],
        pageSize: 10,
        changed: false
      }
    },
    [url + OBJECT_UPDATES_TRASH_PATH]: {
      fieldStates: {
        [identifiable1.uuid]: {
          editable: true,
          isNew: false,
          isValid: true
        },
        [identifiable2.uuid]: {
          editable: false,
          isNew: true,
          isValid: true
        },
        [identifiable3.uuid]: {
          editable: false,
          isNew: false,
          isValid: false
        },
      },
      fieldUpdates: {
        [identifiable2.uuid]: {
          field: {
            uuid: identifiable2.uuid,
            key: 'dc.titl',
            language: null,
            value: 'New title'
          },
          changeType: FieldChangeType.ADD
        }
      },
      lastModified: modDate,
      virtualMetadataSources: {
        [relationship.uuid]: {[identifiable1.uuid]: true}
      },
      customOrder: {
        initialOrderPages: [
          { order: [identifiable1.uuid, identifiable2.uuid, identifiable3.uuid] }
        ],
        newOrderPages: [
          { order: [identifiable1.uuid, identifiable2.uuid, identifiable3.uuid] }
        ],
        pageSize: 10,
        changed: false
      }
    }
  };

  deepFreeze(testState);

  it('should return the current state when no valid actions have been made', () => {
    const action = new NullAction();
    const newState = objectUpdatesReducer(testState, action);

    expect(newState).toEqual(testState);
  });

  it('should start with an empty object', () => {
    const action = new NullAction();
    const initialState = objectUpdatesReducer(undefined, action);

    expect(initialState).toEqual({});
  });

  it('should perform the INITIALIZE_FIELDS action without affecting the previous state', () => {
    const action = new InitializeFieldsAction(url, [identifiable1, identifiable2], modDate);
    // testState has already been frozen above
    objectUpdatesReducer(testState, action);
  });

  it('should perform the SET_EDITABLE_FIELD action without affecting the previous state', () => {
    const action = new SetEditableFieldUpdateAction(url, uuid, false);
    // testState has already been frozen above
    objectUpdatesReducer(testState, action);
  });

  it('should perform the ADD_FIELD action without affecting the previous state', () => {
    const action = new AddFieldUpdateAction(url, identifiable1update, FieldChangeType.UPDATE);
    // testState has already been frozen above
    objectUpdatesReducer(testState, action);
  });

  it('should perform the DISCARD action without affecting the previous state', () => {
    const action = new DiscardObjectUpdatesAction(url, null);
    // testState has already been frozen above
    objectUpdatesReducer(testState, action);
  });

  it('should perform the REINSTATE action without affecting the previous state', () => {
    const action = new ReinstateObjectUpdatesAction(url);
    // testState has already been frozen above
    objectUpdatesReducer(testState, action);
  });

  it('should perform the REMOVE action without affecting the previous state', () => {
    const action = new RemoveFieldUpdateAction(url, uuid);
    // testState has already been frozen above
    objectUpdatesReducer(testState, action);
  });

  it('should perform the REMOVE_FIELD action without affecting the previous state', () => {
    const action = new RemoveFieldUpdateAction(url, uuid);
    // testState has already been frozen above
    objectUpdatesReducer(testState, action);
  });

  it('should perform the SELECT_VIRTUAL_METADATA action without affecting the previous state', () => {
    const action = new SelectVirtualMetadataAction(url, relationship.uuid, identifiable1.uuid, true);
    // testState has already been frozen above
    objectUpdatesReducer(testState, action);
  });

  it('should initialize all fields when the INITIALIZE action is dispatched, based on the payload', () => {
    const action = new InitializeFieldsAction(url, [identifiable1, identifiable3], modDate, [identifiable1.uuid, identifiable3.uuid], 10, 0);

    const expectedState = {
      [url]: {
        fieldStates: {
          [identifiable1.uuid]: {
            editable: false,
            isNew: false,
            isValid: true
          },
          [identifiable3.uuid]: {
            editable: false,
            isNew: false,
            isValid: true
          },
        },
        fieldUpdates: {},
        virtualMetadataSources: {},
        lastModified: modDate,
        customOrder: {
          initialOrderPages: [
            { order: [identifiable1.uuid, identifiable3.uuid] }
          ],
          newOrderPages: [
            { order: [identifiable1.uuid, identifiable3.uuid] }
          ],
          pageSize: 10,
          changed: false
        }
      }
    };
    const newState = objectUpdatesReducer(testState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should set the given field\'s fieldStates when the SET_EDITABLE_FIELD action is dispatched, based on the payload', () => {
    const action = new SetEditableFieldUpdateAction(url, identifiable3.uuid, true);

    const newState = objectUpdatesReducer(testState, action);
    expect(newState[url].fieldStates[identifiable3.uuid].editable).toBeTruthy();
  });

  it('should set the given field\'s fieldStates when the SET_VALID_FIELD action is dispatched, based on the payload', () => {
    const action = new SetValidFieldUpdateAction(url, identifiable3.uuid, false);

    const newState = objectUpdatesReducer(testState, action);
    expect(newState[url].fieldStates[identifiable3.uuid].isValid).toBeFalsy();
  });

  it('should add a given field\'s update to the state when the ADD_FIELD action is dispatched, based on the payload', () => {
    const action = new AddFieldUpdateAction(url, identifiable1update, FieldChangeType.UPDATE);

    const newState = objectUpdatesReducer(testState, action);
    expect(newState[url].fieldUpdates[identifiable1.uuid].field).toEqual(identifiable1update);
    expect(newState[url].fieldUpdates[identifiable1.uuid].changeType).toEqual(FieldChangeType.UPDATE);
  });

  it('should discard a given url\'s updates from the state when the DISCARD action is dispatched, based on the payload', () => {
    const action = new DiscardObjectUpdatesAction(url, null);

    const newState = objectUpdatesReducer(testState, action);
    expect(newState[url].fieldUpdates).toEqual({});
    expect(newState[url + OBJECT_UPDATES_TRASH_PATH]).toEqual(testState[url]);
  });

  it('should reinstate a given url\'s updates from the state when the REINSTATE action is dispatched, based on the payload', () => {
    const action = new ReinstateObjectUpdatesAction(url);

    const newState = objectUpdatesReducer(discardedTestState, action);
    expect(newState).toEqual(testState);
  });

  it('should remove a given url\'s updates from the state when the REMOVE action is dispatched, based on the payload', () => {
    const action = new RemoveObjectUpdatesAction(url);

    const newState = objectUpdatesReducer(discardedTestState, action);
    expect(newState[url].fieldUpdates).toBeUndefined();
    expect(newState[url + OBJECT_UPDATES_TRASH_PATH]).toBeUndefined();
  });

  it('should remove all updates from the state when the REMOVE_ALL action is dispatched', () => {
    const action = new RemoveAllObjectUpdatesAction();

    const newState = objectUpdatesReducer(discardedTestState, action as any);
    expect(newState[url].fieldUpdates).toBeUndefined();
    expect(newState[url + OBJECT_UPDATES_TRASH_PATH]).toBeUndefined();
  });

  it('should remove a given field\'s update from the state when the REMOVE_FIELD action is dispatched, based on the payload', () => {
    const action = new RemoveFieldUpdateAction(url, uuid);

    const newState = objectUpdatesReducer(testState, action);
    expect(newState[url].fieldUpdates[uuid]).toBeUndefined();
  });

  it('should move the custom order from the state when the MOVE action is dispatched', () => {
    const action = new MoveFieldUpdateAction(url, 0, 1, 0, 0);

    const newState = objectUpdatesReducer(testState, action);
    expect(newState[url].customOrder.newOrderPages[0].order[0]).toEqual(testState[url].customOrder.newOrderPages[0].order[1]);
    expect(newState[url].customOrder.newOrderPages[0].order[1]).toEqual(testState[url].customOrder.newOrderPages[0].order[0]);
    expect(newState[url].customOrder.changed).toEqual(true);
  });

  it('should add a new page to the custom order and add empty pages in between when the ADD_PAGE_TO_CUSTOM_ORDER action is dispatched', () => {
    const identifiable4 = {
      uuid: 'a23eae5a-7857-4ef9-8e52-989436ad2955',
      key: 'dc.description.abstract',
      language: null,
      value: 'Extra value'
    };
    const action = new AddPageToCustomOrderAction(url, [identifiable4], [identifiable4.uuid], 2);

    const newState = objectUpdatesReducer(testState, action);
    // Confirm the page in between the two pages (index 1) has been filled with 10 (page size) undefined values
    expect(newState[url].customOrder.newOrderPages[1].order.length).toEqual(10);
    expect(newState[url].customOrder.newOrderPages[1].order[0]).toBeUndefined();
    // Verify the new page is correct
    expect(newState[url].customOrder.newOrderPages[2].order[0]).toEqual(identifiable4.uuid);
  });
});
