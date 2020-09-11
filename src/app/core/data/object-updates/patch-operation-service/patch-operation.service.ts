import { FieldUpdate, Identifiable } from '../object-updates.reducer';
import { Operation } from 'fast-json-patch';

export interface PatchOperationService<T extends Identifiable> {
  fieldUpdateToPatchOperation(fieldUpdate: FieldUpdate): Operation;
}
