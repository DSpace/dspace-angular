import {
  AddFieldUpdateAction, AddPageToCustomOrderAction,
  DiscardObjectUpdatesAction,
  FieldChangeType,
  InitializeFieldsAction, MoveFieldUpdateAction,
  ObjectUpdatesAction,
  ObjectUpdatesActionTypes,
  ReinstateObjectUpdatesAction,
  RemoveFieldUpdateAction,
  RemoveObjectUpdatesAction,
  SetEditableFieldUpdateAction,
  SetValidFieldUpdateAction,
  SelectVirtualMetadataAction,
} from './object-updates.actions';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { from } from 'rxjs/internal/observable/from';
import {Relationship} from '../../shared/item-relationships/relationship.model';

/**
 * Path where discarded objects are saved
 */
export const OBJECT_UPDATES_TRASH_PATH = '/trash';

/**
 * The state for a single field
 */
export interface FieldState {
  editable: boolean,
  isNew: boolean,
  isValid: boolean
}

/**
 * A list of states for all the fields for a single page, mapped by uuid
 */
export interface FieldStates {
  [uuid: string]: FieldState;
}

/**
 * Represents every object that has a UUID
 */
export interface Identifiable {
  uuid: string
}

/**
 * The state of a single field update
 */
export interface FieldUpdate {
  field: Identifiable,
  changeType: FieldChangeType
}

/**
 * The states of all field updates available for a single page, mapped by uuid
 */
export interface FieldUpdates {
  [uuid: string]: FieldUpdate;
}

/**
 * The states of all virtual metadata selections available for a single page, mapped by the relationship uuid
 */
export interface VirtualMetadataSources {
  [source: string]: VirtualMetadataSource
}

/**
 * The selection of virtual metadata for a relationship, mapped by the uuid of either the item or the relationship type
 */
export interface VirtualMetadataSource {
  [uuid: string]: boolean,
}

/**
 * A fieldupdate interface which represents a relationship selected to be deleted,
 * along with a selection of the virtual metadata to keep
 */
export interface DeleteRelationship extends Relationship {
  keepLeftVirtualMetadata: boolean,
  keepRightVirtualMetadata: boolean,
}

/**
 * A custom order given to the list of objects
 */
export interface CustomOrder {
  initialOrderPages: OrderPage[],
  newOrderPages: OrderPage[],
  pageSize: number;
  changed: boolean
}

export interface OrderPage {
  order: string[]
}

/**
 * The updated state of a single page
 */
export interface ObjectUpdatesEntry {
  fieldStates: FieldStates;
  fieldUpdates: FieldUpdates;
  virtualMetadataSources: VirtualMetadataSources;
  lastModified: Date;
  customOrder: CustomOrder
}

/**
 * The updated state of all pages, mapped by the page URL
 */
export interface ObjectUpdatesState {
  [url: string]: ObjectUpdatesEntry;
}

/**
 * Initial state for an existing initialized field
 */
const initialFieldState = { editable: false, isNew: false, isValid: true };

/**
 * Initial state for a newly added field
 */
const initialNewFieldState = { editable: true, isNew: true, isValid: undefined };

// Object.create(null) ensures the object has no default js properties (e.g. `__proto__`)
const initialState = Object.create(null);

/**
 * Reducer method to calculate the next ObjectUpdates state, based on the current state and the ObjectUpdatesAction
 * @param state The current state
 * @param action The action to perform on the current state
 */
