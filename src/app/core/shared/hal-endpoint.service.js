import * as tslib_1 from "tslib";
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { RequestService } from '../data/request.service';
import { EndpointMapRequest } from '../data/request.models';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { RESTURLCombiner } from '../url-combiner/rest-url-combiner';
import { Inject, Injectable } from '@angular/core';
import { GLOBAL_CONFIG } from '../../../config';
import { getResponseFromEntry } from './operators';
import { URLCombiner } from '../url-combiner/url-combiner';
var HALEndpointService = /** @class */ (function () {
    function HALEndpointService(requestService, EnvConfig) {
        this.requestService = requestService;
        this.EnvConfig = EnvConfig;
    }
    HALEndpointService.prototype.getRootHref = function () {
        return new RESTURLCombiner(this.EnvConfig, '/').toString();
    };
    HALEndpointService.prototype.getRootEndpointMap = function () {
        return this.getEndpointMapAt(this.getRootHref());
    };
    HALEndpointService.prototype.getEndpointMapAt = function (href) {
        var request = new EndpointMapRequest(this.requestService.generateRequestId(), href);
        this.requestService.configure(request);
        return this.requestService.getByHref(request.href).pipe(getResponseFromEntry(), map(function (response) { return response.endpointMap; }));
    };
    HALEndpointService.prototype.getEndpoint = function (linkPath) {
        return this.getEndpointAt.apply(this, [this.getRootHref()].concat(linkPath.split('/')));
    };
    /**
     * Resolve the actual hal url based on a list of hal names
     * @param {string} href The root url to start from
     * @param {string} halNames List of hal names for which a url should be resolved
     * @returns {Observable<string>} Observable that emits the found hal url
     */
    HALEndpointService.prototype.getEndpointAt = function (href) {
        var _this = this;
        var halNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            halNames[_i - 1] = arguments[_i];
        }
        if (isEmpty(halNames)) {
            throw new Error('cant\'t fetch the URL without the HAL link names');
        }
        var nextHref$ = this.getEndpointMapAt(href).pipe(map(function (endpointMap) {
            /*TODO remove if/else block once the rest response contains _links for facets*/
            var nextName = halNames[0];
            if (hasValue(endpointMap) && hasValue(endpointMap[nextName])) {
                return endpointMap[nextName];
            }
            else {
                return new URLCombiner(href, nextName).toString();
            }
        }));
        if (halNames.length === 1) {
            return nextHref$;
        }
        else {
            return nextHref$.pipe(switchMap(function (nextHref) { return _this.getEndpointAt.apply(_this, [nextHref].concat(halNames.slice(1))); }));
        }
    };
    HALEndpointService.prototype.isEnabledOnRestApi = function (linkPath) {
        return this.getRootEndpointMap().pipe(
        // TODO this only works when there's no / in linkPath
        map(function (endpointMap) { return isNotEmpty(endpointMap[linkPath]); }), startWith(undefined), distinctUntilChanged());
    };
    HALEndpointService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(1, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [RequestService, Object])
    ], HALEndpointService);
    return HALEndpointService;
}());
export { HALEndpointService };
//# sourceMappingURL=hal-endpoint.service.js.map