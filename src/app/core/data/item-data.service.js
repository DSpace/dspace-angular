import * as tslib_1 from "tslib";
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { isNotEmpty } from '../../shared/empty.util';
import { BrowseService } from '../browse/browse.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { URLCombiner } from '../url-combiner/url-combiner';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { PatchRequest } from './request.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { configureRequest, getRequestFromRequestHref } from '../shared/operators';
var ItemDataService = /** @class */ (function (_super) {
    tslib_1.__extends(ItemDataService, _super);
    function ItemDataService(requestService, rdbService, dataBuildService, store, bs, objectCache, halService, notificationsService, http, comparator) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.rdbService = rdbService;
        _this.dataBuildService = dataBuildService;
        _this.store = store;
        _this.bs = bs;
        _this.objectCache = objectCache;
        _this.halService = halService;
        _this.notificationsService = notificationsService;
        _this.http = http;
        _this.comparator = comparator;
        _this.linkPath = 'items';
        _this.forceBypassCache = false;
        return _this;
    }
    /**
     * Get the endpoint for browsing items
     *  (When options.sort.field is empty, the default field to browse by will be 'dc.date.issued')
     * @param {FindAllOptions} options
     * @returns {Observable<string>}
     */
    ItemDataService.prototype.getBrowseEndpoint = function (options, linkPath) {
        if (options === void 0) { options = {}; }
        if (linkPath === void 0) { linkPath = this.linkPath; }
        var field = 'dc.date.issued';
        if (options.sort && options.sort.field) {
            field = options.sort.field;
        }
        return this.bs.getBrowseURLFor(field, linkPath).pipe(filter(function (href) { return isNotEmpty(href); }), map(function (href) { return new URLCombiner(href, "?scope=" + options.scopeID).toString(); }), distinctUntilChanged());
    };
    /**
     * Get the endpoint for item withdrawal and reinstatement
     * @param itemId
     */
    ItemDataService.prototype.getItemWithdrawEndpoint = function (itemId) {
        var _this = this;
        return this.halService.getEndpoint(this.linkPath).pipe(map(function (endpoint) { return _this.getIDHref(endpoint, itemId); }));
    };
    /**
     * Get the endpoint to make item private and public
     * @param itemId
     */
    ItemDataService.prototype.getItemDiscoverableEndpoint = function (itemId) {
        var _this = this;
        return this.halService.getEndpoint(this.linkPath).pipe(map(function (endpoint) { return _this.getIDHref(endpoint, itemId); }));
    };
    /**
     * Set the isWithdrawn state of an item to a specified state
     * @param itemId
     * @param withdrawn
     */
    ItemDataService.prototype.setWithDrawn = function (itemId, withdrawn) {
        var _this = this;
        var patchOperation = [{
                op: 'replace', path: '/withdrawn', value: withdrawn
            }];
        return this.getItemWithdrawEndpoint(itemId).pipe(distinctUntilChanged(), map(function (endpointURL) {
            return new PatchRequest(_this.requestService.generateRequestId(), endpointURL, patchOperation);
        }), configureRequest(this.requestService), map(function (request) { return request.href; }), getRequestFromRequestHref(this.requestService), map(function (requestEntry) { return requestEntry.response; }));
    };
    /**
     * Set the isDiscoverable state of an item to a specified state
     * @param itemId
     * @param discoverable
     */
    ItemDataService.prototype.setDiscoverable = function (itemId, discoverable) {
        var _this = this;
        var patchOperation = [{
                op: 'replace', path: '/discoverable', value: discoverable
            }];
        return this.getItemDiscoverableEndpoint(itemId).pipe(distinctUntilChanged(), map(function (endpointURL) {
            return new PatchRequest(_this.requestService.generateRequestId(), endpointURL, patchOperation);
        }), configureRequest(this.requestService), map(function (request) { return request.href; }), getRequestFromRequestHref(this.requestService), map(function (requestEntry) { return requestEntry.response; }));
    };
    ItemDataService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            RemoteDataBuildService,
            NormalizedObjectBuildService,
            Store,
            BrowseService,
            ObjectCacheService,
            HALEndpointService,
            NotificationsService,
            HttpClient,
            DSOChangeAnalyzer])
    ], ItemDataService);
    return ItemDataService;
}(DataService));
export { ItemDataService };
//# sourceMappingURL=item-data.service.js.map