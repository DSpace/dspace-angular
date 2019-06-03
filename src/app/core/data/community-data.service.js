import * as tslib_1 from "tslib";
import { filter, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ComColDataService } from './comcol-data.service';
import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { FindAllRequest } from './request.models';
import { hasValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
var CommunityDataService = /** @class */ (function (_super) {
    tslib_1.__extends(CommunityDataService, _super);
    function CommunityDataService(requestService, rdbService, dataBuildService, store, objectCache, halService, notificationsService, http, comparator) {
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
        _this.linkPath = 'communities';
        _this.topLinkPath = 'communities/search/top';
        _this.cds = _this;
        _this.forceBypassCache = false;
        return _this;
    }
    CommunityDataService.prototype.getEndpoint = function () {
        return this.halService.getEndpoint(this.linkPath);
    };
    CommunityDataService.prototype.findTop = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var hrefObs = this.getFindAllHref(options, this.topLinkPath);
        hrefObs.pipe(filter(function (href) { return hasValue(href); }), take(1))
            .subscribe(function (href) {
            var request = new FindAllRequest(_this.requestService.generateRequestId(), href, options);
            _this.requestService.configure(request);
        });
        return this.rdbService.buildList(hrefObs);
    };
    CommunityDataService = tslib_1.__decorate([
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
    ], CommunityDataService);
    return CommunityDataService;
}(ComColDataService));
export { CommunityDataService };
//# sourceMappingURL=community-data.service.js.map