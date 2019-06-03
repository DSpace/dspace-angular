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
 * The service handling all REST requests for PoolTask
 */
var PoolTaskDataService = /** @class */ (function (_super) {
    tslib_1.__extends(PoolTaskDataService, _super);
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
    function PoolTaskDataService(requestService, rdbService, dataBuildService, store, objectCache, halService, notificationsService, http, comparator) {
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
        _this.linkPath = 'pooltasks';
        /**
         * When true, a new request is always dispatched
         */
        _this.forceBypassCache = true;
        return _this;
    }
    /**
     * Make a request to claim the given task
     *
     * @param scopeId
     *    The task id
     * @return {Observable<ProcessTaskResponse>}
     *    Emit the server response
     */
    PoolTaskDataService.prototype.claimTask = function (scopeId) {
        return this.postToEndpoint(this.linkPath, {}, scopeId, this.makeHttpOptions());
    };
    PoolTaskDataService = tslib_1.__decorate([
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
    ], PoolTaskDataService);
    return PoolTaskDataService;
}(TasksService));
export { PoolTaskDataService };
//# sourceMappingURL=pool-task-data.service.js.map