import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { filter, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ComColDataService } from './comcol-data.service';
import { CommunityDataService } from './community-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { FindAllOptions } from './request.models';
var CollectionDataService = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionDataService, _super);
    function CollectionDataService(requestService, rdbService, dataBuildService, store, cds, objectCache, halService, notificationsService, http, comparator) {
        var _this = _super.call(this) || this;
        _this.requestService = requestService;
        _this.rdbService = rdbService;
        _this.dataBuildService = dataBuildService;
        _this.store = store;
        _this.cds = cds;
        _this.objectCache = objectCache;
        _this.halService = halService;
        _this.notificationsService = notificationsService;
        _this.http = http;
        _this.comparator = comparator;
        _this.linkPath = 'collections';
        _this.forceBypassCache = false;
        return _this;
    }
    /**
     * Find whether there is a collection whom user has authorization to submit to
     *
     * @return boolean
     *    true if the user has at least one collection to submit to
     */
    CollectionDataService.prototype.hasAuthorizedCollection = function () {
        var searchHref = 'findAuthorized';
        var options = new FindAllOptions();
        options.elementsPerPage = 1;
        return this.searchBy(searchHref, options).pipe(filter(function (collections) { return !collections.isResponsePending; }), take(1), map(function (collections) { return collections.payload.totalElements > 0; }));
    };
    CollectionDataService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [RequestService,
            RemoteDataBuildService,
            NormalizedObjectBuildService,
            Store,
            CommunityDataService,
            ObjectCacheService,
            HALEndpointService,
            NotificationsService,
            HttpClient,
            DSOChangeAnalyzer])
    ], CollectionDataService);
    return CollectionDataService;
}(ComColDataService));
export { CollectionDataService };
//# sourceMappingURL=collection-data.service.js.map