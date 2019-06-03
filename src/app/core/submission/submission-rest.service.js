import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { merge as observableMerge, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, flatMap, map, mergeMap, tap } from 'rxjs/operators';
import { RequestService } from '../data/request.service';
import { isNotEmpty } from '../../shared/empty.util';
import { SubmissionDeleteRequest, SubmissionPatchRequest, SubmissionPostRequest, SubmissionRequest } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { getResponseFromEntry } from '../shared/operators';
/**
 * The service handling all submission REST requests
 */
var SubmissionRestService = /** @class */ (function () {
    function SubmissionRestService(rdbService, requestService, halService) {
        this.rdbService = rdbService;
        this.requestService = requestService;
        this.halService = halService;
        this.linkPath = 'workspaceitems';
    }
    /**
     * Fetch a RestRequest
     *
     * @param requestId
     *    The base endpoint for the type of object
     * @return Observable<SubmitDataResponseDefinitionObject>
     *     server response
     */
    SubmissionRestService.prototype.fetchRequest = function (requestId) {
        var responses = this.requestService.getByUUID(requestId).pipe(getResponseFromEntry());
        var errorResponses = responses.pipe(filter(function (response) { return !response.isSuccessful; }), mergeMap(function (error) { return observableThrowError(error); }));
        var successResponses = responses.pipe(filter(function (response) { return response.isSuccessful; }), map(function (response) { return response.dataDefinition; }), distinctUntilChanged());
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
    SubmissionRestService.prototype.getEndpointByIDHref = function (endpoint, resourceID) {
        return isNotEmpty(resourceID) ? endpoint + "/" + resourceID : "" + endpoint;
    };
    /**
     * Delete an existing submission Object on the server
     *
     * @param scopeId
     *    The submission Object to be removed
     * @param linkName
     *    The endpoint link name
     * @return Observable<SubmitDataResponseDefinitionObject>
     *     server response
     */
    SubmissionRestService.prototype.deleteById = function (scopeId, linkName) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        return this.halService.getEndpoint(linkName || this.linkPath).pipe(filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return _this.getEndpointByIDHref(endpointURL, scopeId); }), map(function (endpointURL) { return new SubmissionDeleteRequest(requestId, endpointURL); }), tap(function (request) { return _this.requestService.configure(request); }), flatMap(function () { return _this.fetchRequest(requestId); }), distinctUntilChanged());
    };
    /**
     * Return an existing submission Object from the server
     *
     * @param linkName
     *    The endpoint link name
     * @param id
     *    The submission Object to retrieve
     * @return Observable<SubmitDataResponseDefinitionObject>
     *     server response
     */
    SubmissionRestService.prototype.getDataById = function (linkName, id) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        return this.halService.getEndpoint(linkName).pipe(map(function (endpointURL) { return _this.getEndpointByIDHref(endpointURL, id); }), filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return new SubmissionRequest(requestId, endpointURL); }), tap(function (request) { return _this.requestService.configure(request, true); }), flatMap(function () { return _this.fetchRequest(requestId); }), distinctUntilChanged());
    };
    /**
     * Make a new post request
     *
     * @param linkName
     *    The endpoint link name
     * @param body
     *    The post request body
     * @param scopeId
     *    The submission Object id
     * @param options
     *    The [HttpOptions] object
     * @return Observable<SubmitDataResponseDefinitionObject>
     *     server response
     */
    SubmissionRestService.prototype.postToEndpoint = function (linkName, body, scopeId, options) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        return this.halService.getEndpoint(linkName).pipe(filter(function (href) { return isNotEmpty(href); }), map(function (endpointURL) { return _this.getEndpointByIDHref(endpointURL, scopeId); }), distinctUntilChanged(), map(function (endpointURL) { return new SubmissionPostRequest(requestId, endpointURL, body, options); }), tap(function (request) { return _this.requestService.configure(request); }), flatMap(function () { return _this.fetchRequest(requestId); }), distinctUntilChanged());
    };
    /**
     * Make a new patch to a specified object
     *
     * @param linkName
     *    The endpoint link name
     * @param body
     *    The post request body
     * @param scopeId
     *    The submission Object id
     * @return Observable<SubmitDataResponseDefinitionObject>
     *     server response
     */
    SubmissionRestService.prototype.patchToEndpoint = function (linkName, body, scopeId) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        return this.halService.getEndpoint(linkName).pipe(filter(function (href) { return isNotEmpty(href); }), map(function (endpointURL) { return _this.getEndpointByIDHref(endpointURL, scopeId); }), distinctUntilChanged(), map(function (endpointURL) { return new SubmissionPatchRequest(requestId, endpointURL, body); }), tap(function (request) { return _this.requestService.configure(request); }), flatMap(function () { return _this.fetchRequest(requestId); }), distinctUntilChanged());
    };
    SubmissionRestService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RemoteDataBuildService,
            RequestService,
            HALEndpointService])
    ], SubmissionRestService);
    return SubmissionRestService;
}());
export { SubmissionRestService };
//# sourceMappingURL=submission-rest.service.js.map