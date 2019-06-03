import { distinctUntilChanged, filter, find, first, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { hasValue, isNotEmpty, isNotEmptyOperator } from '../../shared/empty.util';
import { URLCombiner } from '../url-combiner/url-combiner';
import { CreateRequest, DeleteByIDRequest, FindAllRequest, FindByIDRequest, GetRequest } from './request.models';
import { configureRequest, getResponseFromEntry } from '../shared/operators';
import { ErrorResponse } from '../cache/response.models';
import { NotificationOptions } from '../../shared/notifications/models/notification-options.model';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
var DataService = /** @class */ (function () {
    function DataService() {
        this.forceBypassCache = false;
    }
    /**
     * Create the HREF with given options object
     *
     * @param options The [[FindAllOptions]] object
     * @param linkPath The link path for the object
     * @return {Observable<string>}
     *    Return an observable that emits created HREF
     */
    DataService.prototype.getFindAllHref = function (options, linkPath) {
        if (options === void 0) { options = {}; }
        var result;
        var args = [];
        result = this.getBrowseEndpoint(options, linkPath).pipe(distinctUntilChanged());
        return this.buildHrefFromFindOptions(result, args, options);
    };
    /**
     * Create the HREF for a specific object's search method with given options object
     *
     * @param searchMethod The search method for the object
     * @param options The [[FindAllOptions]] object
     * @return {Observable<string>}
     *    Return an observable that emits created HREF
     */
    DataService.prototype.getSearchByHref = function (searchMethod, options) {
        if (options === void 0) { options = {}; }
        var result;
        var args = [];
        result = this.getSearchEndpoint(searchMethod);
        if (hasValue(options.searchParams)) {
            options.searchParams.forEach(function (param) {
                args.push(param.fieldName + "=" + param.fieldValue);
            });
        }
        return this.buildHrefFromFindOptions(result, args, options);
    };
    /**
     * Turn an options object into a query string and combine it with the given HREF
     *
     * @param href$ The HREF to which the query string should be appended
     * @param args Array with additional params to combine with query string
     * @param options The [[FindAllOptions]] object
     * @return {Observable<string>}
     *    Return an observable that emits created HREF
     */
    DataService.prototype.buildHrefFromFindOptions = function (href$, args, options) {
        if (hasValue(options.currentPage) && typeof options.currentPage === 'number') {
            /* TODO: this is a temporary fix for the pagination start index (0 or 1) discrepancy between the rest and the frontend respectively */
            args.push("page=" + (options.currentPage - 1));
        }
        if (hasValue(options.elementsPerPage)) {
            args.push("size=" + options.elementsPerPage);
        }
        if (hasValue(options.sort)) {
            args.push("sort=" + options.sort.field + "," + options.sort.direction);
        }
        if (hasValue(options.startsWith)) {
            args.push("startsWith=" + options.startsWith);
        }
        if (isNotEmpty(args)) {
            return href$.pipe(map(function (href) { return new URLCombiner(href, "?" + args.join('&')).toString(); }));
        }
        else {
            return href$;
        }
    };
    DataService.prototype.findAll = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var hrefObs = this.getFindAllHref(options);
        hrefObs.pipe(first(function (href) { return hasValue(href); }))
            .subscribe(function (href) {
            var request = new FindAllRequest(_this.requestService.generateRequestId(), href, options);
            _this.requestService.configure(request, _this.forceBypassCache);
        });
        return this.rdbService.buildList(hrefObs);
    };
    /**
     * Create the HREF for a specific object based on its identifier
     * @param endpoint The base endpoint for the type of object
     * @param resourceID The identifier for the object
     */
    DataService.prototype.getIDHref = function (endpoint, resourceID) {
        return endpoint + "/" + resourceID;
    };
    DataService.prototype.findById = function (id) {
        var _this = this;
        var hrefObs = this.halService.getEndpoint(this.linkPath).pipe(map(function (endpoint) { return _this.getIDHref(endpoint, id); }));
        hrefObs.pipe(find(function (href) { return hasValue(href); }))
            .subscribe(function (href) {
            var request = new FindByIDRequest(_this.requestService.generateRequestId(), href, id);
            _this.requestService.configure(request, _this.forceBypassCache);
        });
        return this.rdbService.buildSingle(hrefObs);
    };
    DataService.prototype.findByHref = function (href, options) {
        this.requestService.configure(new GetRequest(this.requestService.generateRequestId(), href, null, options), this.forceBypassCache);
        return this.rdbService.buildSingle(href);
    };
    /**
     * Return object search endpoint by given search method
     *
     * @param searchMethod The search method for the object
     */
    DataService.prototype.getSearchEndpoint = function (searchMethod) {
        return this.halService.getEndpoint(this.linkPath + "/search").pipe(filter(function (href) { return isNotEmpty(href); }), map(function (href) { return href + "/" + searchMethod; }));
    };
    /**
     * Make a new FindAllRequest with given search method
     *
     * @param searchMethod The search method for the object
     * @param options The [[FindAllOptions]] object
     * @return {Observable<RemoteData<PaginatedList<T>>}
     *    Return an observable that emits response from the server
     */
    DataService.prototype.searchBy = function (searchMethod, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var hrefObs = this.getSearchByHref(searchMethod, options);
        hrefObs.pipe(first(function (href) { return hasValue(href); }))
            .subscribe(function (href) {
            var request = new FindAllRequest(_this.requestService.generateRequestId(), href, options);
            _this.requestService.configure(request, true);
        });
        return this.rdbService.buildList(hrefObs);
    };
    /**
     * Add a new patch to the object cache to a specified object
     * @param {string} href The selflink of the object that will be patched
     * @param {Operation[]} operations The patch operations to be performed
     */
    DataService.prototype.patch = function (href, operations) {
        this.objectCache.addPatch(href, operations);
    };
    /**
     * Add a new patch to the object cache
     * The patch is derived from the differences between the given object and its version in the object cache
     * @param {DSpaceObject} object The given object
     */
    DataService.prototype.update = function (object) {
        var _this = this;
        var oldVersion$ = this.objectCache.getObjectBySelfLink(object.self);
        return oldVersion$.pipe(take(1), mergeMap(function (oldVersion) {
            var operations = _this.comparator.diff(oldVersion, object);
            if (isNotEmpty(operations)) {
                _this.objectCache.addPatch(object.self, operations);
            }
            return _this.findById(object.uuid);
        }));
    };
    /**
     * Create a new DSpaceObject on the server, and store the response
     * in the object cache
     *
     * @param {DSpaceObject} dso
     *    The object to create
     * @param {string} parentUUID
     *    The UUID of the parent to create the new object under
     */
    DataService.prototype.create = function (dso, parentUUID) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        var endpoint$ = this.halService.getEndpoint(this.linkPath).pipe(isNotEmptyOperator(), distinctUntilChanged(), map(function (endpoint) { return parentUUID ? endpoint + "?parent=" + parentUUID : endpoint; }));
        var normalizedObject = this.dataBuildService.normalize(dso);
        var serializedDso = new DSpaceRESTv2Serializer(NormalizedObjectFactory.getConstructor(dso.type)).serialize(normalizedObject);
        var request$ = endpoint$.pipe(take(1), map(function (endpoint) { return new CreateRequest(requestId, endpoint, JSON.stringify(serializedDso)); }));
        // Execute the post request
        request$.pipe(configureRequest(this.requestService)).subscribe();
        // Resolve self link for new object
        var selfLink$ = this.requestService.getByUUID(requestId).pipe(getResponseFromEntry(), map(function (response) {
            if (!response.isSuccessful && response instanceof ErrorResponse) {
                _this.notificationsService.error('Server Error:', response.errorMessage, new NotificationOptions(-1));
            }
            else {
                return response;
            }
        }), map(function (response) {
            if (isNotEmpty(response.resourceSelfLinks)) {
                return response.resourceSelfLinks[0];
            }
        }), distinctUntilChanged());
        return selfLink$.pipe(switchMap(function (selfLink) { return _this.findByHref(selfLink); }));
    };
    /**
     * Delete an existing DSpace Object on the server
     * @param dso The DSpace Object to be removed
     * Return an observable that emits true when the deletion was successful, false when it failed
     */
    DataService.prototype.delete = function (dso) {
        var _this = this;
        var requestId = this.requestService.generateRequestId();
        var hrefObs = this.halService.getEndpoint(this.linkPath).pipe(map(function (endpoint) { return _this.getIDHref(endpoint, dso.uuid); }));
        hrefObs.pipe(find(function (href) { return hasValue(href); }), map(function (href) {
            var request = new DeleteByIDRequest(requestId, href, dso.uuid);
            _this.requestService.configure(request);
        })).subscribe();
        return this.requestService.getByUUID(requestId).pipe(find(function (request) { return request.completed; }), map(function (request) { return request.response.isSuccessful; }));
    };
    /**
     * Commit current object changes to the server
     * @param method The RestRequestMethod for which de server sync buffer should be committed
     */
    DataService.prototype.commitUpdates = function (method) {
        this.requestService.commit(method);
    };
    return DataService;
}());
export { DataService };
//# sourceMappingURL=data.service.js.map