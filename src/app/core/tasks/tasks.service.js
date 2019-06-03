import * as tslib_1 from "tslib";
import { HttpHeaders } from '@angular/common/http';
import { merge as observableMerge, of as observableOf } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { DataService } from '../data/data.service';
import { TaskDeleteRequest, TaskPostRequest } from '../data/request.models';
import { isNotEmpty } from '../../shared/empty.util';
import { ProcessTaskResponse } from './models/process-task-response';
import { RemoteDataError } from '../data/remote-data-error';
import { getResponseFromEntry } from '../shared/operators';
/**
 * An abstract class that provides methods to handle task requests.
 */
var TasksService = /** @class */ (function (_super) {
    tslib_1.__extends(TasksService, _super);
    function TasksService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TasksService.prototype.getBrowseEndpoint = function (options) {
        return this.halService.getEndpoint(this.linkPath);
    };
    /**
     * Fetch a RestRequest
     *
     * @param requestId
     *    The base endpoint for the type of object
     * @return Observable<ProcessTaskResponse>
     *     server response
     */
    TasksService.prototype.fetchRequest = function (requestId) {
        var responses = this.requestService.getByUUID(requestId).pipe(getResponseFromEntry());
        var errorResponses = responses.pipe(filter(function (response) { return !response.isSuccessful; }), mergeMap(function (response) { return observableOf(new ProcessTaskResponse(response.isSuccessful, new RemoteDataError(response.statusCode, response.statusText, response.errorMessage))); }));
        var successResponses = responses.pipe(filter(function (response) { return response.isSuccessful; }), map(function (response) { return new ProcessTaskResponse(response.isSuccessful); }), distinctUntilChanged());
        return observableMerge(errorResponses, successResponses);
    };
    /**
     * Create the HREF for a specific submission object based on its identifier
     *
     * @param endpoint
     *    The base endpoint for the type of object
     * @param resourceID
     *    The identifier for the object
     */
    TasksService.prototype.getEndpointByIDHref = function (endpoint, resourceID) {
        return isNotEmpty(resourceID) ? endpoint + "/" + resourceID : "" + endpoint;
    };
    /**
     * Make a new post request
     *
     * @param linkPath
     *    The endpoint link name
     * @param body
     *    The request body
     * @param scopeId
     *    The task id to be removed
     * @param options
     *    The HttpOptions object
     * @return Observable<SubmitDataResponseDefinitionObject>
     *     server response
     */
    TasksService.prototype.postToEndpoint = function (linkPath, body, scopeId, options) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        return this.halService.getEndpoint(linkPath).pipe(filter(function (href) { return isNotEmpty(href); }), map(function (endpointURL) { return _this.getEndpointByIDHref(endpointURL, scopeId); }), distinctUntilChanged(), map(function (endpointURL) { return new TaskPostRequest(requestId, endpointURL, body, options); }), tap(function (request) { return _this.requestService.configure(request); }), flatMap(function (request) { return _this.fetchRequest(requestId); }), distinctUntilChanged());
    };
    /**
     * Delete an existing task on the server
     *
     * @param linkPath
     *    The endpoint link name
     * @param scopeId
     *    The task id to be removed
     * @param options
     *    The HttpOptions object
     * @return Observable<SubmitDataResponseDefinitionObject>
     *     server response
     */
    TasksService.prototype.deleteById = function (linkPath, scopeId, options) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        return this.halService.getEndpoint(linkPath || this.linkPath).pipe(filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return _this.getEndpointByIDHref(endpointURL, scopeId); }), map(function (endpointURL) { return new TaskDeleteRequest(requestId, endpointURL, null, options); }), tap(function (request) { return _this.requestService.configure(request); }), flatMap(function (request) { return _this.fetchRequest(requestId); }), distinctUntilChanged());
    };
    /**
     * Create a new HttpOptions
     */
    TasksService.prototype.makeHttpOptions = function () {
        var options = Object.create({});
        var headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        options.headers = headers;
        return options;
    };
    return TasksService;
}(DataService));
export { TasksService };
//# sourceMappingURL=tasks.service.js.map