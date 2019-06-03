import { MetadataRegistryActionTypes } from './metadata-registry.actions';
/**
 * The initial state.
 */
var initialState = {
    editSchema: null,
    selectedSchemas: [],
    editField: null,
    selectedFields: []
};
/**
 * Reducer that handles MetadataRegistryActions to modify metadata schema and/or field states
 * @param state   The current MetadataRegistryState
 * @param action  The MetadataRegistryAction to perform on the state
 */
export function metadataRegistryReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case MetadataRegistryActionTypes.EDIT_SCHEMA: {
            return Object.assign({}, state, {
                editSchema: action.schema
            });
        }
        case MetadataRegistryActionTypes.CANCEL_EDIT_SCHEMA: {
            return Object.assign({}, state, {
                editSchema: null
            });
        }
        case MetadataRegistryActionTypes.SELECT_SCHEMA: {
            return Object.assign({}, state, {
                selectedSchemas: state.selectedSchemas.concat([action.schema])
            });
        }
        case MetadataRegistryActionTypes.DESELECT_SCHEMA: {
            return Object.assign({}, state, {
                selectedSchemas: state.selectedSchemas.filter(function (selectedSchema) { return selectedSchema !== action.schema; })
            });
        }
        case MetadataRegistryActionTypes.DESELECT_ALL_SCHEMA: {
            return Object.assign({}, state, {
                selectedSchemas: []
            });
        }
        case MetadataRegistryActionTypes.EDIT_FIELD: {
            return Object.assign({}, state, {
                editField: action.field
            });
        }
        case MetadataRegistryActionTypes.CANCEL_EDIT_FIELD: {
            return Object.assign({}, state, {
                editField: null
            });
        }
        case MetadataRegistryActionTypes.SELECT_FIELD: {
            return Object.assign({}, state, {
                selectedFields: state.selectedFields.concat([action.field])
            });
        }
        case MetadataRegistryActionTypes.DESELECT_FIELD: {
            return Object.assign({}, state, {
                selectedFields: state.selectedFields.filter(function (selectedField) { return selectedField !== action.field; })
            });
        }
        case MetadataRegistryActionTypes.DESELECT_ALL_FIELD: {
            return Object.assign({}, state, {
                selectedFields: []
            });
        }
        default:
            return state;
    }
}
//# sourceMappingURL=metadata-registry.reducers.js.map