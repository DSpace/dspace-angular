import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { ErrorResponse, SubmissionSuccessResponse } from '../cache/response.models';
import { isEmpty, isNotEmpty, isNotNull } from '../../shared/empty.util';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedWorkspaceItem } from './models/normalized-workspaceitem.model';
import { NormalizedWorkflowItem } from './models/normalized-workflowitem.model';
import { FormFieldMetadataValueObject } from '../../shared/form/builder/models/form-field-metadata-value.model';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
/**
 * Export a function to check if object has same properties of FormFieldMetadataValueObject
 *
 * @param obj
 */
export function isServerFormValue(obj) {
    return (typeof obj === 'object'
        && obj.hasOwnProperty('value')
        && obj.hasOwnProperty('language')
        && obj.hasOwnProperty('authority')
        && obj.hasOwnProperty('confidence'));
}
/**
 * Export a function to normalize sections object of the server response
 *
 * @param obj
 * @param objIndex
 */
export function normalizeSectionData(obj, objIndex) {
    var result = obj;
    if (isNotNull(obj)) {
        // If is an Instance of FormFieldMetadataValueObject normalize it
        if (typeof obj === 'object' && isServerFormValue(obj)) {
            // If authority property is set normalize as a FormFieldMetadataValueObject object
            /* NOTE: Data received from server could have authority property equal to null, but into form
               field's model is required a FormFieldMetadataValueObject object as field value, so instantiate it */
            result = new FormFieldMetadataValueObject(obj.value, obj.language, obj.authority, (obj.display || obj.value), obj.place || objIndex, obj.confidence, obj.otherInformation);
        }
        else if (Array.isArray(obj)) {
            result = [];
            obj.forEach(function (item, index) {
                result[index] = normalizeSectionData(item, index);
            });
        }
        else if (typeof obj === 'object') {
            result = Object.create({});
            Object.keys(obj)
                .forEach(function (key) {
                result[key] = normalizeSectionData(obj[key]);
            });
        }
    }
    return result;
}
/**
 * Provides methods to parse response for a submission request.
 */
var SubmissionResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(SubmissionResponseParsingService, _super);
    function SubmissionResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = NormalizedObjectFactory;
        _this.toCache = false;
        return _this;
    }
    /**
     * Parses data from the workspaceitems/workflowitems endpoints
     *
     * @param {RestRequest} request
     * @param {DSpaceRESTV2Response} data
     * @returns {RestResponse}
     */
    SubmissionResponseParsingService.prototype.parse = function (request, data) {
        if (isNotEmpty(data.payload)
            && isNotEmpty(data.payload._links)
            && this.isSuccessStatus(data.statusCode)) {
            var dataDefinition = this.processResponse(data.payload, request.href);
            return new SubmissionSuccessResponse(dataDefinition, data.statusCode, data.statusText, this.processPageInfo(data.payload));
        }
        else if (isEmpty(data.payload) && this.isSuccessStatus(data.statusCode)) {
            return new SubmissionSuccessResponse(null, data.statusCode, data.statusText);
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from server'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    /**
     * Parses response and normalize it
     *
     * @param {DSpaceRESTV2Response} data
     * @param {string} requestHref
     * @returns {any[]}
     */
    SubmissionResponseParsingService.prototype.processResponse = function (data, requestHref) {
        var dataDefinition = this.process(data, requestHref);
        var normalizedDefinition = Array.of();
        var processedList = Array.isArray(dataDefinition) ? dataDefinition : Array.of(dataDefinition);
        processedList.forEach(function (item) {
            var normalizedItem = Object.assign({}, item);
            // In case data is an Instance of NormalizedWorkspaceItem normalize field value of all the section of type form
            if (item instanceof NormalizedWorkspaceItem
                || item instanceof NormalizedWorkflowItem) {
                if (item.sections) {
                    var precessedSection_1 = Object.create({});
                    // Iterate over all workspaceitem's sections
                    Object.keys(item.sections)
                        .forEach(function (sectionId) {
                        if (typeof item.sections[sectionId] === 'object' && isNotEmpty(item.sections[sectionId])) {
                            var normalizedSectionData_1 = Object.create({});
                            // Iterate over all sections property
                            Object.keys(item.sections[sectionId])
                                .forEach(function (metdadataId) {
                                var entry = item.sections[sectionId][metdadataId];
                                // If entry is not an array, for sure is not a section of type form
                                if (Array.isArray(entry)) {
                                    normalizedSectionData_1[metdadataId] = [];
                                    entry.forEach(function (valueItem, index) {
                                        // Parse value and normalize it
                                        var normValue = normalizeSectionData(valueItem, index);
                                        if (isNotEmpty(normValue)) {
                                            normalizedSectionData_1[metdadataId].push(normValue);
                                        }
                                    });
                                }
                                else {
                                    normalizedSectionData_1[metdadataId] = entry;
                                }
                            });
                            precessedSection_1[sectionId] = normalizedSectionData_1;
                        }
                    });
                    normalizedItem = Object.assign({}, item, { sections: precessedSection_1 });
                }
            }
            normalizedDefinition.push(normalizedItem);
        });
        return normalizedDefinition;
    };
    SubmissionResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], SubmissionResponseParsingService);
    return SubmissionResponseParsingService;
}(BaseResponseParsingService));
export { SubmissionResponseParsingService };
//# sourceMappingURL=submission-response-parsing.service.js.map