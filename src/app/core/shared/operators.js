import { filter, find, flatMap, map, tap } from 'rxjs/operators';
import { hasValue, hasValueOperator, isNotEmpty } from '../../shared/empty.util';
/**
 * This file contains custom RxJS operators that can be used in multiple places
 */
export var getRequestFromRequestHref = function (requestService) {
    return function (source) {
        return source.pipe(flatMap(function (href) { return requestService.getByHref(href); }), hasValueOperator());
    };
};
export var getRequestFromRequestUUID = function (requestService) {
    return function (source) {
        return source.pipe(flatMap(function (uuid) { return requestService.getByUUID(uuid); }), hasValueOperator());
    };
};
export var filterSuccessfulResponses = function () {
    return function (source) {
        return source.pipe(getResponseFromEntry(), filter(function (response) { return response.isSuccessful === true; }));
    };
};
export var getResponseFromEntry = function () {
    return function (source) {
        return source.pipe(filter(function (entry) { return hasValue(entry) && hasValue(entry.response); }), map(function (entry) { return entry.response; }));
    };
};
export var getResourceLinksFromResponse = function () {
    return function (source) {
        return source.pipe(filterSuccessfulResponses(), map(function (response) { return response.resourceSelfLinks; }));
    };
};
export var configureRequest = function (requestService, forceBypassCache) {
    return function (source) {
        return source.pipe(tap(function (request) { return requestService.configure(request, forceBypassCache); }));
    };
};
export var getRemoteDataPayload = function () {
    return function (source) {
        return source.pipe(map(function (remoteData) { return remoteData.payload; }));
    };
};
export var getSucceededRemoteData = function () {
    return function (source) {
        return source.pipe(find(function (rd) { return rd.hasSucceeded; }));
    };
};
/**
 * Operator that checks if a remote data object contains a page not found error
 * When it does contain such an error, it will redirect the user to a page not found, without altering the current URL
 * @param router The router used to navigate to a new page
 */
export var redirectToPageNotFoundOn404 = function (router) {
    return function (source) {
        return source.pipe(tap(function (rd) {
            if (rd.hasFailed && rd.error.statusCode === 404) {
                router.navigateByUrl('/404', { skipLocationChange: true });
            }
        }));
    };
};
export var getFinishedRemoteData = function () {
    return function (source) {
        return source.pipe(find(function (rd) { return !rd.isLoading; }));
    };
};
export var getAllSucceededRemoteData = function () {
    return function (source) {
        return source.pipe(filter(function (rd) { return rd.hasSucceeded; }));
    };
};
export var toDSpaceObjectListRD = function () {
    return function (source) {
        return source.pipe(filter(function (rd) { return rd.hasSucceeded; }), map(function (rd) {
            var dsoPage = rd.payload.page.map(function (searchResult) { return searchResult.indexableObject; });
            var payload = Object.assign(rd.payload, { page: dsoPage });
            return Object.assign(rd, { payload: payload });
        }));
    };
};
/**
 * Get the browse links from a definition by ID given an array of all definitions
 * @param {string} definitionID
 * @returns {(source: Observable<RemoteData<BrowseDefinition[]>>) => Observable<any>}
 */
export var getBrowseDefinitionLinks = function (definitionID) {
    return function (source) {
        return source.pipe(getRemoteDataPayload(), map(function (browseDefinitions) { return browseDefinitions
            .find(function (def) { return def.id === definitionID; }); }), map(function (def) {
            if (isNotEmpty(def)) {
                return def._links;
            }
            else {
                throw new Error("No metadata browse definition could be found for id '" + definitionID + "'");
            }
        }));
    };
};
/**
 * Get the first occurrence of an object within a paginated list
 */
export var getFirstOccurrence = function () {
    return function (source) {
        return source.pipe(map(function (rd) { return Object.assign(rd, { payload: rd.payload.page.length > 0 ? rd.payload.page[0] : undefined }); }));
    };
};
//# sourceMappingURL=operators.js.map