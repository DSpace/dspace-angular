import { merge as observableMerge, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { ConfigRequest } from '../data/request.models';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ConfigData } from './config-data';
import { getResponseFromEntry } from '../shared/operators';
var ConfigService = /** @class */ (function () {
    function ConfigService() {
    }
    ConfigService.prototype.getConfig = function (request) {
        var responses = this.requestService.getByHref(request.href).pipe(getResponseFromEntry());
        var errorResponses = responses.pipe(filter(function (response) { return !response.isSuccessful; }), mergeMap(function () { return observableThrowError(new Error("Couldn't retrieve the config")); }));
        var successResponses = responses.pipe(filter(function (response) { return response.isSuccessful && isNotEmpty(response) && isNotEmpty(response.configDefinition); }), map(function (response) { return new ConfigData(response.pageInfo, response.configDefinition); }));
        return observableMerge(errorResponses, successResponses);
    };
    ConfigService.prototype.getConfigByNameHref = function (endpoint, resourceName) {
        return endpoint + "/" + resourceName;
    };
    ConfigService.prototype.getConfigSearchHref = function (endpoint, options) {
        if (options === void 0) { options = {}; }
        var result;
        var args = [];
        if (hasValue(options.scopeID)) {
            result = endpoint + "/" + this.browseEndpoint;
            args.push("uuid=" + options.scopeID);
        }
        else {
            result = endpoint;
        }
        if (hasValue(options.currentPage) && typeof options.currentPage === 'number') {
            /* TODO: this is a temporary fix for the pagination start index (0 or 1) discrepancy between the rest and the frontend respectively */
            args.push("page=" + (options.currentPage - 1));
        }
        if (hasValue(options.elementsPerPage)) {
            args.push("size=" + options.elementsPerPage);
        }
        if (hasValue(options.sort)) {
            args.push("sort=" + options.sort.field + "," + options.sort.direction);
        }
        if (isNotEmpty(args)) {
            result = result + "?" + args.join('&');
        }
        return result;
    };
    ConfigService.prototype.getConfigAll = function () {
        var _this = this;
        return this.halService.getEndpoint(this.linkPath).pipe(filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return new ConfigRequest(_this.requestService.generateRequestId(), endpointURL); }), tap(function (request) { return _this.requestService.configure(request); }), mergeMap(function (request) { return _this.getConfig(request); }), distinctUntilChanged());
    };
    ConfigService.prototype.getConfigByHref = function (href) {
        var request = new ConfigRequest(this.requestService.generateRequestId(), href);
        this.requestService.configure(request);
        return this.getConfig(request);
    };
    ConfigService.prototype.getConfigByName = function (name) {
        var _this = this;
        return this.halService.getEndpoint(this.linkPath).pipe(map(function (endpoint) { return _this.getConfigByNameHref(endpoint, name); }), filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return new ConfigRequest(_this.requestService.generateRequestId(), endpointURL); }), tap(function (request) { return _this.requestService.configure(request); }), mergeMap(function (request) { return _this.getConfig(request); }), distinctUntilChanged());
    };
    ConfigService.prototype.getConfigBySearch = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return this.halService.getEndpoint(this.linkPath).pipe(map(function (endpoint) { return _this.getConfigSearchHref(endpoint, options); }), filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return new ConfigRequest(_this.requestService.generateRequestId(), endpointURL); }), tap(function (request) { return _this.requestService.configure(request); }), mergeMap(function (request) { return _this.getConfig(request); }), distinctUntilChanged());
    };
    return ConfigService;
}());
export { ConfigService };
//# sourceMappingURL=config.service.js.map