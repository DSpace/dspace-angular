import { BehaviorSubject } from 'rxjs';
var MockActivatedRoute = /** @class */ (function () {
    function MockActivatedRoute(params) {
        // ActivatedRoute.params is Observable
        this.subject = new BehaviorSubject(this.testParams);
        this.params = this.subject.asObservable();
        this.queryParams = this.subject.asObservable();
        if (params) {
            this.testParams = params;
        }
        else {
            this.testParams = {};
        }
    }
    Object.defineProperty(MockActivatedRoute.prototype, "testParams", {
        // Test parameters
        get: function () { return this._testParams; },
        set: function (params) {
            this._testParams = params;
            this.subject.next(params);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MockActivatedRoute.prototype, "snapshot", {
        // ActivatedRoute.snapshot.params
        get: function () {
            return { params: this.testParams, queryParams: this.testParams };
        },
        enumerable: true,
        configurable: true
    });
    return MockActivatedRoute;
}());
export { MockActivatedRoute };
//# sourceMappingURL=mock-active-router.js.map