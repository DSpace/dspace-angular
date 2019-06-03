import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { DataService } from './data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
/**
 * A service responsible for fetching/sending data from/to the REST API on the metadataschemas endpoint
 */
var MetadataSchemaDataService = /** @class */ (function (_super) {
    tslib_1.__extends(MetadataSchemaDataService, _super);
    function MetadataSchemaDataService(requestService, rdbService, store, halService, objectCache, comparator, dataBuildService, http, notificationsService) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.rdbService = rdbService;
        _this.store = store;
        _this.halService = halService;
        _this.objectCache = objectCache;
        _this.comparator = comparator;
        _this.dataBuildService = dataBuildService;
        _this.http = http;
        _this.notificationsService = notificationsService;
        _this.linkPath = 'metadataschemas';
        _this.forceBypassCache = false;
        return _this;
    }
    /**
     * Get the endpoint for browsing metadataschemas
     * @param {FindAllOptions} options
     * @returns {Observable<string>}
     */
    MetadataSchemaDataService.prototype.getBrowseEndpoint = function (options, linkPath) {
        if (options === void 0) { options = {}; }
        if (linkPath === void 0) { linkPath = this.linkPath; }
        return null;
    };
    MetadataSchemaDataService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            RemoteDataBuildService,
            Store,
            HALEndpointService,
            ObjectCacheService,
            DefaultChangeAnalyzer,
            NormalizedObjectBuildService,
            HttpClient,
            NotificationsService])
    ], MetadataSchemaDataService);
    return MetadataSchemaDataService;
}(DataService));
export { MetadataSchemaDataService };
//# sourceMappingURL=metadata-schema-data.service.js.map