export function objectUpdatesReducer(state = initialState, action: ObjectUpdatesAction): ObjectUpdatesState {
  switch (action.type) {
    case ObjectUpdatesActionTypes.INITIALIZE_FIELDS: {
      return initializeFieldsUpdate(state, action as InitializeFieldsAction);
    }
    case ObjectUpdatesActionTypes.ADD_PAGE_TO_CUSTOM_ORDER: {
      return addPageToCustomOrder(state, action as AddPageToCustomOrderAction);
    }
    case ObjectUpdatesActionTypes.ADD_FIELD: {
      return addFieldUpdate(state, action as AddFieldUpdateAction);
    }
    case ObjectUpdatesActionTypes.SELECT_VIRTUAL_METADATA: {
      return selectVirtualMetadata(state, action as SelectVirtualMetadataAction);
    }
    case ObjectUpdatesActionTypes.DISCARD: {
      return discardObjectUpdates(state, action as DiscardObjectUpdatesAction);
    }
    case ObjectUpdatesActionTypes.REINSTATE: {
      return reinstateObjectUpdates(state, action as ReinstateObjectUpdatesAction);
    }
    case ObjectUpdatesActionTypes.REMOVE: {
      return removeObjectUpdates(state, action as RemoveObjectUpdatesAction);
    }
    case ObjectUpdatesActionTypes.REMOVE_ALL: {
      return removeAllObjectUpdates(state);
    }
    case ObjectUpdatesActionTypes.REMOVE_FIELD: {
      return removeFieldUpdate(state, action as RemoveFieldUpdateAction);
    }
    case ObjectUpdatesActionTypes.SET_EDITABLE_FIELD: {
      return setEditableFieldUpdate(state, action as SetEditableFieldUpdateAction);
    }
    case ObjectUpdatesActionTypes.SET_VALID_FIELD: {
      return setValidFieldUpdate(state, action as SetValidFieldUpdateAction);
    }
    case ObjectUpdatesActionTypes.MOVE: {
      return moveFieldUpdate(state, action as MoveFieldUpdateAction);
    }
    default: {
      return state;
    }
  }
}

/**
 * Initialize the state for a specific url and store all its fields in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function initializeFieldsUpdate(state: any, action: InitializeFieldsAction) {
  const url: string = action.payload.url;
  const fields: Identifiable[] = action.payload.fields;
  const lastModifiedServer: Date = action.payload.lastModified;
  const order = action.payload.order;
  const pageSize = action.payload.pageSize;
  const page = action.payload.page;
  const fieldStates = createInitialFieldStates(fields);
  const initialOrderPages = addOrderToPages([], order, pageSize, page);
  const newPageState = Object.assign(
    {},
    state[url],
    { fieldStates: fieldStates },
    { fieldUpdates: {} },
    { virtualMetadataSources: {} },
    { lastModified: lastModifiedServer },
    { customOrder: {
      initialOrderPages: initialOrderPages,
      newOrderPages: initialOrderPages,
      pageSize: pageSize,
      changed: false }
    }
  );
  return Object.assign({}, state, { [url]: newPageState });
}

/**
 * Add a page of objects to the state of a specific url and update a specific page of the custom order
 * @param state The current state
 * @param action The action to perform on the current state
 */
function addPageToCustomOrder(state: any, action: AddPageToCustomOrderAction) {
  const url: string = action.payload.url;
  const fields: Identifiable[] = action.payload.fields;
  const fieldStates = createInitialFieldStates(fields);
  const order = action.payload.order;
  const page = action.payload.page;
  const pageState: ObjectUpdatesEntry = state[url] || {};
  const newPageState = Object.assign({}, pageState, {
    fieldStates: Object.assign({}, pageState.fieldStates, fieldStates),
    customOrder: Object.assign({}, pageState.customOrder, {
      newOrderPages: addOrderToPages(pageState.customOrder.newOrderPages, order, pageState.customOrder.pageSize, page),
      initialOrderPages: addOrderToPages(pageState.customOrder.initialOrderPages, order, pageState.customOrder.pageSize, page)
    })
  });
  return Object.assign({}, state, { [url]: newPageState });
}

