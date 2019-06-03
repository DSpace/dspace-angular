import { hasValue } from '../../shared/empty.util';
export var RemoteDataState;
(function (RemoteDataState) {
    RemoteDataState["RequestPending"] = "RequestPending";
    RemoteDataState["ResponsePending"] = "ResponsePending";
    RemoteDataState["Failed"] = "Failed";
    RemoteDataState["Success"] = "Success";
})(RemoteDataState || (RemoteDataState = {}));
/**
 * A class to represent the state of a remote resource
 */
var RemoteData = /** @class */ (function () {
    function RemoteData(requestPending, responsePending, isSuccessful, error, payload) {
        this.requestPending = requestPending;
        this.responsePending = responsePending;
        this.isSuccessful = isSuccessful;
        this.error = error;
        this.payload = payload;
    }
    Object.defineProperty(RemoteData.prototype, "state", {
        get: function () {
            if (this.isSuccessful === true && hasValue(this.payload)) {
                return RemoteDataState.Success;
            }
            else if (this.isSuccessful === false) {
                return RemoteDataState.Failed;
            }
            else if (this.requestPending === true) {
                return RemoteDataState.RequestPending;
            }
            else {
                return RemoteDataState.ResponsePending;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoteData.prototype, "isRequestPending", {
        get: function () {
            return this.state === RemoteDataState.RequestPending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoteData.prototype, "isResponsePending", {
        get: function () {
            return this.state === RemoteDataState.ResponsePending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoteData.prototype, "isLoading", {
        get: function () {
            return this.state === RemoteDataState.RequestPending
                || this.state === RemoteDataState.ResponsePending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoteData.prototype, "hasFailed", {
        get: function () {
            return this.state === RemoteDataState.Failed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoteData.prototype, "hasSucceeded", {
        get: function () {
            return this.state === RemoteDataState.Success;
        },
        enumerable: true,
        configurable: true
    });
    return RemoteData;
}());
export { RemoteData };
//# sourceMappingURL=remote-data.js.map