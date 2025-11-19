/* eslint-disable no-empty, @typescript-eslint/no-empty-function */
import {
  Observable,
  of,
} from 'rxjs';

import { FieldUpdates } from '../data/object-updates/field-updates.model';
import { Identifiable } from '../data/object-updates/identifiable.model';
import { PatchOperationService } from '../data/object-updates/patch-operation-service/patch-operation.service';
import { GenericConstructor } from '../shared/generic-constructor';

/**
 * Stub class of {@link ObjectUpdatesService}
 */
export class ObjectUpdatesServiceStub {

  initialize(_url: string, _fields: Identifiable[], _lastModified: Date, _patchOperationService?: GenericConstructor<PatchOperationService>): void {
  }

  getFieldUpdates(_url: string, _initialFields: Identifiable[], _ignoreStates?: boolean): Observable<FieldUpdates> {
    return of({});
  }

}
