import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { createSelector, select, Store } from '@ngrx/store';
import { race as observableRace } from 'rxjs';
import { filter, find, map, mergeMap, take } from 'rxjs/operators';
import { cloneDeep, remove } from 'lodash';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { IndexName } from '../index/index.reducer';
import { originalRequestUUIDFromRequestUUIDSelector, requestIndexSelector, uuidFromHrefSelector } from '../index/index.selectors';
import { UUIDService } from '../shared/uuid.service';
import { RequestConfigureAction, RequestExecuteAction, RequestRemoveAction } from './request.actions';
import { CommitSSBAction } from '../cache/server-sync-buffer.actions';
import { RestRequestMethod } from './rest-request-method';
import { AddToIndexAction, RemoveFromIndexBySubstringAction } from '../index/index.actions';
import { coreSelector } from '../core.selectors';
/**
 * The base selector function to select the request state in the store
 */
var requestCacheSelector = createSelector(coreSelector, function (state) { return state['data/request']; });
/**
 * Selector function to select a request entry by uuid from the cache
 * @param uuid The uuid of the request
 */
var entryFromUUIDSelector = function (uuid) { return createSelector(requestCacheSelector, function (state) {
    return hasValue(state) ? state[uuid] : undefined;
}); };
/**
 * Create a selector that fetches a list of request UUIDs from a given index substate of which the request href
 * contains a given substring
 * @param selector    MemoizedSelector to start from
 * @param href        Substring that the request's href should contain
 */
var uuidsFromHrefSubstringSelector = function (selector, href) { return createSelector(selector, function (state) { return getUuidsFromHrefSubstring(state, href); }); };
/**
 * Fetch a list of request UUIDs from a given index substate of which the request href contains a given substring
 * @param state   The IndexState
 * @param href    Substring that the request's href should contain
 */
var getUuidsFromHrefSubstring = function (state, href) {
    var result = [];
    if (isNotEmpty(state)) {
        result = Object.values(state)
            .filter(function (value) { return value.startsWith(href); });
    }
    return result;
};
/**
 * A service to interact with the request state in the store
 */
