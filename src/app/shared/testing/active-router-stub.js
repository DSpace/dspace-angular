import { map } from 'rxjs/operators';
import { convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
var ActivatedRouteStub = /** @class */ (function () {
    function ActivatedRouteStub(params) {
        // ActivatedRoute.params is Observable
        this.subject = new BehaviorSubject(this.testParams);
        this.params = this.subject.asObservable();
        this.queryParams = this.subject.asObservable();
        this.paramMap = this.subject.asObservable().pipe(map(function (params) { return convertToParamMap(params); }));
        this.queryParamMap = this.subject.asObservable().pipe(map(function (params) { return convertToParamMap(params); }));
        if (params) {
            this.testParams = params;
        }
        else {
            this.testParams = {};
        }
    }
    ;
    Object.defineProperty(ActivatedRouteStub.prototype, "testParams", {
        // Test parameters
        get: function () {
            return this._testParams;
        },
        set: function (params) {
            this._testParams = params;
            this.subject.next(params);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ActivatedRouteStub.prototype, "snapshot", {
        // ActivatedRoute.snapshot.params
        get: function () {
            return {
                params: this.testParams,
                queryParamMap: convertToParamMap(this.testParams)
            };
        },
        enumerable: true,
        configurable: true
    });
    return ActivatedRouteStub;
}());
export { ActivatedRouteStub };
//# sourceMappingURL=active-router-stub.js.map