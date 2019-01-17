import {MetadataSchema} from "../../../core/metadata/metadataschema.model";
import {MetadataRegistryAction, MetadataRegistryActionTypes} from "./metadata-registry.actions";

/**
 * The auth state.
 * @interface State
 */
export interface MetadataRegistryState {
  schema: MetadataSchema;
}

/**
 * The initial state.
 */
const initialState: MetadataRegistryState = {schema: null};

export function metadataRegistryReducer(state: any = initialState, action: MetadataRegistryAction): MetadataRegistryState {

  switch (action.type) {

    case MetadataRegistryActionTypes.SELECT: {
      return Object.assign({}, state, {
        schema: state.payload
      });
    }

    case MetadataRegistryActionTypes.CANCEL: {
      return Object.assign({}, state, {
        schema: null
      });
    }

    default:
      return state;
  }
}