/**
 * Add a new update for a specific field to the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function addFieldUpdate(state: any, action: AddFieldUpdateAction) {
  const url: string = action.payload.url;
  const field: Identifiable = action.payload.field;
  const changeType: FieldChangeType = action.payload.changeType;
  const pageState: ObjectUpdatesEntry = state[url] || {};

  let states = pageState.fieldStates;
  if (changeType === FieldChangeType.ADD) {
    states = Object.assign({}, { [field.uuid]: initialNewFieldState }, pageState.fieldStates)
  }

  let fieldUpdate: any = pageState.fieldUpdates[field.uuid] || {};
  const newChangeType = determineChangeType(fieldUpdate.changeType, changeType);

  fieldUpdate = Object.assign({}, { field, changeType: newChangeType });

  const fieldUpdates = Object.assign({}, pageState.fieldUpdates, { [field.uuid]: fieldUpdate });

  const newPageState = Object.assign({}, pageState,
    { fieldStates: states },
    { fieldUpdates: fieldUpdates });
  return Object.assign({}, state, { [url]: newPageState });
}

/**
 * Update the selected virtual metadata in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function selectVirtualMetadata(state: any, action: SelectVirtualMetadataAction) {

  const url: string = action.payload.url;
  const source: string = action.payload.source;
  const uuid: string = action.payload.uuid;
  const select: boolean = action.payload.select;

  const pageState: ObjectUpdatesEntry = state[url] || {};

  const virtualMetadataSource = Object.assign(
    {},
    pageState.virtualMetadataSources[source],
    {
      [uuid]: select,
    },
  );

  const virtualMetadataSources = Object.assign(
    {},
    pageState.virtualMetadataSources,
    {
      [source]: virtualMetadataSource,
    },
  );

  const newPageState = Object.assign(
    {},
    pageState,
    {virtualMetadataSources: virtualMetadataSources},
  );

  return Object.assign(
    {},
    state,
    {
      [url]: newPageState,
    }
  );
}

/**
 * Discard all updates for a specific action's url in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function discardObjectUpdates(state: any, action: DiscardObjectUpdatesAction) {
  if (action.payload.discardAll) {
    let newState = Object.assign({}, state);
    Object.keys(state).filter((path: string) => !path.endsWith(OBJECT_UPDATES_TRASH_PATH)).forEach((path: string) => {
      newState = discardObjectUpdatesFor(path, newState);
    });
    return newState;
  } else {
    const url: string = action.payload.url;
    return discardObjectUpdatesFor(url, state);
  }
}

/**
 * Discard all updates for a specific action's url in the store
 * @param url   The action's url
 * @param state The current state
 */
function discardObjectUpdatesFor(url: string, state: any) {
  const pageState: ObjectUpdatesEntry = state[url];
  const newFieldStates = {};
  Object.keys(pageState.fieldStates).forEach((uuid: string) => {
    const fieldState: FieldState = pageState.fieldStates[uuid];
    if (!fieldState.isNew) {
      /* After discarding we don't want the reset fields to stay editable or invalid */
      newFieldStates[uuid] = Object.assign({}, fieldState, { editable: false, isValid: true });
    }
  });

  const newCustomOrder = Object.assign({}, pageState.customOrder);
  if (pageState.customOrder.changed) {
    const initialOrder = pageState.customOrder.initialOrderPages;
    if (isNotEmpty(initialOrder)) {
      newCustomOrder.newOrderPages = initialOrder;
      newCustomOrder.changed = false;
    }
  }

  const discardedPageState = Object.assign({}, pageState, {
    fieldUpdates: {},
    fieldStates: newFieldStates,
    customOrder: newCustomOrder
  });
  return Object.assign({}, state, { [url]: discardedPageState }, { [url + OBJECT_UPDATES_TRASH_PATH]: pageState });
}

/**
 * Reinstate all updates for a specific action's url in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function reinstateObjectUpdates(state: any, action: ReinstateObjectUpdatesAction) {
  const url: string = action.payload.url;
  const trashState = state[url + OBJECT_UPDATES_TRASH_PATH];

  const newState = Object.assign({}, state, { [url]: trashState });
  delete newState[url + OBJECT_UPDATES_TRASH_PATH];
  return newState;
}

/**
 * Remove all updates for a specific action's url in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function removeObjectUpdates(state: any, action: RemoveObjectUpdatesAction) {
  const url: string = action.payload.url;
  return removeObjectUpdatesByURL(state, url);
}

/**
 * Remove all updates for a specific url in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function removeObjectUpdatesByURL(state: any, url: string) {
  const newState = Object.assign({}, state);
  delete newState[url + OBJECT_UPDATES_TRASH_PATH];
  return newState;
}

/**
 * Remove all updates in the store
 * @param state The current state
 */
function removeAllObjectUpdates(state: any) {
  const newState = Object.assign({}, state);
  Object.keys(state).filter((path: string) => path.endsWith(OBJECT_UPDATES_TRASH_PATH)).forEach((path: string) => {
    delete newState[path];
  });
  return newState;
}

/**
 * Discard the update for a specific action's url and field UUID in the store
 * @param state The current state
 * @param action The action to perform on the current state
 */
