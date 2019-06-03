import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { first, map, switchMap } from 'rxjs/operators';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { GetRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { configureRequest, filterSuccessfulResponses, getResponseFromEntry, getSucceededRemoteData } from '../../core/shared/operators';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { hasValue, isEmpty, isNotEmpty, isNotUndefined } from '../../shared/empty.util';
import { SearchFilterConfig } from './search-filter-config.model';
import { SearchResponseParsingService } from '../../core/data/search-response-parsing.service';
import { getSearchResultFor } from './search-result-element-decorator';
import { FacetValueResponseParsingService } from '../../core/data/facet-value-response-parsing.service';
import { FacetConfigResponseParsingService } from '../../core/data/facet-config-response-parsing.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ViewMode } from '../../core/shared/view-mode.model';
import { ResourceType } from '../../core/shared/resource-type';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { RouteService } from '../../shared/services/route.service';
/**
 * Service that performs all general actions that have to do with the search page
 */
var SearchService = /** @class */ (function () {
    function SearchService(router, routeService, requestService, rdb, halService, communityService, dspaceObjectService) {
        this.router = router;
        this.routeService = routeService;
        this.requestService = requestService;
        this.rdb = rdb;
        this.halService = halService;
        this.communityService = communityService;
        this.dspaceObjectService = dspaceObjectService;
        /**
         * Endpoint link path for retrieving general search results
         */
        this.searchLinkPath = 'discover/search/objects';
        /**
         * Endpoint link path for retrieving facet config incl values
         */
        this.facetLinkPathPrefix = 'discover/facets/';
        /**
         * The ResponseParsingService constructor name
         */
        this.parser = SearchResponseParsingService;
        /**
         * The RestRequest constructor name
         */
        this.request = GetRequest;
    }
    /**
     * Method to set service options
     * @param {GenericConstructor<ResponseParsingService>} parser The ResponseParsingService constructor name
     * @param {boolean} request The RestRequest constructor name
     */
    SearchService.prototype.setServiceOptions = function (parser, request) {
        if (parser) {
            this.parser = parser;
        }
        if (request) {
            this.request = request;
        }
    };
    /**
     * Method to retrieve a paginated list of search results from the server
     * @param {PaginatedSearchOptions} searchOptions The configuration necessary to perform this search
     * @returns {Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>} Emits a paginated list with all search results found
     */
    SearchService.prototype.search = function (searchOptions) {
        var _this = this;
        var requestObs = this.halService.getEndpoint(this.searchLinkPath).pipe(map(function (url) {
            if (hasValue(searchOptions)) {
                url = searchOptions.toRestUrl(url);
            }
            var request = new _this.request(_this.requestService.generateRequestId(), url);
            var getResponseParserFn = function () {
                return _this.parser;
            };
            return Object.assign(request, {
                getResponseParser: getResponseParserFn
            });
        }), configureRequest(this.requestService));
        var requestEntryObs = requestObs.pipe(switchMap(function (request) { return _this.requestService.getByHref(request.href); }));
        // get search results from response cache
        var sqrObs = requestEntryObs.pipe(filterSuccessfulResponses(), map(function (response) { return response.results; }));
        // turn dspace href from search results to effective list of DSpaceObjects
        // Turn list of observable remote data DSO's into observable remote data object with list of DSO
        var dsoObs = sqrObs.pipe(map(function (sqr) {
            return sqr.objects
                .filter(function (nsr) { return isNotUndefined(nsr.indexableObject); })
                .map(function (nsr) {
                return _this.rdb.buildSingle(nsr.indexableObject);
            });
        }), switchMap(function (input) { return _this.rdb.aggregate(input); }));
        // Create search results again with the correct dso objects linked to each result
        var tDomainListObs = observableCombineLatest(sqrObs, dsoObs).pipe(map(function (_a) {
            var sqr = _a[0], dsos = _a[1];
            return sqr.objects.map(function (object, index) {
                var co = DSpaceObject;
                if (dsos.payload[index]) {
                    var constructor = dsos.payload[index].constructor;
                    co = getSearchResultFor(constructor, searchOptions.configuration);
                    return Object.assign(new co(), object, {
                        indexableObject: dsos.payload[index]
                    });
                }
                else {
                    return undefined;
                }
            });
        }));
        var pageInfoObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.pageInfo; }));
        var payloadObs = observableCombineLatest(tDomainListObs, pageInfoObs).pipe(map(function (_a) {
            var tDomainList = _a[0], pageInfo = _a[1];
            return new PaginatedList(pageInfo, tDomainList);
        }));
        return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
    };
    /**
     * Request the filter configuration for a given scope or the whole repository
     * @param {string} scope UUID of the object for which config the filter config is requested, when no scope is provided the configuration for the whole repository is loaded
     * @param {string} configurationName the name of the configuration
     * @returns {Observable<RemoteData<SearchFilterConfig[]>>} The found filter configuration
     */
    SearchService.prototype.getConfig = function (scope, configurationName) {
        var _this = this;
        var requestObs = this.halService.getEndpoint(this.facetLinkPathPrefix).pipe(map(function (url) {
            var args = [];
            if (isNotEmpty(scope)) {
                args.push("scope=" + scope);
            }
            if (isNotEmpty(configurationName)) {
                args.push("configuration=" + configurationName);
            }
            if (isNotEmpty(args)) {
                url = new URLCombiner(url, "?" + args.join('&')).toString();
            }
            var request = new _this.request(_this.requestService.generateRequestId(), url);
            return Object.assign(request, {
                getResponseParser: function () {
                    return FacetConfigResponseParsingService;
                }
            });
        }), configureRequest(this.requestService));
        var requestEntryObs = requestObs.pipe(switchMap(function (request) { return _this.requestService.getByHref(request.href); }));
        // get search results from response cache
        var facetConfigObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) {
            return response.results.map(function (result) { return Object.assign(new SearchFilterConfig(), result); });
        }));
        return this.rdb.toRemoteDataObservable(requestEntryObs, facetConfigObs);
    };
    /**
     * Method to request a single page of filter values for a given value
     * @param {SearchFilterConfig} filterConfig The filter config for which we want to request filter values
     * @param {number} valuePage The page number of the filter values
     * @param {SearchOptions} searchOptions The search configuration for the current search
     * @param {string} filterQuery The optional query used to filter out filter values
     * @returns {Observable<RemoteData<PaginatedList<FacetValue>>>} Emits the given page of facet values
     */
    SearchService.prototype.getFacetValuesFor = function (filterConfig, valuePage, searchOptions, filterQuery) {
        var _this = this;
        var requestObs = this.halService.getEndpoint(this.facetLinkPathPrefix + filterConfig.name).pipe(map(function (url) {
            var args = ["page=" + (valuePage - 1), "size=" + filterConfig.pageSize];
            if (hasValue(filterQuery)) {
                args.push("prefix=" + filterQuery);
            }
            if (hasValue(searchOptions)) {
                url = searchOptions.toRestUrl(url, args);
            }
            var request = new _this.request(_this.requestService.generateRequestId(), url);
            return Object.assign(request, {
                getResponseParser: function () {
                    return FacetValueResponseParsingService;
                }
            });
        }), configureRequest(this.requestService), first());
        var requestEntryObs = requestObs.pipe(switchMap(function (request) { return _this.requestService.getByHref(request.href); }));
        // get search results from response cache
        var facetValueObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.results; }));
        var pageInfoObs = requestEntryObs.pipe(getResponseFromEntry(), map(function (response) { return response.pageInfo; }));
        var payloadObs = observableCombineLatest(facetValueObs, pageInfoObs).pipe(map(function (_a) {
            var facetValue = _a[0], pageInfo = _a[1];
            return new PaginatedList(pageInfo, facetValue);
        }));
        return this.rdb.toRemoteDataObservable(requestEntryObs, payloadObs);
    };
    /**
     * Request a list of DSpaceObjects that can be used as a scope, based on the current scope
     * @param {string} scopeId UUID of the current scope, if the scope is empty, the repository wide scopes will be returned
     * @returns {Observable<DSpaceObject[]>} Emits a list of DSpaceObjects which represent possible scopes
     */
    SearchService.prototype.getScopes = function (scopeId) {
        if (isEmpty(scopeId)) {
            var top_1 = this.communityService.findTop({ elementsPerPage: 9999 }).pipe(map(function (communities) { return communities.payload.page; }));
            return top_1;
        }
        var scopeObject = this.dspaceObjectService.findById(scopeId).pipe(getSucceededRemoteData());
        var scopeList = scopeObject.pipe(switchMap(function (dsoRD) {
            if (dsoRD.payload.type === ResourceType.Community) {
                var community_1 = dsoRD.payload;
                return observableCombineLatest(community_1.subcommunities, community_1.collections).pipe(map(function (_a) {
                    var subCommunities = _a[0], collections = _a[1];
                    /*if this is a community, we also need to show the direct children*/
                    return [community_1].concat(subCommunities.payload.page, collections.payload.page);
                }));
            }
            else {
                return observableOf([dsoRD.payload]);
            }
        }));
        return scopeList;
    };
    /**
     * Requests the current view mode based on the current URL
     * @returns {Observable<ViewMode>} The current view mode
     */
    SearchService.prototype.getViewMode = function () {
        return this.routeService.getQueryParamMap().pipe(map(function (params) {
            if (isNotEmpty(params.get('view')) && hasValue(params.get('view'))) {
                return params.get('view');
            }
            else {
                return ViewMode.List;
            }
        }));
    };
    /**
     * Changes the current view mode in the current URL
     * @param {ViewMode} viewMode Mode to switch to
     */
    SearchService.prototype.setViewMode = function (viewMode, searchLinkParts) {
        var _this = this;
        this.routeService.getQueryParameterValue('pageSize').pipe(first())
            .subscribe(function (pageSize) {
            var queryParams = { view: viewMode, page: 1 };
            if (viewMode === ViewMode.Detail) {
                queryParams = Object.assign(queryParams, { pageSize: '1' });
            }
            else if (pageSize === '1') {
                queryParams = Object.assign(queryParams, { pageSize: '10' });
            }
            var navigationExtras = {
                queryParams: queryParams,
                queryParamsHandling: 'merge'
            };
            _this.router.navigate(hasValue(searchLinkParts) ? searchLinkParts : [_this.getSearchLink()], navigationExtras);
        });
    };
    /**
     * @returns {string} The base path to the search page
     */
    SearchService.prototype.getSearchLink = function () {
        return '/search';
    };
    /**
     * Unsubscribe from the subscription
     */
    SearchService.prototype.ngOnDestroy = function () {
        if (this.sub !== undefined) {
            this.sub.unsubscribe();
        }
    };
    SearchService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [Router,
            RouteService,
            RequestService,
            RemoteDataBuildService,
            HALEndpointService,
            CommunityDataService,
            DSpaceObjectDataService])
    ], SearchService);
    return SearchService;
}());
export { SearchService };
//# sourceMappingURL=search.service.js.map