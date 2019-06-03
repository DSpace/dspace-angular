import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { SearchSuccessResponse } from '../cache/response.models';
import { DSOResponseParsingService } from './dso-response-parsing.service';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { hasValue } from '../../shared/empty.util';
import { SearchQueryResponse } from '../../+search-page/search-service/search-query-response.model';
import { MetadataValue } from '../shared/metadata.models';
var MyDSpaceResponseParsingService = /** @class */ (function () {
    function MyDSpaceResponseParsingService(dsoParser) {
        this.dsoParser = dsoParser;
    }
    MyDSpaceResponseParsingService.prototype.parse = function (request, data) {
        var _this = this;
        // fallback for unexpected empty response
        var emptyPayload = {
            _embedded: {
                objects: []
            }
        };
        var payload = data.payload._embedded.searchResult || emptyPayload;
        var hitHighlights = payload._embedded.objects
            .map(function (object) { return object.hitHighlights; })
            .map(function (hhObject) {
            var mdMap = {};
            if (hhObject) {
                for (var _i = 0, _a = Object.keys(hhObject); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var value = Object.assign(new MetadataValue(), {
                        value: hhObject[key].join('...'),
                        language: null
                    });
                    mdMap[key] = [value];
                }
            }
            return mdMap;
        });
        var dsoSelfLinks = payload._embedded.objects
            .filter(function (object) { return hasValue(object._embedded); })
            .map(function (object) { return object._embedded.indexableObject; })
            .map(function (dso) { return _this.dsoParser.parse(request, {
            payload: dso,
            statusCode: data.statusCode,
            statusText: data.statusText
        }); })
            .map(function (obj) { return obj.resourceSelfLinks; })
            .reduce(function (combined, thisElement) { return combined.concat(thisElement); }, []);
        var objects = payload._embedded.objects
            .filter(function (object) { return hasValue(object._embedded); })
            .map(function (object, index) { return Object.assign({}, object, {
            indexableObject: dsoSelfLinks[index],
            hitHighlights: hitHighlights[index],
            _embedded: _this.filterEmbeddedObjects(object)
        }); });
        payload.objects = objects;
        var deserialized = new DSpaceRESTv2Serializer(SearchQueryResponse).deserialize(payload);
        return new SearchSuccessResponse(deserialized, data.statusCode, data.statusText, this.dsoParser.processPageInfo(payload));
    };
    MyDSpaceResponseParsingService.prototype.filterEmbeddedObjects = function (object) {
        var allowedEmbeddedKeys = ['submitter', 'item', 'workspaceitem', 'workflowitem'];
        if (object._embedded.indexableObject && object._embedded.indexableObject._embedded) {
            return Object.assign({}, object._embedded, {
                indexableObject: Object.assign({}, object._embedded.indexableObject, {
                    _embedded: Object.keys(object._embedded.indexableObject._embedded)
                        .filter(function (key) { return allowedEmbeddedKeys.includes(key); })
                        .reduce(function (obj, key) {
                        obj[key] = object._embedded.indexableObject._embedded[key];
                        return obj;
                    }, {})
                })
            });
        }
        else {
            return object;
        }
    };
    MyDSpaceResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [DSOResponseParsingService])
    ], MyDSpaceResponseParsingService);
    return MyDSpaceResponseParsingService;
}());
export { MyDSpaceResponseParsingService };
//# sourceMappingURL=mydspace-response-parsing.service.js.map