function removeFieldUpdate(state: any, action: RemoveFieldUpdateAction) {
  const url: string = action.payload.url;
  const uuid: string = action.payload.uuid;
  let newPageState: ObjectUpdatesEntry = state[url];
  if (hasValue(newPageState)) {
    const newUpdates: FieldUpdates = Object.assign({}, newPageState.fieldUpdates);
    if (hasValue(newUpdates[uuid])) {
      delete newUpdates[uuid];
    }
    const newFieldStates: FieldStates = Object.assign({}, newPageState.fieldStates);
    if (hasValue(newFieldStates[uuid])) {
      /* When resetting, make field not editable */
      if (newFieldStates[uuid].isNew) {
        /* If this field was added, just throw it away */
        delete newFieldStates[uuid];
      } else {
        newFieldStates[uuid] = Object.assign({}, newFieldStates[uuid], { editable: false, isValid: true });
      }
    }
    newPageState = Object.assign({}, state[url], {
      fieldUpdates: newUpdates,
      fieldStates: newFieldStates
    });
  }
  return Object.assign({}, state, { [url]: newPageState });
}

/**
 * Determine the most prominent FieldChangeType, ordered as follows:
 * undefined < UPDATE < ADD < REMOVE
 * @param oldType The current type
 * @param newType The new type that should possibly override the new type
 */
function determineChangeType(oldType: FieldChangeType, newType: FieldChangeType): FieldChangeType {
  if (hasNoValue(newType)) {
    return oldType;
  }
  if (hasNoValue(oldType)) {
    return newType;
  }
  return oldType.valueOf() > newType.valueOf() ? oldType : newType;
}

/**
 * Set the editable state of a specific action's url and uuid to false or true
 * @param state The current state
 * @param action The action to perform on the current state
 */
function setEditableFieldUpdate(state: any, action: SetEditableFieldUpdateAction) {
  const url: string = action.payload.url;
  const uuid: string = action.payload.uuid;
  const editable: boolean = action.payload.editable;

  const pageState: ObjectUpdatesEntry = state[url];

  const fieldState = pageState.fieldStates[uuid];
  const newFieldState = Object.assign({}, fieldState, { editable });

  const newFieldStates = Object.assign({}, pageState.fieldStates, { [uuid]: newFieldState });

  const newPageState = Object.assign({}, pageState, { fieldStates: newFieldStates });

  return Object.assign({}, state, { [url]: newPageState });
}

/**
 * Set the isValid state of a specific action's url and uuid to false or true
 * @param state The current state
 * @param action The action to perform on the current state
 */
function setValidFieldUpdate(state: any, action: SetValidFieldUpdateAction) {
  const url: string = action.payload.url;
  const uuid: string = action.payload.uuid;
  const isValid: boolean = action.payload.isValid;

  const pageState: ObjectUpdatesEntry = state[url];

  const fieldState = pageState.fieldStates[uuid];
  const newFieldState = Object.assign({}, fieldState, { isValid });

  const newFieldStates = Object.assign({}, pageState.fieldStates, { [uuid]: newFieldState });

  const newPageState = Object.assign({}, pageState, { fieldStates: newFieldStates });

  return Object.assign({}, state, { [url]: newPageState });
}

/**
 * Method to create an initial FieldStates object based on a list of Identifiable objects
 * @param fields Identifiable objects
 */
function createInitialFieldStates(fields: Identifiable[]) {
  const uuids = fields.map((field: Identifiable) => field.uuid);
  const fieldStates = {};
  uuids.forEach((uuid: string) => fieldStates[uuid] = initialFieldState);
  return fieldStates;
}

/**
 * Method to add a list of objects to an existing FieldStates object
 * @param fieldStates                   FieldStates to add states to
 * @param fields Identifiable objects   The list of objects to add to the FieldStates
 */
function addFieldStates(fieldStates: FieldStates, fields: Identifiable[]) {
  const uuids = fields.map((field: Identifiable) => field.uuid);
  uuids.forEach((uuid: string) => fieldStates[uuid] = initialFieldState);
  return fieldStates;
}

/**
 * Move an object within the custom order of a page state
 * @param state   The current state
 * @param action  The move action to perform
 */
