import * as tslib_1 from "tslib";
import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { Inject, Injectable } from '@angular/core';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { GLOBAL_CONFIG } from '../../../config';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthGetRequest, AuthPostRequest } from '../data/request.models';
import { getResponseFromEntry } from '../shared/operators';
var AuthRequestService = /** @class */ (function () {
    function AuthRequestService(EnvConfig, halService, requestService) {
        this.EnvConfig = EnvConfig;
        this.halService = halService;
        this.requestService = requestService;
        this.linkName = 'authn';
        this.browseEndpoint = '';
    }
    AuthRequestService.prototype.fetchRequest = function (request) {
        return this.requestService.getByUUID(request.uuid).pipe(getResponseFromEntry(), mergeMap(function (response) {
            if (response.isSuccessful && isNotEmpty(response)) {
                return observableOf(response.response);
            }
            else if (!response.isSuccessful) {
                return observableThrowError(new Error(response.errorMessage));
            }
        }));
    };
    AuthRequestService.prototype.getEndpointByMethod = function (endpoint, method) {
        return isNotEmpty(method) ? endpoint + "/" + method : "" + endpoint;
    };
    AuthRequestService.prototype.postToEndpoint = function (method, body, options) {
        var _this = this;
        return this.halService.getEndpoint(this.linkName).pipe(filter(function (href) { return isNotEmpty(href); }), map(function (endpointURL) { return _this.getEndpointByMethod(endpointURL, method); }), distinctUntilChanged(), map(function (endpointURL) { return new AuthPostRequest(_this.requestService.generateRequestId(), endpointURL, body, options); }), tap(function (request) { return _this.requestService.configure(request, true); }), mergeMap(function (request) { return _this.fetchRequest(request); }), distinctUntilChanged());
    };
    AuthRequestService.prototype.getRequest = function (method, options) {
        var _this = this;
        return this.halService.getEndpoint(this.linkName).pipe(filter(function (href) { return isNotEmpty(href); }), map(function (endpointURL) { return _this.getEndpointByMethod(endpointURL, method); }), distinctUntilChanged(), map(function (endpointURL) { return new AuthGetRequest(_this.requestService.generateRequestId(), endpointURL, options); }), tap(function (request) { return _this.requestService.configure(request, true); }), mergeMap(function (request) { return _this.fetchRequest(request); }), distinctUntilChanged());
    };
    AuthRequestService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, HALEndpointService,
            RequestService])
    ], AuthRequestService);
    return AuthRequestService;
}());
export { AuthRequestService };
//# sourceMappingURL=auth-request.service.js.map