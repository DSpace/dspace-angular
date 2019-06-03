import * as tslib_1 from "tslib";
import { of as observableOf } from 'rxjs';
import { Inject, Injectable, Injector } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { GLOBAL_CONFIG } from '../../../config';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { DSpaceRESTv2Service } from '../dspace-rest-v2/dspace-rest-v2.service';
import { RequestActionTypes, RequestCompleteAction, ResetResponseTimestampsAction } from './request.actions';
import { RequestService } from './request.service';
import { DSpaceRESTv2Serializer } from '../dspace-rest-v2/dspace-rest-v2.serializer';
import { NormalizedObjectFactory } from '../cache/models/normalized-object-factory';
import { catchError, filter, flatMap, map, take } from 'rxjs/operators';
import { ErrorResponse } from '../cache/response.models';
import { StoreActionTypes } from '../../store.actions';
export var addToResponseCacheAndCompleteAction = function (request, envConfig) {
    return function (source) {
        return source.pipe(map(function (response) {
            return new RequestCompleteAction(request.uuid, response);
        }));
    };
};
var RequestEffects = /** @class */ (function () {
    function RequestEffects(EnvConfig, actions$, restApi, injector, requestService) {
        var _this = this;
        this.EnvConfig = EnvConfig;
        this.actions$ = actions$;
        this.restApi = restApi;
        this.injector = injector;
        this.requestService = requestService;
        this.execute = this.actions$.pipe(ofType(RequestActionTypes.EXECUTE), flatMap(function (action) {
            return _this.requestService.getByUUID(action.payload).pipe(take(1));
        }), filter(function (entry) { return hasValue(entry); }), map(function (entry) { return entry.request; }), flatMap(function (request) {
            var body;
            if (isNotEmpty(request.body)) {
                var serializer = new DSpaceRESTv2Serializer(NormalizedObjectFactory.getConstructor(request.body.type));
                body = serializer.serialize(request.body);
            }
            return _this.restApi.request(request.method, request.href, body, request.options).pipe(map(function (data) { return _this.injector.get(request.getResponseParser()).parse(request, data); }), addToResponseCacheAndCompleteAction(request, _this.EnvConfig), catchError(function (error) { return observableOf(new ErrorResponse(error)).pipe(addToResponseCacheAndCompleteAction(request, _this.EnvConfig)); }));
        }));
        /**
         * When the store is rehydrated in the browser, set all cache
         * timestamps to 'now', because the time zone of the server can
         * differ from the client.
         *
         * This assumes that the server cached everything a negligible
         * time ago, and will likely need to be revisited later
         */
        this.fixTimestampsOnRehydrate = this.actions$
            .pipe(ofType(StoreActionTypes.REHYDRATE), map(function () { return new ResetResponseTimestampsAction(new Date().getTime()); }));
    }
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], RequestEffects.prototype, "execute", void 0);
    tslib_1.__decorate([
        Effect(),
        tslib_1.__metadata("design:type", Object)
    ], RequestEffects.prototype, "fixTimestampsOnRehydrate", void 0);
    RequestEffects = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, Actions,
            DSpaceRESTv2Service,
            Injector,
            RequestService])
    ], RequestEffects);
    return RequestEffects;
}());
export { RequestEffects };
/* tslint:enable:max-classes-per-file */
//# sourceMappingURL=request.effects.js.map