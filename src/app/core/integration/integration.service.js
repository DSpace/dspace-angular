import { of as observableOf, throwError as observableThrowError } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, tap } from 'rxjs/operators';
import { IntegrationRequest } from '../data/request.models';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { IntegrationData } from './integration-data';
import { IntegrationSearchOptions } from './models/integration-options.model';
import { getResponseFromEntry } from '../shared/operators';
var IntegrationService = /** @class */ (function () {
    function IntegrationService() {
    }
    IntegrationService.prototype.getData = function (request) {
        return this.requestService.getByHref(request.href).pipe(getResponseFromEntry(), mergeMap(function (response) {
            if (response.isSuccessful && isNotEmpty(response)) {
                return observableOf(new IntegrationData(response.pageInfo, (response.dataDefinition) ? response.dataDefinition.page : []));
            }
            else if (!response.isSuccessful) {
                return observableThrowError(new Error("Couldn't retrieve the integration data"));
            }
        }), distinctUntilChanged());
    };
    IntegrationService.prototype.getEntriesHref = function (endpoint, options) {
        if (options === void 0) { options = new IntegrationSearchOptions(); }
        var result;
        var args = [];
        if (hasValue(options.name)) {
            result = endpoint + "/" + options.name + "/" + this.entriesEndpoint;
        }
        else {
            result = endpoint;
        }
        if (hasValue(options.query)) {
            args.push("query=" + options.query);
        }
        if (hasValue(options.metadata)) {
            args.push("metadata=" + options.metadata);
        }
        if (hasValue(options.uuid)) {
            args.push("uuid=" + options.uuid);
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
    IntegrationService.prototype.getEntryValueHref = function (endpoint, options) {
        if (options === void 0) { options = new IntegrationSearchOptions(); }
        var result;
        var args = [];
        if (hasValue(options.name) && hasValue(options.query)) {
            result = endpoint + "/" + options.name + "/" + this.entryValueEndpoint + "/" + options.query;
        }
        else {
            result = endpoint;
        }
        if (hasValue(options.metadata)) {
            args.push("metadata=" + options.metadata);
        }
        if (isNotEmpty(args)) {
            result = result + "?" + args.join('&');
        }
        return result;
    };
    IntegrationService.prototype.getEntriesByName = function (options) {
        var _this = this;
        return this.halService.getEndpoint(this.linkPath).pipe(map(function (endpoint) { return _this.getEntriesHref(endpoint, options); }), filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return new IntegrationRequest(_this.requestService.generateRequestId(), endpointURL); }), tap(function (request) { return _this.requestService.configure(request); }), mergeMap(function (request) { return _this.getData(request); }), distinctUntilChanged());
    };
    IntegrationService.prototype.getEntryByValue = function (options) {
        var _this = this;
        return this.halService.getEndpoint(this.linkPath).pipe(map(function (endpoint) { return _this.getEntryValueHref(endpoint, options); }), filter(function (href) { return isNotEmpty(href); }), distinctUntilChanged(), map(function (endpointURL) { return new IntegrationRequest(_this.requestService.generateRequestId(), endpointURL); }), tap(function (request) { return _this.requestService.configure(request); }), mergeMap(function (request) { return _this.getData(request); }), distinctUntilChanged());
    };
    return IntegrationService;
}());
export { IntegrationService };
//# sourceMappingURL=integration.service.js.map