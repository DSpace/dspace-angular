import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
/* tslint:disable:max-classes-per-file */
var DataServiceImpl = /** @class */ (function (_super) {
    tslib_1.__extends(DataServiceImpl, _super);
    function DataServiceImpl(requestService, rdbService, dataBuildService, store, objectCache, halService, notificationsService, http, comparator) {
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
        _this.linkPath = 'dso';
        _this.forceBypassCache = false;
        return _this;
    }
    DataServiceImpl.prototype.getBrowseEndpoint = function (options, linkPath) {
        if (options === void 0) { options = {}; }
        if (linkPath === void 0) { linkPath = this.linkPath; }
        return this.halService.getEndpoint(linkPath);
    };
    DataServiceImpl.prototype.getIDHref = function (endpoint, resourceID) {
        return endpoint.replace(/\{\?uuid\}/, "?uuid=" + resourceID);
    };
    return DataServiceImpl;
}(DataService));
var DSpaceObjectDataService = /** @class */ (function () {
    function DSpaceObjectDataService(requestService, rdbService, dataBuildService, objectCache, halService, notificationsService, http, comparator) {
        this.requestService = requestService;
        this.rdbService = rdbService;
        this.dataBuildService = dataBuildService;
        this.objectCache = objectCache;
        this.halService = halService;
        this.notificationsService = notificationsService;
        this.http = http;
        this.comparator = comparator;
        this.linkPath = 'dso';
        this.dataService = new DataServiceImpl(requestService, rdbService, dataBuildService, null, objectCache, halService, notificationsService, http, comparator);
    }
    DSpaceObjectDataService.prototype.findById = function (uuid) {
        return this.dataService.findById(uuid);
    };
    DSpaceObjectDataService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            RemoteDataBuildService,
            NormalizedObjectBuildService,
            ObjectCacheService,
            HALEndpointService,
            NotificationsService,
            HttpClient,
            DSOChangeAnalyzer])
    ], DSpaceObjectDataService);
    return DSpaceObjectDataService;
}());
export { DSpaceObjectDataService };
//# sourceMappingURL=dspace-object-data.service.js.map