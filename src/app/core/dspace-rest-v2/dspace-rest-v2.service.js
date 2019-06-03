import * as tslib_1 from "tslib";
import { throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestRequestMethod } from '../data/rest-request-method';
import { hasNoValue, isNotEmpty } from '../../shared/empty.util';
export var DEFAULT_CONTENT_TYPE = 'application/json; charset=utf-8';
/**
 * Service to access DSpace's REST API
 */
var DSpaceRESTv2Service = /** @class */ (function () {
    function DSpaceRESTv2Service(http) {
        this.http = http;
    }
    /**
     * Performs a request to the REST API with the `get` http method.
     *
     * @param absoluteURL
     *      A URL
     * @return {Observable<string>}
     *      An Observable<string> containing the response from the server
     */
    DSpaceRESTv2Service.prototype.get = function (absoluteURL) {
        var requestOptions = {
            observe: 'response',
            headers: new HttpHeaders({ 'Content-Type': DEFAULT_CONTENT_TYPE })
        };
        return this.http.get(absoluteURL, requestOptions).pipe(map(function (res) { return ({
            payload: res.body,
            statusCode: res.status,
            statusText: res.statusText
        }); }), catchError(function (err) {
            console.log('Error: ', err);
            return observableThrowError({
                statusCode: err.status,
                statusText: err.statusText,
                message: err.message
            });
        }));
    };
    /**
     * Performs a request to the REST API.
     *
     * @param method
     *    the HTTP method for the request
     * @param url
     *    the URL for the request
     * @param body
     *    an optional body for the request
     * @param options
     *    the HttpOptions object
     * @return {Observable<string>}
     *      An Observable<string> containing the response from the server
     */
    DSpaceRESTv2Service.prototype.request = function (method, url, body, options) {
        var requestOptions = {};
        requestOptions.body = body;
        if (method === RestRequestMethod.POST && isNotEmpty(body) && isNotEmpty(body.name)) {
            requestOptions.body = this.buildFormData(body);
        }
        requestOptions.observe = 'response';
        if (options && options.responseType) {
            requestOptions.responseType = options.responseType;
        }
        if (hasNoValue(options) || hasNoValue(options.headers)) {
            requestOptions.headers = new HttpHeaders();
        }
        else {
            requestOptions.headers = options.headers;
        }
        if (!requestOptions.headers.has('Content-Type')) {
            // Because HttpHeaders is immutable, the set method returns a new object instead of updating the existing headers
            requestOptions.headers = requestOptions.headers.set('Content-Type', DEFAULT_CONTENT_TYPE);
        }
        return this.http.request(method, url, requestOptions).pipe(map(function (res) { return ({
            payload: res.body,
            headers: res.headers,
            statusCode: res.status,
            statusText: res.statusText
        }); }), catchError(function (err) {
            console.log('Error: ', err);
            return observableThrowError({
                statusCode: err.status,
                statusText: err.statusText,
                message: err.message
            });
        }));
    };
    /**
     * Create a FormData object from a DSpaceObject
     *
     * @param {DSpaceObject} dso
     *    the DSpaceObject
     * @return {FormData}
     *    the result
     */
    DSpaceRESTv2Service.prototype.buildFormData = function (dso) {
        var form = new FormData();
        form.append('name', dso.name);
        if (dso.metadata) {
            for (var _i = 0, _a = Object.keys(dso.metadata); _i < _a.length; _i++) {
                var key = _a[_i];
                for (var _b = 0, _c = dso.allMetadataValues(key); _b < _c.length; _b++) {
                    var value = _c[_b];
                    form.append(key, value);
                }
            }
        }
        return form;
    };
    DSpaceRESTv2Service = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [HttpClient])
    ], DSpaceRESTv2Service);
    return DSpaceRESTv2Service;
}());
export { DSpaceRESTv2Service };
//# sourceMappingURL=dspace-rest-v2.service.js.map