function moveFieldUpdate(state: any, action: MoveFieldUpdateAction) {
  const url = action.payload.url;
  const fromIndex = action.payload.from;
  const toIndex = action.payload.to;
  const fromPage = action.payload.fromPage;
  const toPage = action.payload.toPage;
  const field = action.payload.field;

  const pageState: ObjectUpdatesEntry = state[url];
  const initialOrderPages = pageState.customOrder.initialOrderPages;
  const customOrderPages = [...pageState.customOrder.newOrderPages];

  // Create a copy of the custom orders for the from- and to-pages
  const fromPageOrder = [...customOrderPages[fromPage].order];
  const toPageOrder = [...customOrderPages[toPage].order];
  if (fromPage === toPage) {
    if (isNotEmpty(customOrderPages[fromPage]) && isNotEmpty(customOrderPages[fromPage].order[fromIndex]) && isNotEmpty(customOrderPages[fromPage].order[toIndex])) {
      // Move an item from one index to another within the same page
      moveItemInArray(fromPageOrder, fromIndex, toIndex);
      // Update the custom order for this page
      customOrderPages[fromPage] = { order: fromPageOrder };
    }
  } else {
    if (isNotEmpty(customOrderPages[fromPage]) && hasValue(customOrderPages[toPage]) && isNotEmpty(customOrderPages[fromPage].order[fromIndex])) {
      // Move an item from one index of one page to an index in another page
      transferArrayItem(fromPageOrder, toPageOrder, fromIndex, toIndex);
      // Update the custom order for both pages
      customOrderPages[fromPage] = { order: fromPageOrder };
      customOrderPages[toPage] = { order: toPageOrder };
    }
  }

  // Create a field update if it doesn't exist for this field yet
  let fieldUpdate = {};
  if (hasValue(field)) {
    fieldUpdate = pageState.fieldUpdates[field.uuid];
    if (hasNoValue(fieldUpdate)) {
      fieldUpdate = { field: field, changeType: undefined }
    }
  }

  // Update the store's state with new values and return
  return Object.assign({}, state, { [url]: Object.assign({}, pageState, {
    fieldUpdates: Object.assign({}, pageState.fieldUpdates, hasValue(field) ? { [field.uuid]: fieldUpdate } : {}),
    customOrder: Object.assign({}, pageState.customOrder, { newOrderPages: customOrderPages, changed: checkForOrderChanges(initialOrderPages, customOrderPages) })
  })})
}

/**
 * Compare two lists of OrderPage objects and return whether there's at least one change in the order of objects within
 * @param initialOrderPages The initial list of OrderPages
 * @param customOrderPages  The changed list of OrderPages
 */
function checkForOrderChanges(initialOrderPages: OrderPage[], customOrderPages: OrderPage[]) {
  let changed = false;
  initialOrderPages.forEach((orderPage: OrderPage, page: number) => {
    if (isNotEmpty(orderPage) && isNotEmpty(orderPage.order) && isNotEmpty(customOrderPages[page]) && isNotEmpty(customOrderPages[page].order)) {
      orderPage.order.forEach((id: string, index: number) => {
        if (id !== customOrderPages[page].order[index]) {
          changed = true;
          return;
        }
      });
      if (changed) {
        return;
      }
    }
  });
  return changed;
}

/**
 * Initialize a custom order page by providing the list of all pages, a list of UUIDs, pageSize and the page to populate
 * @param initialPages  The initial list of OrderPage objects
 * @param order         The list of UUIDs to create a page for
 * @param pageSize      The pageSize used to populate empty spacer pages
 * @param page          The index of the page to add
 */
function addOrderToPages(initialPages: OrderPage[], order: string[], pageSize: number, page: number): OrderPage[] {
  const result = [...initialPages];
  const orderPage: OrderPage = { order: order };
  if (page < result.length) {
    // The page we're trying to add already exists in the list. Overwrite it.
    result[page] = orderPage;
  } else if (page === result.length) {
    // The page we're trying to add is the next page in the list, add it.
    result.push(orderPage);
  } else {
    // The page we're trying to add is at least one page ahead of the list, fill the list with empty pages before adding the page.
    const emptyOrder = [];
    for (let i = 0; i < pageSize; i++) {
      emptyOrder.push(undefined);
    }
    const emptyOrderPage: OrderPage = { order: emptyOrder };
    for (let i = result.length; i < page; i++) {
      result.push(emptyOrderPage);
    }
    result.push(orderPage);
  }
  return result;
}
