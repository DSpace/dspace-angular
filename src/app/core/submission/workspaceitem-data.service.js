import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { DataService } from '../data/data.service';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
/**
 * A service that provides methods to make REST requests with workspaceitems endpoint.
 */
var WorkspaceitemDataService = /** @class */ (function (_super) {
    tslib_1.__extends(WorkspaceitemDataService, _super);
    function WorkspaceitemDataService(comparator, dataBuildService, halService, http, notificationsService, requestService, rdbService, objectCache, store) {
        var _this = _super.call(this) || this;
        _this.comparator = comparator;
        _this.dataBuildService = dataBuildService;
        _this.halService = halService;
        _this.http = http;
        _this.notificationsService = notificationsService;
        _this.requestService = requestService;
        _this.rdbService = rdbService;
        _this.objectCache = objectCache;
        _this.store = store;
        _this.linkPath = 'workspaceitems';
        _this.forceBypassCache = true;
        return _this;
    }
    WorkspaceitemDataService.prototype.getBrowseEndpoint = function (options) {
        return this.halService.getEndpoint(this.linkPath);
    };
    WorkspaceitemDataService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [DSOChangeAnalyzer,
            NormalizedObjectBuildService,
            HALEndpointService,
            HttpClient,
            NotificationsService,
            RequestService,
            RemoteDataBuildService,
            ObjectCacheService,
            Store])
    ], WorkspaceitemDataService);
    return WorkspaceitemDataService;
}(DataService));
export { WorkspaceitemDataService };
//# sourceMappingURL=workspaceitem-data.service.js.map