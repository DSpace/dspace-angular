import {Action} from '@ngrx/store';
import {type} from "../../../shared/ngrx/type";
import {MetadataSchema} from "../../../core/metadata/metadataschema.model";

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export const MetadataRegistryActionTypes = {
  SELECT: type('dspace/metadata-registry/COLLAPSE'),
  CANCEL: type('dspace/metadata-registry/EXPAND')
};

/* tslint:disable:max-classes-per-file */
/**
 * Used to collapse the sidebar
 */
export class MetadataRegistrySelectAction implements Action {
  private registry: MetadataSchema;

  constructor(registry: MetadataSchema) {
    this.registry = registry;
  }

  type = MetadataRegistryActionTypes.SELECT;
}

/**
 * Used to expand the sidebar
 */
export class MetadataRegistryCancelAction implements Action {
  type = MetadataRegistryActionTypes.CANCEL;
}

/* tslint:enable:max-classes-per-file */

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type MetadataRegistryAction
  = MetadataRegistrySelectAction
  | MetadataRegistryCancelAction