var RequestService = /** @class */ (function () {
    function RequestService(objectCache, uuidService, store, indexStore) {
        this.objectCache = objectCache;
        this.uuidService = uuidService;
        this.store = store;
        this.indexStore = indexStore;
        this.requestsOnTheirWayToTheStore = [];
    }
    RequestService.prototype.generateRequestId = function () {
        return "client/" + this.uuidService.generate();
    };
    /**
     * Check if a request is currently pending
     */
    RequestService.prototype.isPending = function (request) {
        // first check requests that haven't made it to the store yet
        if (this.requestsOnTheirWayToTheStore.includes(request.href)) {
            return true;
        }
        // then check the store
        var isPending = false;
        this.getByHref(request.href).pipe(take(1))
            .subscribe(function (re) {
            isPending = (hasValue(re) && !re.completed);
        });
        return isPending;
    };
    /**
     * Retrieve a RequestEntry based on their uuid
     */
    RequestService.prototype.getByUUID = function (uuid) {
        var _this = this;
        return observableRace(this.store.pipe(select(entryFromUUIDSelector(uuid))), this.store.pipe(select(originalRequestUUIDFromRequestUUIDSelector(uuid)), mergeMap(function (originalUUID) {
            return _this.store.pipe(select(entryFromUUIDSelector(originalUUID)));
        }))).pipe(map(function (entry) {
            // Headers break after being retrieved from the store (because of lazy initialization)
            // Combining them with a new object fixes this issue
            if (hasValue(entry) && hasValue(entry.request) && hasValue(entry.request.options) && hasValue(entry.request.options.headers)) {
                entry = cloneDeep(entry);
                entry.request.options.headers = Object.assign(new HttpHeaders(), entry.request.options.headers);
            }
            return entry;
        }));
    };
    /**
     * Retrieve a RequestEntry based on their href
     */
    RequestService.prototype.getByHref = function (href) {
        var _this = this;
        return this.store.pipe(select(uuidFromHrefSelector(href)), mergeMap(function (uuid) { return _this.getByUUID(uuid); }));
    };
    /**
     * Configure a certain request
     * Used to make sure a request is in the cache
     * @param {RestRequest} request The request to send out
     * @param {boolean} forceBypassCache When true, a new request is always dispatched
     */
    RequestService.prototype.configure = function (request, forceBypassCache) {
        var _this = this;
        if (forceBypassCache === void 0) { forceBypassCache = false; }
        var isGetRequest = request.method === RestRequestMethod.GET;
        if (forceBypassCache) {
            this.clearRequestsOnTheirWayToTheStore(request);
        }
        if (!isGetRequest || (forceBypassCache && !this.isPending(request)) || !this.isCachedOrPending(request)) {
            this.dispatchRequest(request);
            if (isGetRequest) {
                this.trackRequestsOnTheirWayToTheStore(request);
            }
        }
        else {
            this.getByHref(request.href).pipe(filter(function (entry) { return hasValue(entry); }), take(1)).subscribe(function (entry) {
                return _this.store.dispatch(new AddToIndexAction(IndexName.UUID_MAPPING, request.uuid, entry.request.uuid));
            });
        }
    };
    /**
     * Convert request Payload to a URL-encoded string
     *
     * e.g.  uriEncodeBody({param: value, param1: value1})
     * returns: param=value&param1=value1
     *
     * @param body
     *    The request Payload to convert
     * @return string
     *    URL-encoded string
     */
    RequestService.prototype.uriEncodeBody = function (body) {
        var queryParams = '';
        if (isNotEmpty(body) && typeof body === 'object') {
            Object.keys(body)
                .forEach(function (param) {
                var paramValue = param + "=" + body[param];
                queryParams = isEmpty(queryParams) ? queryParams.concat(paramValue) : queryParams.concat('&', paramValue);
            });
        }
        return encodeURI(queryParams);
    };
    /**
     * Remove all request cache providing (part of) the href
     * This also includes href-to-uuid index cache
     * @param href    A substring of the request(s) href
     */
    RequestService.prototype.removeByHrefSubstring = function (href) {
        var _this = this;
        this.store.pipe(select(uuidsFromHrefSubstringSelector(requestIndexSelector, href)), take(1)).subscribe(function (uuids) {
            for (var _i = 0, uuids_1 = uuids; _i < uuids_1.length; _i++) {
                var uuid = uuids_1[_i];
                _this.removeByUuid(uuid);
            }
        });
        this.requestsOnTheirWayToTheStore = this.requestsOnTheirWayToTheStore.filter(function (reqHref) { return reqHref.indexOf(href) < 0; });
        this.indexStore.dispatch(new RemoveFromIndexBySubstringAction(IndexName.REQUEST, href));
    };
    /**
     * Remove request cache using the request's UUID
     * @param uuid
     */
    RequestService.prototype.removeByUuid = function (uuid) {
        this.store.dispatch(new RequestRemoveAction(uuid));
    };
    /**
     * Check if a request is in the cache or if it's still pending
     * @param {GetRequest} request The request to check
     * @returns {boolean} True if the request is cached or still pending
     */
    RequestService.prototype.isCachedOrPending = function (request) {
        var inReqCache = this.hasByHref(request.href);
        var inObjCache = this.objectCache.hasBySelfLink(request.href);
        var isCached = inReqCache || inObjCache;
        var isPending = this.isPending(request);
        return isCached || isPending;
    };
    /**
     * Configure and execute the request
     * @param {RestRequest} request to dispatch
     */
    RequestService.prototype.dispatchRequest = function (request) {
        this.store.dispatch(new RequestConfigureAction(request));
        this.store.dispatch(new RequestExecuteAction(request.uuid));
    };
    /**
     * ngrx action dispatches are asynchronous. But this.isPending needs to return true as soon as the
     * configure method for a GET request has been executed, otherwise certain requests will happen multiple times.
     *
     * This method will store the href of every GET request that gets configured in a local variable, and
     * remove it as soon as it can be found in the store.
     */
    RequestService.prototype.trackRequestsOnTheirWayToTheStore = function (request) {
        var _this = this;
        this.requestsOnTheirWayToTheStore = this.requestsOnTheirWayToTheStore.concat([request.href]);
        this.getByHref(request.href).pipe(filter(function (re) { return hasValue(re); }), take(1)).subscribe(function (re) {
            _this.requestsOnTheirWayToTheStore = _this.requestsOnTheirWayToTheStore.filter(function (pendingHref) { return pendingHref !== request.href; });
        });
    };
    /**
     * This method remove requests that are on their way to the store.
     */
    RequestService.prototype.clearRequestsOnTheirWayToTheStore = function (request) {
        var _this = this;
        this.getByHref(request.href).pipe(find(function (re) { return hasValue(re); }))
            .subscribe(function (re) {
            if (!re.responsePending) {
                remove(_this.requestsOnTheirWayToTheStore, function (item) { return item === request.href; });
            }
        });
    };
    /**
     * Dispatch commit action to send all changes (for a certain method) to the server (buffer)
     * @param {RestRequestMethod} method RestRequestMethod for which the changes should be committed
     */
    RequestService.prototype.commit = function (method) {
        this.store.dispatch(new CommitSSBAction(method));
    };
    /**
     * Check whether a cached response should still be valid
     *
     * @param entry
     *    the entry to check
     * @return boolean
     *    false if the uuid has no value, the response was not successful or its time to
     *    live was exceeded, true otherwise
     */
    RequestService.prototype.isValid = function (entry) {
        if (hasValue(entry) && entry.completed && entry.response.isSuccessful) {
            var timeOutdated = entry.response.timeAdded + entry.request.responseMsToLive;
            var isOutDated = new Date().getTime() > timeOutdated;
            return !isOutDated;
        }
        else {
            return false;
        }
    };
    /**
     * Check whether the request with the specified href is cached
     *
     * @param href
     *    The link of the request to check
     * @return boolean
     *    true if the request with the specified href is cached,
     *    false otherwise
     */
    RequestService.prototype.hasByHref = function (href) {
        var _this = this;
        var result = false;
        this.getByHref(href).pipe(take(1)).subscribe(function (requestEntry) { return result = _this.isValid(requestEntry); });
        return result;
    };
    RequestService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [ObjectCacheService,
            UUIDService,
            Store,
            Store])
    ], RequestService);
    return RequestService;
}());
export { RequestService };
//# sourceMappingURL=request.service.js.map