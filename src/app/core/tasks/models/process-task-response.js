/**
 * A class to represent the data retrieved by after processing a task
 */
var ProcessTaskResponse = /** @class */ (function () {
    function ProcessTaskResponse(isSuccessful, error, payload) {
        this.isSuccessful = isSuccessful;
        this.error = error;
        this.payload = payload;
    }
    Object.defineProperty(ProcessTaskResponse.prototype, "hasSucceeded", {
        get: function () {
            return this.isSuccessful;
        },
        enumerable: true,
        configurable: true
    });
    return ProcessTaskResponse;
}());
export { ProcessTaskResponse };
//# sourceMappingURL=process-task-response.js.map