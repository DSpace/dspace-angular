import { of as observableOf } from 'rxjs/internal/observable/of';
export var routeServiceStub = {
    /* tslint:disable:no-empty */
    hasQueryParamWithValue: function (param, value) {
    },
    hasQueryParam: function (param) {
    },
    removeQueryParameterValue: function (param, value) {
    },
    addQueryParameterValue: function (param, value) {
    },
    getQueryParameterValues: function (param) {
        return observableOf({});
    },
    getQueryParamsWithPrefix: function (param) {
        return observableOf({});
    },
    getQueryParamMap: function () {
        return observableOf(new Map());
    },
    getQueryParameterValue: function () {
        return observableOf({});
    },
    getRouteParameterValue: function (param) {
        return observableOf('');
    },
    getRouteDataValue: function (param) {
        return observableOf({});
    }
    /* tslint:enable:no-empty */
};
//# sourceMappingURL=route-service-stub.js.map