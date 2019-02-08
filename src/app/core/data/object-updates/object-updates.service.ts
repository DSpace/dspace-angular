import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { coreSelector, CoreState } from '../../core.reducers';
import {
  FieldUpdates,
  Identifiable, OBJECT_UPDATES_TRASH_PATH,
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
  SetEditableFieldUpdateAction
} from './object-updates.actions';
import { filter, map } from 'rxjs/operators';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { INotification } from '../../../shared/notifications/models/notification.model';

function objectUpdatesStateSelector(): MemoizedSelector<CoreState, ObjectUpdatesState> {
  return createSelector(coreSelector, (state: CoreState) => state['cache/object-updates']);
}

function filterByUrlObjectUpdatesStateSelector(url: string): MemoizedSelector<CoreState, ObjectUpdatesEntry> {
  return createSelector(objectUpdatesStateSelector(), (state: ObjectUpdatesState) => state[url]);
}

@Injectable()
export class ObjectUpdatesService {
  constructor(private store: Store<CoreState>) {

  }

  initialize(url, fields: Identifiable[], lastModified: Date): void {
    this.store.dispatch(new InitializeFieldsAction(url, fields, lastModified));
  }

  private saveFieldUpdate(url: string, field: Identifiable, changeType: FieldChangeType) {
    this.store.dispatch(new AddFieldUpdateAction(url, field, changeType))
  }

  private getObjectEntry(url: string): Observable<ObjectUpdatesEntry> {
    return this.store.pipe(select(filterByUrlObjectUpdatesStateSelector(url)));
  }

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

  isEditable(url: string, uuid: string): Observable<boolean> {
    const objectUpdates = this.getObjectEntry(url);
    return objectUpdates.pipe(
      filter((objectEntry) => hasValue(objectEntry.fieldStates[uuid])),
      map((objectEntry) => objectEntry.fieldStates[uuid].editable
      )
    )
  }

  saveAddFieldUpdate(url: string, field: Identifiable) {
    this.saveFieldUpdate(url, field, FieldChangeType.ADD);
  }

  saveRemoveFieldUpdate(url: string, field: Identifiable) {
    this.saveFieldUpdate(url, field, FieldChangeType.REMOVE);
  }

  saveChangeFieldUpdate(url: string, field: Identifiable) {
    this.saveFieldUpdate(url, field, FieldChangeType.UPDATE);
  }

  setEditableFieldUpdate(url: string, uuid: string, editable: boolean) {
    this.store.dispatch(new SetEditableFieldUpdateAction(url, uuid, editable));
  }

  discardFieldUpdates(url: string, undoNotification: INotification) {
    this.store.dispatch(new DiscardObjectUpdatesAction(url, undoNotification));
  }

  reinstateFieldUpdates(url: string) {
    this.store.dispatch(new ReinstateObjectUpdatesAction(url));
  }

  removeSingleFieldUpdate(url: string, uuid) {
    this.store.dispatch(new RemoveFieldUpdateAction(url, uuid));
  }

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

  hasUpdates(url: string): Observable<boolean> {
    return this.getObjectEntry(url).pipe(map((objectEntry) => hasValue(objectEntry) && isNotEmpty(objectEntry.fieldUpdates)));
  }

  isReinstatable(route: string): Observable<boolean> {
    return this.hasUpdates(route + OBJECT_UPDATES_TRASH_PATH)
  }

  getLastModified(url: string): Observable<Date> {
    return this.getObjectEntry(url).pipe(map((entry: ObjectUpdatesEntry) => entry.lastModified));
  }
}
