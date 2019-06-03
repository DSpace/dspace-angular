/**
 * Represents all JSON Patch operations type.
 */
export var JsonPatchOperationType;
(function (JsonPatchOperationType) {
    JsonPatchOperationType["test"] = "test";
    JsonPatchOperationType["remove"] = "remove";
    JsonPatchOperationType["add"] = "add";
    JsonPatchOperationType["replace"] = "replace";
    JsonPatchOperationType["move"] = "move";
    JsonPatchOperationType["copy"] = "copy";
})(JsonPatchOperationType || (JsonPatchOperationType = {}));
/**
 * Represents a JSON Patch operations.
 */
var JsonPatchOperationModel = /** @class */ (function () {
    function JsonPatchOperationModel() {
    }
    return JsonPatchOperationModel;
}());
export { JsonPatchOperationModel };
//# sourceMappingURL=json-patch.model.js.map