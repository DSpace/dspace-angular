import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs/operators';
import { EpersonService } from './eperson.service';
import { RequestService } from '../data/request.service';
import { FindAllOptions } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { SearchParam } from '../cache/models/search-param.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NormalizedObjectBuildService } from '../cache/builders/normalized-object-build.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
/**
 * Provides methods to retrieve eperson group resources.
 */
var GroupEpersonService = /** @class */ (function (_super) {
    tslib_1.__extends(GroupEpersonService, _super);
    function GroupEpersonService(comparator, dataBuildService, http, notificationsService, requestService, rdbService, store, objectCache, halService) {
        var _this = _super.call(this) || this;
        _this.comparator = comparator;
        _this.dataBuildService = dataBuildService;
        _this.http = http;
        _this.notificationsService = notificationsService;
        _this.requestService = requestService;
        _this.rdbService = rdbService;
        _this.store = store;
        _this.objectCache = objectCache;
        _this.halService = halService;
        _this.linkPath = 'groups';
        _this.browseEndpoint = '';
        _this.forceBypassCache = false;
        return _this;
    }
    /**
     * Check if the current user is member of to the indicated group
     *
     * @param groupName
     *    the group name
     * @return boolean
     *    true if user is member of the indicated group, false otherwise
     */
    GroupEpersonService.prototype.isMemberOf = function (groupName) {
        var searchHref = 'isMemberOf';
        var options = new FindAllOptions();
        options.searchParams = [new SearchParam('groupName', groupName)];
        return this.searchBy(searchHref, options).pipe(filter(function (groups) { return !groups.isResponsePending; }), take(1), map(function (groups) { return groups.payload.totalElements > 0; }));
    };
    GroupEpersonService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [DSOChangeAnalyzer,
            NormalizedObjectBuildService,
            HttpClient,
            NotificationsService,
            RequestService,
            RemoteDataBuildService,
            Store,
            ObjectCacheService,
            HALEndpointService])
    ], GroupEpersonService);
    return GroupEpersonService;
}(EpersonService));
export { GroupEpersonService };
//# sourceMappingURL=group-eperson.service.js.map