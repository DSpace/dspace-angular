import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { BaseResponseParsingService } from '../data/base-response-parsing.service';
import { GLOBAL_CONFIG } from '../../../config';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { ErrorResponse, TaskResponse } from '../cache/response.models';
/**
 * Provides methods to parse response for a task request.
 */
var TaskResponseParsingService = /** @class */ (function (_super) {
    tslib_1.__extends(TaskResponseParsingService, _super);
    /**
     * Initialize instance variables
     *
     * @param {GlobalConfig} EnvConfig
     * @param {ObjectCacheService} objectCache
     */
    function TaskResponseParsingService(EnvConfig, objectCache) {
        var _this = _super.call(this) || this;
        _this.EnvConfig = EnvConfig;
        _this.objectCache = objectCache;
        _this.objectFactory = NormalizedObjectFactory;
        _this.toCache = false;
        return _this;
    }
    /**
     * Parses data from the tasks endpoints
     *
     * @param {RestRequest} request
     * @param {DSpaceRESTV2Response} data
     * @returns {RestResponse}
     */
    TaskResponseParsingService.prototype.parse = function (request, data) {
        if (this.isSuccessStatus(data.statusCode)) {
            return new TaskResponse(data.statusCode, data.statusText);
        }
        else {
            return new ErrorResponse(Object.assign(new Error('Unexpected response from server'), { statusCode: data.statusCode, statusText: data.statusText }));
        }
    };
    TaskResponseParsingService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, ObjectCacheService])
    ], TaskResponseParsingService);
    return TaskResponseParsingService;
}(BaseResponseParsingService));
export { TaskResponseParsingService };
//# sourceMappingURL=task-response-parsing.service.js.map