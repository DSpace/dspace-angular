import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { GetRequest } from '../../../core/data/request.models';
import { RequestService } from '../../../core/data/request.service';
import { FilteredDiscoveryPageResponseParsingService } from '../../../core/data/filtered-discovery-page-response-parsing.service';
import { hasValue } from '../../../shared/empty.util';
import { configureRequest, getResponseFromEntry } from '../../../core/shared/operators';
import { RouteService } from '../../../shared/services/route.service';
/**
 * Service for performing actions on the filtered-discovery-pages REST endpoint
 */
var SearchFixedFilterService = /** @class */ (function () {
    function SearchFixedFilterService(routeService, requestService, halService) {
        this.routeService = routeService;
        this.requestService = requestService;
        this.halService = halService;
        this.queryByFilterPath = 'filtered-discovery-pages';
    }
    /**
     * Get the filter query for a certain filter by name
     * @param {string} filterName     Name of the filter
     * @returns {Observable<string>}  Filter query
     */
    SearchFixedFilterService.prototype.getQueryByFilterName = function (filterName) {
        if (hasValue(filterName)) {
            var requestUuid_1 = this.requestService.generateRequestId();
            this.halService.getEndpoint(this.queryByFilterPath).pipe(map(function (url) {
                url += ('/' + filterName);
                var request = new GetRequest(requestUuid_1, url);
                return Object.assign(request, {
                    getResponseParser: function () {
                        return FilteredDiscoveryPageResponseParsingService;
                    }
                });
            }), configureRequest(this.requestService)).subscribe();
            // get search results from response cache
            var filterQuery = this.requestService.getByUUID(requestUuid_1).pipe(getResponseFromEntry(), map(function (response) {
                return response.filterQuery;
            }));
            return filterQuery;
        }
        return observableOf(undefined);
    };
    /**
     * Get the query for looking up items by relation type
     * @param {string} relationType   Relation type
     * @param {string} itemUUID       Item UUID
     * @returns {string}              Query
     */
    SearchFixedFilterService.prototype.getQueryByRelations = function (relationType, itemUUID) {
        return "query=relation." + relationType + ":" + itemUUID;
    };
    /**
     * Get the filter for a relation with the item's UUID
     * @param relationType    The type of relation e.g. 'isAuthorOfPublication'
     * @param itemUUID        The item's UUID
     */
    SearchFixedFilterService.prototype.getFilterByRelation = function (relationType, itemUUID) {
        return "f." + relationType + "=" + itemUUID;
    };
    SearchFixedFilterService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RouteService,
            RequestService,
            HALEndpointService])
    ], SearchFixedFilterService);
    return SearchFixedFilterService;
}());
export { SearchFixedFilterService };
//# sourceMappingURL=search-fixed-filter.service.js.map