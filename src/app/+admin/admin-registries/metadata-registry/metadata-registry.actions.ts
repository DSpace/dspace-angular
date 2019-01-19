import {Action} from '@ngrx/store';
import {type} from "../../../shared/ngrx/type";
import {MetadataSchema} from "../../../core/metadata/metadataschema.model";
import {MetadataField} from "../../../core/metadata/metadatafield.model";

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const MetadataRegistryActionTypes = {
  
  EDIT_SCHEMA: type('dspace/metadata-registry/EDIT_SCHEMA'),
  CANCEL_EDIT_SCHEMA: type('dspace/metadata-registry/CANCEL_SCHEMA'),
  SELECT_SCHEMA: type('dspace/metadata-registry/SELECT_SCHEMA'),
  DESELECT_SCHEMA: type('dspace/metadata-registry/DESELECT_SCHEMA'),

  EDIT_FIELD : type('dspace/metadata-registry/EDIT_FIELD'),
  CANCEL_EDIT_FIELD : type('dspace/metadata-registry/CANCEL_FIELD'),
  SELECT_FIELD : type('dspace/metadata-registry/SELECT_FIELD'),
  DESELECT_FIELD : type('dspace/metadata-registry/DESELEC_FIELDT')
};

/* tslint:disable:max-classes-per-file */
/**
 * Used to collapse the sidebar
 */
export class MetadataRegistryEditSchemaAction implements Action {
  type = MetadataRegistryActionTypes.EDIT_SCHEMA;

  schema: MetadataSchema;

  constructor(registry: MetadataSchema) {
    this.schema = registry;
  }
}

/**
 * Used to expand the sidebar
 */
export class MetadataRegistryCancelSchemaAction implements Action {
  type = MetadataRegistryActionTypes.CANCEL_EDIT_SCHEMA;
}

export class MetadataRegistrySelectSchemaAction implements Action {
  type = MetadataRegistryActionTypes.SELECT_SCHEMA;

  schema: MetadataSchema;

  constructor(registry: MetadataSchema) {
    this.schema = registry;
  }
}

export class MetadataRegistryDeselectSchemaAction implements Action {
  type = MetadataRegistryActionTypes.DESELECT_SCHEMA;

  schema: MetadataSchema;

  constructor(registry: MetadataSchema) {
    this.schema = registry;
  }
}

/**
 * Used to collapse the sidebar
 */
export class MetadataRegistryEditFieldAction implements Action {
  type = MetadataRegistryActionTypes.EDIT_FIELD;

  field: MetadataField;

  constructor(registry: MetadataField) {
    this.field = registry;
  }
}

/**
 * Used to expand the sidebar
 */
export class MetadataRegistryCancelFieldAction implements Action {
  type = MetadataRegistryActionTypes.CANCEL_EDIT_FIELD;
}

export class MetadataRegistrySelectFieldAction implements Action {
  type = MetadataRegistryActionTypes.SELECT_FIELD;

  field: MetadataField;

  constructor(registry: MetadataField) {
    this.field = registry;
  }
}

export class MetadataRegistryDeselectFieldAction implements Action {
  type = MetadataRegistryActionTypes.DESELECT_FIELD;

  field: MetadataField;

  constructor(registry: MetadataField) {
    this.field = registry;
  }
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type MetadataRegistryAction
  = MetadataRegistryEditSchemaAction
  | MetadataRegistryCancelSchemaAction
  | MetadataRegistrySelectSchemaAction
  | MetadataRegistryDeselectSchemaAction
  | MetadataRegistryEditFieldAction
  | MetadataRegistryCancelFieldAction
  | MetadataRegistrySelectFieldAction
  | MetadataRegistryDeselectFieldAction;
