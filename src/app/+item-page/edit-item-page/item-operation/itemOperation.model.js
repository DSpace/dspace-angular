/**
 *  Represents an item operation used on the edit item page with a key, an operation URL to which will be navigated
 *  when performing the action and an option to disable the operation.
 */
var ItemOperation = /** @class */ (function () {
    function ItemOperation(operationKey, operationUrl) {
        this.operationKey = operationKey;
        this.operationUrl = operationUrl;
        this.setDisabled(false);
    }
    /**
     * Set whether this operation should be disabled
     * @param disabled
     */
    ItemOperation.prototype.setDisabled = function (disabled) {
        this.disabled = disabled;
    };
    return ItemOperation;
}());
export { ItemOperation };
//# sourceMappingURL=itemOperation.model.js.map