import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { CoreState } from '../../core.reducers';
import { coreSelector } from '../../core.selectors';
import {
  FieldState,
  FieldUpdates,
  Identifiable,
  OBJECT_UPDATES_TRASH_PATH,
  ObjectUpdatesEntry,
  ObjectUpdatesState
} from './object-updates.reducer';
import { Observable } from 'rxjs';
import {
  AddFieldUpdateAction,
  DiscardObjectUpdatesAction,
  FieldChangeType,
  InitializeFieldsAction,
  ReinstateObjectUpdatesAction,
  RemoveFieldUpdateAction,
  SetEditableFieldUpdateAction,
  SetValidFieldUpdateAction
} from './object-updates.actions';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { INotification } from '../../../shared/notifications/models/notification.model';

function objectUpdatesStateSelector(): MemoizedSelector<CoreState, ObjectUpdatesState> {
  return createSelector(coreSelector, (state: CoreState) => state['cache/object-updates']);
}

function filterByUrlObjectUpdatesStateSelector(url: string): MemoizedSelector<CoreState, ObjectUpdatesEntry> {
  return createSelector(objectUpdatesStateSelector(), (state: ObjectUpdatesState) => state[url]);
}

function filterByUrlAndUUIDFieldStateSelector(url: string, uuid: string): MemoizedSelector<CoreState, FieldState> {
  return createSelector(filterByUrlObjectUpdatesStateSelector(url), (state: ObjectUpdatesEntry) => state.fieldStates[uuid]);
}

/**
 * Service that dispatches and reads from the ObjectUpdates' state in the store
 */
@Injectable()
export class ObjectUpdatesService {
  constructor(private store: Store<CoreState>) {

  }

  /**
   * Method to dispatch an InitializeFieldsAction to the store
   * @param url The page's URL for which the changes are being mapped
   * @param fields The initial fields for the page's object
   * @param lastModified The date the object was last modified
   */
  initialize(url, fields: Identifiable[], lastModified: Date): void {
    this.store.dispatch(new InitializeFieldsAction(url, fields, lastModified));
  }

  /**
   * Method to dispatch an AddFieldUpdateAction to the store
   * @param url The page's URL for which the changes are saved
   * @param field An updated field for the page's object
   * @param changeType The last type of change applied to this field
   */
  private saveFieldUpdate(url: string, field: Identifiable, changeType: FieldChangeType) {
    this.store.dispatch(new AddFieldUpdateAction(url, field, changeType))
  }

  /**
   * Request the ObjectUpdatesEntry state for a specific URL
   * @param url The URL to filter by
   */
  private getObjectEntry(url: string): Observable<ObjectUpdatesEntry> {
    return this.store.pipe(select(filterByUrlObjectUpdatesStateSelector(url)));
  }

  /**
   * Request the getFieldState state for a specific URL and UUID
   * @param url The URL to filter by
   * @param uuid The field's UUID to filter by
   */
  private getFieldState(url: string, uuid: string): Observable<FieldState> {
    return this.store.pipe(select(filterByUrlAndUUIDFieldStateSelector(url, uuid)));
  }

  /**
   * Method that combines the state's updates with the initial values (when there's no update) to create
   * a FieldUpdates object
   * @param url The URL of the page for which the FieldUpdates should be requested
   * @param initialFields The initial values of the fields
   */
  getFieldUpdates(url: string, initialFields: Identifiable[]): Observable<FieldUpdates> {
    const objectUpdates = this.getObjectEntry(url);
    return objectUpdates.pipe(map((objectEntry) => {
      const fieldUpdates: FieldUpdates = {};
      Object.keys(objectEntry.fieldStates).forEach((uuid) => {
        let fieldUpdate = objectEntry.fieldUpdates[uuid];
        if (isEmpty(fieldUpdate)) {
          const identifiable = initialFields.find((object: Identifiable) => object.uuid === uuid);
          fieldUpdate = { field: identifiable, changeType: undefined };
        }
        fieldUpdates[uuid] = fieldUpdate;
      });
      return fieldUpdates;
    }))
  }

  /**
   * Method that combines the state's updates (excluding updates that aren't part of the initialFields) with
   * the initial values (when there's no update) to create a FieldUpdates object
   * @param url The URL of the page for which the FieldUpdates should be requested
   * @param initialFields The initial values of the fields
   */
  getFieldUpdatesExclusive(url: string, initialFields: Identifiable[]): Observable<FieldUpdates> {
    const objectUpdates = this.getObjectEntry(url);
    return objectUpdates.pipe(map((objectEntry) => {
      const fieldUpdates: FieldUpdates = {};
      for (const object of initialFields) {
        let fieldUpdate = objectEntry.fieldUpdates[object.uuid];
        if (isEmpty(fieldUpdate)) {
          fieldUpdate = { field: object, changeType: undefined };
        }
        fieldUpdates[object.uuid] = fieldUpdate;
      }
      return fieldUpdates;
    }))
  }

  /**
   * Method to check if a specific field is currently editable in the store
   * @param url The URL of the page on which the field resides
   * @param uuid The UUID of the field
   */
  isEditable(url: string, uuid: string): Observable<boolean> {
    const fieldState$ = this.getFieldState(url, uuid);
    return fieldState$.pipe(
      filter((fieldState) => hasValue(fieldState)),
      map((fieldState) => fieldState.editable),
      distinctUntilChanged()
    )
  }

