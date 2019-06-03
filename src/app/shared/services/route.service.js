import * as tslib_1 from "tslib";
import { distinctUntilChanged, filter, map, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import { AddUrlToHistoryAction } from '../history/history.actions';
import { historySelector } from '../history/selectors';
/**
 * Service to keep track of the current query parameters
 */
var RouteService = /** @class */ (function () {
    function RouteService(route, router, store) {
        this.route = route;
        this.router = router;
        this.store = store;
        this.subscribeToRouterParams();
    }
    /**
     * Retrieves all query parameter values based on a parameter name
     * @param paramName The name of the parameter to look for
     */
    RouteService.prototype.getQueryParameterValues = function (paramName) {
        return this.getQueryParamMap().pipe(map(function (params) { return params.getAll(paramName).slice(); }), distinctUntilChanged(function (a, b) { return JSON.stringify(a) === JSON.stringify(b); }));
    };
    /**
     * Retrieves a single query parameter values based on a parameter name
     * @param paramName The name of the parameter to look for
     */
    RouteService.prototype.getQueryParameterValue = function (paramName) {
        return this.getQueryParamMap().pipe(map(function (params) { return params.get(paramName); }), distinctUntilChanged());
    };
    /**
     * Checks if the query parameter currently exists in the route
     * @param paramName The name of the parameter to look for
     */
    RouteService.prototype.hasQueryParam = function (paramName) {
        return this.getQueryParamMap().pipe(map(function (params) { return params.has(paramName); }), distinctUntilChanged());
    };
    /**
     * Checks if the query parameter with a specific value currently exists in the route
     * @param paramName The name of the parameter to look for
     * @param paramValue The value of the parameter to look for
     */
    RouteService.prototype.hasQueryParamWithValue = function (paramName, paramValue) {
        return this.getQueryParamMap().pipe(map(function (params) { return params.getAll(paramName).indexOf(paramValue) > -1; }), distinctUntilChanged());
    };
    RouteService.prototype.getRouteParameterValue = function (paramName) {
        return this.params.pipe(map(function (params) { return params[paramName]; }), distinctUntilChanged());
    };
    RouteService.prototype.getRouteDataValue = function (datafield) {
        return this.route.data.pipe(map(function (data) { return data[datafield]; }), distinctUntilChanged());
    };
    /**
     * Retrieves all query parameters of which the parameter name starts with the given prefix
     * @param prefix The prefix of the parameter name to look for
     */
    RouteService.prototype.getQueryParamsWithPrefix = function (prefix) {
        return this.getQueryParamMap().pipe(map(function (qparams) {
            var params = {};
            qparams.keys
                .filter(function (key) { return key.startsWith(prefix); })
                .forEach(function (key) {
                params[key] = qparams.getAll(key).slice();
            });
            return params;
        }), distinctUntilChanged(function (a, b) { return JSON.stringify(a) === JSON.stringify(b); }));
    };
    RouteService.prototype.getQueryParamMap = function () {
        var _this = this;
        return this.route.queryParamMap.pipe(map(function (paramMap) {
            var snapshot = _this.router.routerState.snapshot;
            // Due to an Angular bug, sometimes change of QueryParam is not detected so double checks with route snapshot
            if (!isEqual(paramMap, snapshot.root.queryParamMap)) {
                return snapshot.root.queryParamMap;
            }
            else {
                return paramMap;
            }
        }));
    };
    RouteService.prototype.saveRouting = function () {
        var _this = this;
        this.router.events
            .pipe(filter(function (event) { return event instanceof NavigationEnd; }))
            .subscribe(function (_a) {
            var urlAfterRedirects = _a.urlAfterRedirects;
            _this.store.dispatch(new AddUrlToHistoryAction(urlAfterRedirects));
        });
    };
    RouteService.prototype.subscribeToRouterParams = function () {
        var _this = this;
        this.params = this.router.events.pipe(mergeMap(function (event) {
            var active = _this.route;
            while (active.firstChild) {
                active = active.firstChild;
            }
            return active.params;
        }));
    };
    RouteService.prototype.getHistory = function () {
        return this.store.pipe(select(historySelector));
    };
    RouteService.prototype.getPreviousUrl = function () {
        return this.getHistory().pipe(map(function (history) { return history[history.length - 2] || ''; }));
    };
    RouteService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute, Router, Store])
    ], RouteService);
    return RouteService;
}());
export { RouteService };
//# sourceMappingURL=route.service.js.map