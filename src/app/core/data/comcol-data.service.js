import * as tslib_1 from "tslib";
import { distinctUntilChanged, filter, map, mergeMap, share, take, tap } from 'rxjs/operators';
import { merge as observableMerge, throwError as observableThrowError } from 'rxjs';
import { isEmpty, isNotEmpty } from '../../shared/empty.util';
import { DataService } from './data.service';
import { FindByIDRequest } from './request.models';
import { getResponseFromEntry } from '../shared/operators';
var ComColDataService = /** @class */ (function (_super) {
    tslib_1.__extends(ComColDataService, _super);
    function ComColDataService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Get the scoped endpoint URL by fetching the object with
     * the given scopeID and returning its HAL link with this
     * data-service's linkPath
     *
     * @param {string} scopeID
     *    the id of the scope object
     * @return { Observable<string> }
     *    an Observable<string> containing the scoped URL
     */
    ComColDataService.prototype.getBrowseEndpoint = function (options, linkPath) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (linkPath === void 0) { linkPath = this.linkPath; }
        if (isEmpty(options.scopeID)) {
            return this.halService.getEndpoint(linkPath);
        }
        else {
            var scopeCommunityHrefObs = this.cds.getEndpoint().pipe(mergeMap(function (endpoint) { return _this.cds.getIDHref(endpoint, options.scopeID); }), filter(function (href) { return isNotEmpty(href); }), take(1), tap(function (href) {
                var request = new FindByIDRequest(_this.requestService.generateRequestId(), href, options.scopeID);
                _this.requestService.configure(request);
            }));
            var responses = scopeCommunityHrefObs.pipe(mergeMap(function (href) { return _this.requestService.getByHref(href); }), getResponseFromEntry());
            var errorResponses = responses.pipe(filter(function (response) { return !response.isSuccessful; }), mergeMap(function () { return observableThrowError(new Error("The Community with scope " + options.scopeID + " couldn't be retrieved")); }));
            var successResponses = responses.pipe(filter(function (response) { return response.isSuccessful; }), mergeMap(function () { return _this.objectCache.getObjectByUUID(options.scopeID); }), map(function (nc) { return nc._links[linkPath]; }), filter(function (href) { return isNotEmpty(href); }));
            return observableMerge(errorResponses, successResponses).pipe(distinctUntilChanged(), share());
        }
    };
    return ComColDataService;
}(DataService));
export { ComColDataService };
//# sourceMappingURL=comcol-data.service.js.map