import { type } from '../../../shared/ngrx/type';
/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 *
 * The 'type' utility function coerces strings into string
 * literal types and runs a simple check to guarantee all
 * action types in the application are unique.
 */
export var MetadataRegistryActionTypes = {
    EDIT_SCHEMA: type('dspace/metadata-registry/EDIT_SCHEMA'),
    CANCEL_EDIT_SCHEMA: type('dspace/metadata-registry/CANCEL_SCHEMA'),
    SELECT_SCHEMA: type('dspace/metadata-registry/SELECT_SCHEMA'),
    DESELECT_SCHEMA: type('dspace/metadata-registry/DESELECT_SCHEMA'),
    DESELECT_ALL_SCHEMA: type('dspace/metadata-registry/DESELECT_ALL_SCHEMA'),
    EDIT_FIELD: type('dspace/metadata-registry/EDIT_FIELD'),
    CANCEL_EDIT_FIELD: type('dspace/metadata-registry/CANCEL_FIELD'),
    SELECT_FIELD: type('dspace/metadata-registry/SELECT_FIELD'),
    DESELECT_FIELD: type('dspace/metadata-registry/DESELECT_FIELD'),
    DESELECT_ALL_FIELD: type('dspace/metadata-registry/DESELECT_ALL_FIELD')
};
/* tslint:disable:max-classes-per-file */
/**
 * Used to edit a metadata schema in the metadata registry
 */
var MetadataRegistryEditSchemaAction = /** @class */ (function () {
    function MetadataRegistryEditSchemaAction(registry) {
        this.type = MetadataRegistryActionTypes.EDIT_SCHEMA;
        this.schema = registry;
    }
    return MetadataRegistryEditSchemaAction;
}());
export { MetadataRegistryEditSchemaAction };
/**
 * Used to cancel the editing of a metadata schema in the metadata registry
 */
var MetadataRegistryCancelSchemaAction = /** @class */ (function () {
    function MetadataRegistryCancelSchemaAction() {
        this.type = MetadataRegistryActionTypes.CANCEL_EDIT_SCHEMA;
    }
    return MetadataRegistryCancelSchemaAction;
}());
export { MetadataRegistryCancelSchemaAction };
/**
 * Used to select a single metadata schema in the metadata registry
 */
var MetadataRegistrySelectSchemaAction = /** @class */ (function () {
    function MetadataRegistrySelectSchemaAction(registry) {
        this.type = MetadataRegistryActionTypes.SELECT_SCHEMA;
        this.schema = registry;
    }
    return MetadataRegistrySelectSchemaAction;
}());
export { MetadataRegistrySelectSchemaAction };
/**
 * Used to deselect a single metadata schema in the metadata registry
 */
var MetadataRegistryDeselectSchemaAction = /** @class */ (function () {
    function MetadataRegistryDeselectSchemaAction(registry) {
        this.type = MetadataRegistryActionTypes.DESELECT_SCHEMA;
        this.schema = registry;
    }
    return MetadataRegistryDeselectSchemaAction;
}());
export { MetadataRegistryDeselectSchemaAction };
/**
 * Used to deselect all metadata schemas in the metadata registry
 */
var MetadataRegistryDeselectAllSchemaAction = /** @class */ (function () {
    function MetadataRegistryDeselectAllSchemaAction() {
        this.type = MetadataRegistryActionTypes.DESELECT_ALL_SCHEMA;
    }
    return MetadataRegistryDeselectAllSchemaAction;
}());
export { MetadataRegistryDeselectAllSchemaAction };
/**
 * Used to edit a metadata field in the metadata registry
 */
var MetadataRegistryEditFieldAction = /** @class */ (function () {
    function MetadataRegistryEditFieldAction(registry) {
        this.type = MetadataRegistryActionTypes.EDIT_FIELD;
        this.field = registry;
    }
    return MetadataRegistryEditFieldAction;
}());
export { MetadataRegistryEditFieldAction };
/**
 * Used to cancel the editing of a metadata field in the metadata registry
 */
var MetadataRegistryCancelFieldAction = /** @class */ (function () {
    function MetadataRegistryCancelFieldAction() {
        this.type = MetadataRegistryActionTypes.CANCEL_EDIT_FIELD;
    }
    return MetadataRegistryCancelFieldAction;
}());
export { MetadataRegistryCancelFieldAction };
/**
 * Used to select a single metadata field in the metadata registry
 */
var MetadataRegistrySelectFieldAction = /** @class */ (function () {
    function MetadataRegistrySelectFieldAction(registry) {
        this.type = MetadataRegistryActionTypes.SELECT_FIELD;
        this.field = registry;
    }
    return MetadataRegistrySelectFieldAction;
}());
export { MetadataRegistrySelectFieldAction };
/**
 * Used to deselect a single metadata field in the metadata registry
 */
var MetadataRegistryDeselectFieldAction = /** @class */ (function () {
    function MetadataRegistryDeselectFieldAction(registry) {
        this.type = MetadataRegistryActionTypes.DESELECT_FIELD;
        this.field = registry;
    }
    return MetadataRegistryDeselectFieldAction;
}());
export { MetadataRegistryDeselectFieldAction };
/**
 * Used to deselect all metadata fields in the metadata registry
 */
var MetadataRegistryDeselectAllFieldAction = /** @class */ (function () {
    function MetadataRegistryDeselectAllFieldAction() {
        this.type = MetadataRegistryActionTypes.DESELECT_ALL_FIELD;
    }
    return MetadataRegistryDeselectAllFieldAction;
}());
export { MetadataRegistryDeselectAllFieldAction };
//# sourceMappingURL=metadata-registry.actions.js.map