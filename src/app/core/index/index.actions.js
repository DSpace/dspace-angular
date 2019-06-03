import { type } from '../../shared/ngrx/type';
/**
 * The list of HrefIndexAction type definitions
 */
export var IndexActionTypes = {
    ADD: type('dspace/core/index/ADD'),
    REMOVE_BY_VALUE: type('dspace/core/index/REMOVE_BY_VALUE'),
    REMOVE_BY_SUBSTRING: type('dspace/core/index/REMOVE_BY_SUBSTRING')
};
/* tslint:disable:max-classes-per-file */
/**
 * An ngrx action to add an value to the index
 */
var AddToIndexAction = /** @class */ (function () {
    /**
     * Create a new AddToIndexAction
     *
     * @param name
     *    the name of the index to add to
     * @param key
     *    the key to add
     * @param value
     *    the self link of the resource the key belongs to
     */
    function AddToIndexAction(name, key, value) {
        this.type = IndexActionTypes.ADD;
        this.payload = { name: name, key: key, value: value };
    }
    return AddToIndexAction;
}());
export { AddToIndexAction };
/**
 * An ngrx action to remove an value from the index
 */
var RemoveFromIndexByValueAction = /** @class */ (function () {
    /**
     * Create a new RemoveFromIndexByValueAction
     *
     * @param name
     *    the name of the index to remove from
     * @param value
     *    the value to remove the UUID for
     */
    function RemoveFromIndexByValueAction(name, value) {
        this.type = IndexActionTypes.REMOVE_BY_VALUE;
        this.payload = { name: name, value: value };
    }
    return RemoveFromIndexByValueAction;
}());
export { RemoveFromIndexByValueAction };
/**
 * An ngrx action to remove multiple values from the index by substring
 */
var RemoveFromIndexBySubstringAction = /** @class */ (function () {
    /**
     * Create a new RemoveFromIndexByValueAction
     *
     * @param name
     *    the name of the index to remove from
     * @param value
     *    the value to remove the UUID for
     */
    function RemoveFromIndexBySubstringAction(name, value) {
        this.type = IndexActionTypes.REMOVE_BY_SUBSTRING;
        this.payload = { name: name, value: value };
    }
    return RemoveFromIndexBySubstringAction;
}());
export { RemoveFromIndexBySubstringAction };
//# sourceMappingURL=index.actions.js.map