import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { combineLatest as observableCombineLatest, of as observableOf, race as observableRace } from 'rxjs';
import { distinctUntilChanged, flatMap, map, startWith, switchMap } from 'rxjs/operators';
import { hasValue, hasValueOperator, isEmpty, isNotEmpty, isNotUndefined } from '../../../shared/empty.util';
import { PaginatedList } from '../../data/paginated-list';
import { RemoteData } from '../../data/remote-data';
import { RemoteDataError } from '../../data/remote-data-error';
import { GetRequest } from '../../data/request.models';
import { RequestService } from '../../data/request.service';
import { ObjectCacheService } from '../object-cache.service';
import { getMapsTo, getRelationMetadata, getRelationships } from './build-decorators';
import { filterSuccessfulResponses, getRequestFromRequestHref, getRequestFromRequestUUID, getResourceLinksFromResponse } from '../../shared/operators';
var RemoteDataBuildService = /** @class */ (function () {
    function RemoteDataBuildService(objectCache, requestService) {
        this.objectCache = objectCache;
        this.requestService = requestService;
    }
    RemoteDataBuildService.prototype.buildSingle = function (href$) {
        var _this = this;
        if (typeof href$ === 'string') {
            href$ = observableOf(href$);
        }
        var requestUUID$ = href$.pipe(switchMap(function (href) {
            return _this.objectCache.getRequestUUIDBySelfLink(href);
        }));
        var requestEntry$ = observableRace(href$.pipe(getRequestFromRequestHref(this.requestService)), requestUUID$.pipe(getRequestFromRequestUUID(this.requestService)));
        // always use self link if that is cached, only if it isn't, get it via the response.
        var payload$ = observableCombineLatest(href$.pipe(switchMap(function (href) { return _this.objectCache.getObjectBySelfLink(href); }), startWith(undefined)), requestEntry$.pipe(getResourceLinksFromResponse(), switchMap(function (resourceSelfLinks) {
            if (isNotEmpty(resourceSelfLinks)) {
                return _this.objectCache.getObjectBySelfLink(resourceSelfLinks[0]);
            }
            else {
                return observableOf(undefined);
            }
        }), distinctUntilChanged(), startWith(undefined))).pipe(map(function (_a) {
            var fromSelfLink = _a[0], fromResponse = _a[1];
            if (hasValue(fromSelfLink)) {
                return fromSelfLink;
            }
            else {
                return fromResponse;
            }
        }), hasValueOperator(), map(function (normalized) {
            return _this.build(normalized);
        }), startWith(undefined), distinctUntilChanged());
        return this.toRemoteDataObservable(requestEntry$, payload$);
    };
    RemoteDataBuildService.prototype.toRemoteDataObservable = function (requestEntry$, payload$) {
        return observableCombineLatest(requestEntry$, payload$).pipe(map(function (_a) {
            var reqEntry = _a[0], payload = _a[1];
            var requestPending = hasValue(reqEntry.requestPending) ? reqEntry.requestPending : true;
            var responsePending = hasValue(reqEntry.responsePending) ? reqEntry.responsePending : false;
            var isSuccessful;
            var error;
            if (hasValue(reqEntry) && hasValue(reqEntry.response)) {
                isSuccessful = reqEntry.response.isSuccessful;
                var errorMessage = isSuccessful === false ? reqEntry.response.errorMessage : undefined;
                if (hasValue(errorMessage)) {
                    error = new RemoteDataError(reqEntry.response.statusCode, reqEntry.response.statusText, errorMessage);
                }
            }
            return new RemoteData(requestPending, responsePending, isSuccessful, error, payload);
        }));
    };
    RemoteDataBuildService.prototype.buildList = function (href$) {
        var _this = this;
        if (typeof href$ === 'string') {
            href$ = observableOf(href$);
        }
        var requestEntry$ = href$.pipe(getRequestFromRequestHref(this.requestService));
        var tDomainList$ = requestEntry$.pipe(getResourceLinksFromResponse(), flatMap(function (resourceUUIDs) {
            return _this.objectCache.getList(resourceUUIDs).pipe(map(function (normList) {
                return normList.map(function (normalized) {
                    return _this.build(normalized);
                });
            }));
        }), startWith([]), distinctUntilChanged());
        var pageInfo$ = requestEntry$.pipe(filterSuccessfulResponses(), map(function (response) {
            if (hasValue(response.pageInfo)) {
                var resPageInfo = response.pageInfo;
                if (isNotEmpty(resPageInfo) && resPageInfo.currentPage >= 0) {
                    return Object.assign({}, resPageInfo, { currentPage: resPageInfo.currentPage + 1 });
                }
                else {
                    return resPageInfo;
                }
            }
        }));
        var payload$ = observableCombineLatest(tDomainList$, pageInfo$).pipe(map(function (_a) {
            var tDomainList = _a[0], pageInfo = _a[1];
            return new PaginatedList(pageInfo, tDomainList);
        }));
        return this.toRemoteDataObservable(requestEntry$, payload$);
    };
    RemoteDataBuildService.prototype.build = function (normalized) {
        var _this = this;
        var links = {};
        var relationships = getRelationships(normalized.constructor) || [];
        relationships.forEach(function (relationship) {
            var result;
            if (hasValue(normalized[relationship])) {
                var _a = getRelationMetadata(normalized, relationship), resourceType = _a.resourceType, isList = _a.isList;
                var objectList = normalized[relationship].page || normalized[relationship];
                if (typeof objectList !== 'string') {
                    objectList.forEach(function (href) {
                        _this.requestService.configure(new GetRequest(_this.requestService.generateRequestId(), href));
                    });
                    var rdArr_1 = [];
                    objectList.forEach(function (href) {
                        rdArr_1.push(_this.buildSingle(href));
                    });
                    if (isList) {
                        result = _this.aggregate(rdArr_1);
                    }
                    else if (rdArr_1.length === 1) {
                        result = rdArr_1[0];
                    }
                }
                else {
                    _this.requestService.configure(new GetRequest(_this.requestService.generateRequestId(), objectList));
                    // The rest API can return a single URL to represent a list of resources (e.g. /items/:id/bitstreams)
                    // in that case only 1 href will be stored in the normalized obj (so the isArray above fails),
                    // but it should still be built as a list
                    if (isList) {
                        result = _this.buildList(objectList);
                    }
                    else {
                        result = _this.buildSingle(objectList);
                    }
                }
                if (hasValue(normalized[relationship].page)) {
                    links[relationship] = _this.toPaginatedList(result, normalized[relationship].pageInfo);
                }
                else {
                    links[relationship] = result;
                }
            }
        });
        var domainModel = getMapsTo(normalized.constructor);
        return Object.assign(new domainModel(), normalized, links);
    };
    RemoteDataBuildService.prototype.aggregate = function (input) {
        if (isEmpty(input)) {
            return observableOf(new RemoteData(false, false, true, null, []));
        }
        return observableCombineLatest.apply(void 0, input).pipe(map(function (arr) {
            // The request of an aggregate RD should be pending if at least one
            // of the RDs it's based on is still in the state RequestPending
            var requestPending = arr
                .map(function (d) { return d.isRequestPending; })
                .find(function (b) { return b === true; });
            // The response of an aggregate RD should be pending if no requests
            // are still pending and at least one of the RDs it's based
            // on is still in the state ResponsePending
            var responsePending = !requestPending && arr
                .map(function (d) { return d.isResponsePending; })
                .find(function (b) { return b === true; });
            var isSuccessful;
            // isSuccessful should be undefined until all responses have come in.
            // We can't know its state beforehand. We also can't say it's false
            // because that would imply a request failed.
            if (!(requestPending || responsePending)) {
                isSuccessful = arr
                    .map(function (d) { return d.hasSucceeded; })
                    .every(function (b) { return b === true; });
            }
            var errorMessage = arr
                .map(function (d) { return d.error; })
                .map(function (e, idx) {
                if (hasValue(e)) {
                    return "[" + idx + "]: " + e.message;
                }
            }).filter(function (e) { return hasValue(e); })
                .join(', ');
            var statusText = arr
                .map(function (d) { return d.error; })
                .map(function (e, idx) {
                if (hasValue(e)) {
                    return "[" + idx + "]: " + e.statusText;
                }
            }).filter(function (c) { return hasValue(c); })
                .join(', ');
            var statusCode = arr
                .map(function (d) { return d.error; })
                .map(function (e, idx) {
                if (hasValue(e)) {
                    return e.statusCode;
                }
            }).filter(function (c) { return hasValue(c); })
                .reduce(function (acc, status) { return status; }, undefined);
            var error = new RemoteDataError(statusCode, statusText, errorMessage);
            var payload = arr.map(function (d) { return d.payload; });
            return new RemoteData(requestPending, responsePending, isSuccessful, error, payload);
        }));
    };
    RemoteDataBuildService.prototype.toPaginatedList = function (input, pageInfo) {
        return input.pipe(map(function (rd) {
            if (Array.isArray(rd.payload)) {
                return Object.assign(rd, { payload: new PaginatedList(pageInfo, rd.payload) });
            }
            else if (isNotUndefined(rd.payload)) {
                return Object.assign(rd, { payload: new PaginatedList(pageInfo, rd.payload.page) });
            }
            else {
                return Object.assign(rd, { payload: new PaginatedList(pageInfo, []) });
            }
        }));
    };
    RemoteDataBuildService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [ObjectCacheService,
            RequestService])
    ], RemoteDataBuildService);
    return RemoteDataBuildService;
}());
export { RemoteDataBuildService };
//# sourceMappingURL=remote-data-build.service.js.map