  /**
   * Method to check if a specific field is currently valid in the store
   * @param url The URL of the page on which the field resides
   * @param uuid The UUID of the field
   */
  isValid(url: string, uuid: string): Observable<boolean> {
    const fieldState$ = this.getFieldState(url, uuid);
    return fieldState$.pipe(
      filter((fieldState) => hasValue(fieldState)),
      map((fieldState) => fieldState.isValid),
      distinctUntilChanged()
    )
  }

  /**
   * Method to check if a specific page is currently valid in the store
   * @param url The URL of the page
   */
  isValidPage(url: string): Observable<boolean> {
    const objectUpdates = this.getObjectEntry(url);
    return objectUpdates.pipe(
      map((entry: ObjectUpdatesEntry) => {
        return Object.values(entry.fieldStates).findIndex((state: FieldState) => !state.isValid) < 0
      }),
      distinctUntilChanged()
    )
  }

  /**
   * Calls the saveFieldUpdate method with FieldChangeType.ADD
   * @param url The page's URL for which the changes are saved
   * @param field An updated field for the page's object
   */
  saveAddFieldUpdate(url: string, field: Identifiable) {
    this.saveFieldUpdate(url, field, FieldChangeType.ADD);
  }

  /**
   * Calls the saveFieldUpdate method with FieldChangeType.REMOVE
   * @param url The page's URL for which the changes are saved
   * @param field An updated field for the page's object
   */
  saveRemoveFieldUpdate(url: string, field: Identifiable) {
    this.saveFieldUpdate(url, field, FieldChangeType.REMOVE);
  }

  /**
   * Calls the saveFieldUpdate method with FieldChangeType.UPDATE
   * @param url The page's URL for which the changes are saved
   * @param field An updated field for the page's object
   */
  saveChangeFieldUpdate(url: string, field: Identifiable) {
    this.saveFieldUpdate(url, field, FieldChangeType.UPDATE);
  }

  /**
   * Dispatches a SetEditableFieldUpdateAction to the store to set a field's editable state
   * @param url The URL of the page on which the field resides
   * @param uuid The UUID of the field that should be set
   * @param editable The new value of editable in the store for this field
   */
  setEditableFieldUpdate(url: string, uuid: string, editable: boolean) {
    this.store.dispatch(new SetEditableFieldUpdateAction(url, uuid, editable));
  }

  /**
   * Dispatches a SetValidFieldUpdateAction to the store to set a field's isValid state
   * @param url The URL of the page on which the field resides
   * @param uuid The UUID of the field that should be set
   * @param valid The new value of isValid in the store for this field
   */
  setValidFieldUpdate(url: string, uuid: string, valid: boolean) {
    this.store.dispatch(new SetValidFieldUpdateAction(url, uuid, valid));
  }

  /**
   * Method to dispatch an DiscardObjectUpdatesAction to the store
   * @param url The page's URL for which the changes should be discarded
   * @param undoNotification The notification which is should possibly be canceled
   */
  discardFieldUpdates(url: string, undoNotification: INotification) {
    this.store.dispatch(new DiscardObjectUpdatesAction(url, undoNotification));
  }

  /**
   * Method to dispatch an ReinstateObjectUpdatesAction to the store
   * @param url The page's URL for which the changes should be reinstated
   */
  reinstateFieldUpdates(url: string) {
    this.store.dispatch(new ReinstateObjectUpdatesAction(url));
  }

  /**
   * Method to dispatch an RemoveFieldUpdateAction to the store
   * @param url The page's URL for which the changes should be removed
   * @param uuid The UUID of the field that should be set
   */
  removeSingleFieldUpdate(url: string, uuid) {
    this.store.dispatch(new RemoveFieldUpdateAction(url, uuid));
  }

  /**
   * Method that combines the state's updates with the initial values (when there's no update) to create
   * a list of updates fields
   * @param url The URL of the page for which the updated fields should be requested
   * @param initialFields The initial values of the fields
   */
  getUpdatedFields(url: string, initialFields: Identifiable[]): Observable<Identifiable[]> {
    const objectUpdates = this.getObjectEntry(url);
    return objectUpdates.pipe(map((objectEntry) => {
      const fields: Identifiable[] = [];
      Object.keys(objectEntry.fieldStates).forEach((uuid) => {
        const fieldUpdate = objectEntry.fieldUpdates[uuid];
        if (hasNoValue(fieldUpdate) || fieldUpdate.changeType !== FieldChangeType.REMOVE) {
          let field;
          if (isNotEmpty(fieldUpdate)) {
            field = fieldUpdate.field;
          } else {
            field = initialFields.find((object: Identifiable) => object.uuid === uuid);
          }
          fields.push(field);
        }
      });
      return fields;
    }))
  }

  /**
   * Checks if the page currently has updates in the store or not
   * @param url The page's url to check for in the store
   */
  hasUpdates(url: string): Observable<boolean> {
    return this.getObjectEntry(url).pipe(map((objectEntry) => hasValue(objectEntry) && isNotEmpty(objectEntry.fieldUpdates)));
  }

  /**
   * Checks if the page currently is reinstatable in the store or not
   * @param url The page's url to check for in the store
   */
  isReinstatable(url: string): Observable<boolean> {
    return this.hasUpdates(url + OBJECT_UPDATES_TRASH_PATH)
  }

  /**
   * Request the current lastModified date stored for the updates in the store
   * @param url The page's url to check for in the store
   */
  getLastModified(url: string): Observable<Date> {
    return this.getObjectEntry(url).pipe(map((entry: ObjectUpdatesEntry) => entry.lastModified));
  }
}
