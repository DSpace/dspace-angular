import { hasNoValue, hasValue, isNotEmpty } from '../../shared/empty.util';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { PageInfo } from '../shared/page-info.model';
import { PaginatedList } from './paginated-list';
import { isRestDataObject, isRestPaginatedList } from '../cache/builders/normalized-object-build.service';
/* tslint:disable:max-classes-per-file */
var BaseResponseParsingService = /** @class */ (function () {
    function BaseResponseParsingService() {
    }
    BaseResponseParsingService.prototype.process = function (data, requestUUID) {
        var _this = this;
        if (isNotEmpty(data)) {
            if (hasNoValue(data) || (typeof data !== 'object')) {
                return data;
            }
            else if (isRestPaginatedList(data)) {
                return this.processPaginatedList(data, requestUUID);
            }
            else if (Array.isArray(data)) {
                return this.processArray(data, requestUUID);
            }
            else if (isRestDataObject(data)) {
                var object_1 = this.deserialize(data);
                if (isNotEmpty(data._embedded)) {
                    Object
                        .keys(data._embedded)
                        .filter(function (property) { return data._embedded.hasOwnProperty(property); })
                        .forEach(function (property) {
                        var parsedObj = _this.process(data._embedded[property], requestUUID);
                        if (isNotEmpty(parsedObj)) {
                            if (isRestPaginatedList(data._embedded[property])) {
                                object_1[property] = parsedObj;
                                object_1[property].page = parsedObj.page.map(function (obj) { return _this.retrieveObjectOrUrl(obj); });
                            }
                            else if (isRestDataObject(data._embedded[property])) {
                                object_1[property] = _this.retrieveObjectOrUrl(parsedObj);
                            }
                            else if (Array.isArray(parsedObj)) {
                                object_1[property] = parsedObj.map(function (obj) { return _this.retrieveObjectOrUrl(obj); });
                            }
                        }
                    });
                }
                this.cache(object_1, requestUUID);
                return object_1;
            }
            var result_1 = {};
            Object.keys(data)
                .filter(function (property) { return data.hasOwnProperty(property); })
                .filter(function (property) { return hasValue(data[property]); })
                .forEach(function (property) {
                result_1[property] = _this.process(data[property], requestUUID);
            });
            return result_1;
        }
    };
    BaseResponseParsingService.prototype.processPaginatedList = function (data, requestUUID) {
        var pageInfo = this.processPageInfo(data);
        var list = data._embedded;
        // Workaround for inconsistency in rest response. Issue: https://github.com/DSpace/dspace-angular/issues/238
        if (hasNoValue(list)) {
            list = [];
        }
        else if (!Array.isArray(list)) {
            list = this.flattenSingleKeyObject(list);
        }
        var page = this.processArray(list, requestUUID);
        return new PaginatedList(pageInfo, page);
    };
    BaseResponseParsingService.prototype.processArray = function (data, requestUUID) {
        var _this = this;
        var array = [];
        data.forEach(function (datum) {
            array = array.concat([_this.process(datum, requestUUID)]);
        });
        return array;
    };
    BaseResponseParsingService.prototype.deserialize = function (obj) {
        var type = obj.type;
        if (hasValue(type)) {
            var normObjConstructor = this.objectFactory.getConstructor(type);
            if (hasValue(normObjConstructor)) {
                var serializer = new DSpaceRESTv2Serializer(normObjConstructor);
                return serializer.deserialize(obj);
            }
            else {
                // TODO: move check to Validator?
                // throw new Error(`The server returned an object with an unknown a known type: ${type}`);
                return null;
            }
        }
        else {
            // TODO: move check to Validator
            // throw new Error(`The server returned an object without a type: ${JSON.stringify(obj)}`);
            return null;
        }
    };
    BaseResponseParsingService.prototype.cache = function (obj, requestUUID) {
        if (this.toCache) {
            this.addToObjectCache(obj, requestUUID);
        }
    };
    BaseResponseParsingService.prototype.addToObjectCache = function (co, requestUUID) {
        if (hasNoValue(co) || hasNoValue(co.self)) {
            throw new Error('The server returned an invalid object');
        }
        this.objectCache.add(co, this.EnvConfig.cache.msToLive.default, requestUUID);
    };
    BaseResponseParsingService.prototype.processPageInfo = function (payload) {
        if (hasValue(payload.page)) {
            var pageObj = Object.assign({}, payload.page, { _links: payload._links });
            var pageInfoObject = new DSpaceRESTv2Serializer(PageInfo).deserialize(pageObj);
            if (pageInfoObject.currentPage >= 0) {
                Object.assign(pageInfoObject, { currentPage: pageInfoObject.currentPage + 1 });
            }
            return pageInfoObject;
        }
        else {
            return undefined;
        }
    };
    BaseResponseParsingService.prototype.flattenSingleKeyObject = function (obj) {
        var keys = Object.keys(obj);
        if (keys.length !== 1) {
            throw new Error("Expected an object with a single key, got: " + JSON.stringify(obj));
        }
        return obj[keys[0]];
    };
    BaseResponseParsingService.prototype.retrieveObjectOrUrl = function (obj) {
        return this.toCache ? obj.self : obj;
    };
    BaseResponseParsingService.prototype.isSuccessStatus = function (statusCode) {
        return statusCode >= 200 && statusCode < 300;
    };
    return BaseResponseParsingService;
}());
export { BaseResponseParsingService };
//# sourceMappingURL=base-response-parsing.service.js.map