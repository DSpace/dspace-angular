import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { ensureArrayHasValue, hasValue, hasValueOperator, isEmpty, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { PaginatedList } from '../data/paginated-list';
import { BrowseEndpointRequest, BrowseEntriesRequest, BrowseItemsRequest } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { BrowseDefinition } from '../shared/browse-definition.model';
import { BrowseEntry } from '../shared/browse-entry.model';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { configureRequest, filterSuccessfulResponses, getBrowseDefinitionLinks, getFirstOccurrence, getRemoteDataPayload, getRequestFromRequestHref } from '../shared/operators';
import { URLCombiner } from '../url-combiner/url-combiner';
import { Item } from '../shared/item.model';
/**
 * The service handling all browse requests
 */
var BrowseService = /** @class */ (function () {
    function BrowseService(requestService, halService, rdb) {
        this.requestService = requestService;
        this.halService = halService;
        this.rdb = rdb;
        this.linkPath = 'browses';
    }
    BrowseService_1 = BrowseService;
    BrowseService.toSearchKeyArray = function (metadataKey) {
        var keyParts = metadataKey.split('.');
        var searchFor = [];
        searchFor.push('*');
        for (var i = 0; i < keyParts.length - 1; i++) {
            var prevParts = keyParts.slice(0, i + 1);
            var nextPart = prevParts.concat(['*']).join('.');
            searchFor.push(nextPart);
        }
        searchFor.push(metadataKey);
        return searchFor;
    };
    /**
     * Get all BrowseDefinitions
     */
    BrowseService.prototype.getBrowseDefinitions = function () {
        var _this = this;
        var request$ = this.halService.getEndpoint(this.linkPath).pipe(isNotEmptyOperator(), distinctUntilChanged(), map(function (endpointURL) { return new BrowseEndpointRequest(_this.requestService.generateRequestId(), endpointURL); }), configureRequest(this.requestService));
        var href$ = request$.pipe(map(function (request) { return request.href; }));
        var requestEntry$ = href$.pipe(getRequestFromRequestHref(this.requestService));
        var payload$ = requestEntry$.pipe(filterSuccessfulResponses(), map(function (response) { return response.payload; }), ensureArrayHasValue(), map(function (definitions) { return definitions
            .map(function (definition) { return Object.assign(new BrowseDefinition(), definition); }); }), distinctUntilChanged());
        return this.rdb.toRemoteDataObservable(requestEntry$, payload$);
    };
    /**
     * Get all BrowseEntries filtered or modified by BrowseEntrySearchOptions
     * @param options
     */
    BrowseService.prototype.getBrowseEntriesFor = function (options) {
        return this.getBrowseDefinitions().pipe(getBrowseDefinitionLinks(options.metadataDefinition), hasValueOperator(), map(function (_links) { return _links.entries; }), hasValueOperator(), map(function (href) {
            // TODO nearly identical to PaginatedSearchOptions => refactor
            var args = [];
            if (isNotEmpty(options.scope)) {
                args.push("scope=" + options.scope);
            }
            if (isNotEmpty(options.sort)) {
                args.push("sort=" + options.sort.field + "," + options.sort.direction);
            }
            if (isNotEmpty(options.pagination)) {
                args.push("page=" + (options.pagination.currentPage - 1));
                args.push("size=" + options.pagination.pageSize);
            }
            if (isNotEmpty(options.startsWith)) {
                args.push("startsWith=" + options.startsWith);
            }
            if (isNotEmpty(args)) {
                href = new URLCombiner(href, "?" + args.join('&')).toString();
            }
            return href;
        }), getBrowseEntriesFor(this.requestService, this.rdb));
    };
    /**
     * Get all items linked to a certain metadata value
     * @param {string} filterValue      metadata value to filter by (e.g. author's name)
     * @param options                   Options to narrow down your search
     * @returns {Observable<RemoteData<PaginatedList<Item>>>}
     */
    BrowseService.prototype.getBrowseItemsFor = function (filterValue, options) {
        return this.getBrowseDefinitions().pipe(getBrowseDefinitionLinks(options.metadataDefinition), hasValueOperator(), map(function (_links) { return _links.items; }), hasValueOperator(), map(function (href) {
            var args = [];
            if (isNotEmpty(options.scope)) {
                args.push("scope=" + options.scope);
            }
            if (isNotEmpty(options.sort)) {
                args.push("sort=" + options.sort.field + "," + options.sort.direction);
            }
            if (isNotEmpty(options.pagination)) {
                args.push("page=" + (options.pagination.currentPage - 1));
                args.push("size=" + options.pagination.pageSize);
            }
            if (isNotEmpty(options.startsWith)) {
                args.push("startsWith=" + options.startsWith);
            }
            if (isNotEmpty(filterValue)) {
                args.push("filterValue=" + filterValue);
            }
            if (isNotEmpty(args)) {
                href = new URLCombiner(href, "?" + args.join('&')).toString();
            }
            return href;
        }), getBrowseItemsFor(this.requestService, this.rdb));
    };
    /**
     * Get the first item for a metadata definition in an optional scope
     * @param definition
     * @param scope
     */
    BrowseService.prototype.getFirstItemFor = function (definition, scope) {
        return this.getBrowseDefinitions().pipe(getBrowseDefinitionLinks(definition), hasValueOperator(), map(function (_links) { return _links.items; }), hasValueOperator(), map(function (href) {
            var args = [];
            if (hasValue(scope)) {
                args.push("scope=" + scope);
            }
            args.push('page=0');
            args.push('size=1');
            if (isNotEmpty(args)) {
                href = new URLCombiner(href, "?" + args.join('&')).toString();
            }
            return href;
        }), getBrowseItemsFor(this.requestService, this.rdb), getFirstOccurrence());
    };
    /**
     * Get the previous page of items using the paginated list's prev link
     * @param items
     */
    BrowseService.prototype.getPrevBrowseItems = function (items) {
        return observableOf(items.payload.prev).pipe(getBrowseItemsFor(this.requestService, this.rdb));
    };
    /**
     * Get the next page of items using the paginated list's next link
     * @param items
     */
    BrowseService.prototype.getNextBrowseItems = function (items) {
        return observableOf(items.payload.next).pipe(getBrowseItemsFor(this.requestService, this.rdb));
    };
    /**
     * Get the previous page of browse-entries using the paginated list's prev link
     * @param entries
     */
    BrowseService.prototype.getPrevBrowseEntries = function (entries) {
        return observableOf(entries.payload.prev).pipe(getBrowseEntriesFor(this.requestService, this.rdb));
    };
    /**
     * Get the next page of browse-entries using the paginated list's next link
     * @param entries
     */
    BrowseService.prototype.getNextBrowseEntries = function (entries) {
        return observableOf(entries.payload.next).pipe(getBrowseEntriesFor(this.requestService, this.rdb));
    };
    /**
     * Get the browse URL by providing a metadatum key and linkPath
     * @param metadatumKey
     * @param linkPath
     */
    BrowseService.prototype.getBrowseURLFor = function (metadataKey, linkPath) {
        var searchKeyArray = BrowseService_1.toSearchKeyArray(metadataKey);
        return this.getBrowseDefinitions().pipe(getRemoteDataPayload(), map(function (browseDefinitions) { return browseDefinitions
            .find(function (def) {
            var matchingKeys = def.metadataKeys.find(function (key) { return searchKeyArray.indexOf(key) >= 0; });
            return isNotEmpty(matchingKeys);
        }); }), map(function (def) {
            if (isEmpty(def) || isEmpty(def._links) || isEmpty(def._links[linkPath])) {
                throw new Error("A browse endpoint for " + linkPath + " on " + metadataKey + " isn't configured");
            }
            else {
                return def._links[linkPath];
            }
        }), startWith(undefined), distinctUntilChanged());
    };
    var BrowseService_1;
    BrowseService = BrowseService_1 = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            HALEndpointService,
            RemoteDataBuildService])
    ], BrowseService);
    return BrowseService;
}());
export { BrowseService };
/**
 * Operator for turning a href into a PaginatedList of BrowseEntries
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export var getBrowseEntriesFor = function (requestService, rdb) {
    return function (source) {
        return source.pipe(map(function (href) { return new BrowseEntriesRequest(requestService.generateRequestId(), href); }), configureRequest(requestService), toRDPaginatedBrowseEntries(requestService, rdb));
    };
};
/**
 * Operator for turning a href into a PaginatedList of Items
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export var getBrowseItemsFor = function (requestService, rdb) {
    return function (source) {
        return source.pipe(map(function (href) { return new BrowseItemsRequest(requestService.generateRequestId(), href); }), configureRequest(requestService), toRDPaginatedBrowseItems(requestService, rdb));
    };
};
/**
 * Operator for turning a RestRequest into a PaginatedList of Items
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export var toRDPaginatedBrowseItems = function (requestService, rdb) {
    return function (source) {
        var href$ = source.pipe(map(function (request) { return request.href; }));
        var requestEntry$ = href$.pipe(getRequestFromRequestHref(requestService));
        var payload$ = requestEntry$.pipe(filterSuccessfulResponses(), map(function (response) { return new PaginatedList(response.pageInfo, response.payload); }), map(function (list) { return Object.assign(list, {
            page: list.page ? list.page.map(function (item) { return Object.assign(new Item(), item); }) : list.page
        }); }), distinctUntilChanged());
        return rdb.toRemoteDataObservable(requestEntry$, payload$);
    };
};
/**
 * Operator for turning a RestRequest into a PaginatedList of BrowseEntries
 * @param requestService
 * @param responseCache
 * @param rdb
 */
export var toRDPaginatedBrowseEntries = function (requestService, rdb) {
    return function (source) {
        var href$ = source.pipe(map(function (request) { return request.href; }));
        var requestEntry$ = href$.pipe(getRequestFromRequestHref(requestService));
        var payload$ = requestEntry$.pipe(filterSuccessfulResponses(), map(function (response) { return new PaginatedList(response.pageInfo, response.payload); }), map(function (list) { return Object.assign(list, {
            page: list.page ? list.page.map(function (entry) { return Object.assign(new BrowseEntry(), entry); }) : list.page
        }); }), distinctUntilChanged());
        return rdb.toRemoteDataObservable(requestEntry$, payload$);
    };
};
//# sourceMappingURL=browse.service.js.map