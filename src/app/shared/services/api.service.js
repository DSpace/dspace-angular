import * as tslib_1 from "tslib";
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
var ApiService = /** @class */ (function () {
    function ApiService(_http) {
        this._http = _http;
    }
    /**
     * whatever domain/feature method name
     */
    ApiService.prototype.get = function (url, options) {
        return this._http.get(url, options).pipe(catchError(function (err) {
            console.log('Error: ', err);
            return observableThrowError(err);
        }));
    };
    ApiService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], ApiService);
    return ApiService;
}());
export { ApiService };
//# sourceMappingURL=api.service.js.map