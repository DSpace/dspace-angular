import { merge as observableMerge, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, find, flatMap, map, partition, take, tap } from 'rxjs/operators';
import { hasValue, isEmpty, isNotEmpty, isNotUndefined, isUndefined } from '../../shared/empty.util';
import { jsonPatchOperationsByResourceType } from './selectors';
import { CommitPatchOperationsAction, RollbacktPatchOperationsAction, StartTransactionPatchOperationsAction } from './json-patch-operations.actions';
import { getResponseFromEntry } from '../shared/operators';
/**
 * An abstract class that provides methods to make JSON Patch requests.
 */
var JsonPatchOperationsService = /** @class */ (function () {
    function JsonPatchOperationsService() {
    }
    /**
     * Submit a new JSON Patch request with all operations stored in the state that are ready to be dispatched
     *
     * @param hrefObs
     *    Observable of request href
     * @param resourceType
     *    The resource type value
     * @param resourceId
     *    The resource id value
     * @return Observable<ResponseDefinitionDomain>
     *    observable of response
     */
    JsonPatchOperationsService.prototype.submitJsonPatchOperations = function (hrefObs, resourceType, resourceId) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        var startTransactionTime = null;
        var _a = partition(function (request) { return isNotEmpty(request.body); })(hrefObs.pipe(flatMap(function (endpointURL) {
            return _this.store.select(jsonPatchOperationsByResourceType(resourceType)).pipe(take(1), filter(function (operationsList) { return isUndefined(operationsList) || !(operationsList.commitPending); }), tap(function () { return startTransactionTime = new Date().getTime(); }), map(function (operationsList) {
                var body = [];
                if (isNotEmpty(operationsList)) {
                    if (isNotEmpty(resourceId)) {
                        if (isNotUndefined(operationsList.children[resourceId]) && isNotEmpty(operationsList.children[resourceId].body)) {
                            operationsList.children[resourceId].body.forEach(function (entry) {
                                body.push(entry.operation);
                            });
                        }
                    }
                    else {
                        Object.keys(operationsList.children)
                            .filter(function (key) { return operationsList.children.hasOwnProperty(key); })
                            .filter(function (key) { return hasValue(operationsList.children[key]); })
                            .filter(function (key) { return hasValue(operationsList.children[key].body); })
                            .forEach(function (key) {
                            operationsList.children[key].body.forEach(function (entry) {
                                body.push(entry.operation);
                            });
                        });
                    }
                }
                return _this.getRequestInstance(requestId, endpointURL, body);
            }));
        }))), patchRequest$ = _a[0], emptyRequest$ = _a[1];
        return observableMerge(emptyRequest$.pipe(filter(function (request) { return isEmpty(request.body); }), tap(function () { return startTransactionTime = null; }), map(function () { return null; })), patchRequest$.pipe(filter(function (request) { return isNotEmpty(request.body); }), tap(function () { return _this.store.dispatch(new StartTransactionPatchOperationsAction(resourceType, resourceId, startTransactionTime)); }), tap(function (request) { return _this.requestService.configure(request); }), flatMap(function () {
            var _a = partition(function (response) { return response.isSuccessful; })(_this.requestService.getByUUID(requestId).pipe(getResponseFromEntry(), find(function (entry) { return startTransactionTime < entry.timeAdded; }), map(function (entry) { return entry; }))), successResponse$ = _a[0], errorResponse$ = _a[1];
            return observableMerge(errorResponse$.pipe(tap(function () { return _this.store.dispatch(new RollbacktPatchOperationsAction(resourceType, resourceId)); }), flatMap(function (error) { return observableThrowError(error); })), successResponse$.pipe(filter(function (response) { return isNotEmpty(response); }), tap(function () { return _this.store.dispatch(new CommitPatchOperationsAction(resourceType, resourceId)); }), map(function (response) { return response.dataDefinition; }), distinctUntilChanged()));
        })));
    };
    /**
     * Return an instance for RestRequest class
     *
     * @param uuid
     *    The request uuid
     * @param href
     *    The request href
     * @param body
     *    The request body
     * @return Object<PatchRequestDefinition>
     *    instance of PatchRequestDefinition
     */
    JsonPatchOperationsService.prototype.getRequestInstance = function (uuid, href, body) {
        return new this.patchRequestConstructor(uuid, href, body);
    };
    JsonPatchOperationsService.prototype.getEndpointByIDHref = function (endpoint, resourceID) {
        return isNotEmpty(resourceID) ? endpoint + "/" + resourceID : "" + endpoint;
    };
    /**
     * Make a new JSON Patch request with all operations related to the specified resource type
     *
     * @param linkPath
     *    The link path of the request
     * @param scopeId
     *    The scope id
     * @param resourceType
     *    The resource type value
     * @return Observable<ResponseDefinitionDomain>
     *    observable of response
     */
    JsonPatchOperationsService.prototype.jsonPatchByResourceType = function (linkPath, scopeId, resourceType) {
        var _this = this;
        var href$ = this.halService.getEndpoint(linkPath).pipe(filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return _this.getEndpointByIDHref(endpointURL, scopeId); }));
        return this.submitJsonPatchOperations(href$, resourceType);
    };
    /**
     * Make a new JSON Patch request with all operations related to the specified resource id
     *
     * @param linkPath
     *    The link path of the request
     * @param scopeId
     *    The scope id
     * @param resourceType
     *    The resource type value
     * @param resourceId
     *    The resource id value
     * @return Observable<ResponseDefinitionDomain>
     *    observable of response
     */
    JsonPatchOperationsService.prototype.jsonPatchByResourceID = function (linkPath, scopeId, resourceType, resourceId) {
        var _this = this;
        var hrefObs = this.halService.getEndpoint(linkPath).pipe(filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return _this.getEndpointByIDHref(endpointURL, scopeId); }));
        return this.submitJsonPatchOperations(hrefObs, resourceType, resourceId);
    };
    return JsonPatchOperationsService;
}());
export { JsonPatchOperationsService };
//# sourceMappingURL=json-patch-operations.service.js.map