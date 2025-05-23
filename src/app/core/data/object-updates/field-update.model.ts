import { FieldChangeType } from './field-change-type.model';
import { Identifiable } from './identifiable.model';

/**
 * The state of a single field update
 */
export interface FieldUpdate {
  field: Identifiable;
  changeType: FieldChangeType;
}
