import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestService } from '../data/request.service';
import { TasksService } from './tasks.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
/**
 * The service handling all REST requests for ClaimedTask
 */
var ClaimedTaskDataService = /** @class */ (function (_super) {
    tslib_1.__extends(ClaimedTaskDataService, _super);
    /**
     * Initialize instance variables
     *
     * @param {RequestService} requestService
     * @param {RemoteDataBuildService} rdbService
     * @param {NormalizedObjectBuildService} dataBuildService
     * @param {Store<CoreState>} store
     * @param {ObjectCacheService} objectCache
     * @param {HALEndpointService} halService
     * @param {NotificationsService} notificationsService
     * @param {HttpClient} http
     * @param {DSOChangeAnalyzer<ClaimedTask} comparator
     */
    function ClaimedTaskDataService(requestService, rdbService, dataBuildService, store, objectCache, halService, notificationsService, http, comparator) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.rdbService = rdbService;
        _this.dataBuildService = dataBuildService;
        _this.store = store;
        _this.objectCache = objectCache;
        _this.halService = halService;
        _this.notificationsService = notificationsService;
        _this.http = http;
        _this.comparator = comparator;
        /**
         * The endpoint link name
         */
        _this.linkPath = 'claimedtasks';
        /**
         * When true, a new request is always dispatched
         */
        _this.forceBypassCache = true;
        return _this;
    }
    /**
     * Make a request to approve the given task
     *
     * @param scopeId
     *    The task id
     * @return {Observable<ProcessTaskResponse>}
     *    Emit the server response
     */
    ClaimedTaskDataService.prototype.approveTask = function (scopeId) {
        var body = {
            submit_approve: 'true'
        };
        return this.postToEndpoint(this.linkPath, this.requestService.uriEncodeBody(body), scopeId, this.makeHttpOptions());
    };
    /**
     * Make a request to reject the given task
     *
     * @param reason
     *    The reason of reject
     * @param scopeId
     *    The task id
     * @return {Observable<ProcessTaskResponse>}
     *    Emit the server response
     */
    ClaimedTaskDataService.prototype.rejectTask = function (reason, scopeId) {
        var body = {
            submit_reject: 'true',
            reason: reason
        };
        return this.postToEndpoint(this.linkPath, this.requestService.uriEncodeBody(body), scopeId, this.makeHttpOptions());
    };
    /**
     * Make a request to return the given task to the pool
     *
     * @param scopeId
     *    The task id
     * @return {Observable<ProcessTaskResponse>}
     *    Emit the server response
     */
    ClaimedTaskDataService.prototype.returnToPoolTask = function (scopeId) {
        return this.deleteById(this.linkPath, scopeId, this.makeHttpOptions());
    };
    ClaimedTaskDataService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            RemoteDataBuildService,
            NormalizedObjectBuildService,
            Store,
            ObjectCacheService,
            HALEndpointService,
            NotificationsService,
            HttpClient,
            DSOChangeAnalyzer])
    ], ClaimedTaskDataService);
    return ClaimedTaskDataService;
}(TasksService));
export { ClaimedTaskDataService };
//# sourceMappingURL=claimed-task-data.service.js.map