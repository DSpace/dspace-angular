import { of as observableOf } from 'rxjs';
var RouterStub = /** @class */ (function () {
    function RouterStub() {
        this.routeReuseStrategy = { shouldReuseRoute: {} };
        //noinspection TypeScriptUnresolvedFunction
        this.navigate = jasmine.createSpy('navigate');
        this.parseUrl = jasmine.createSpy('parseUrl');
        this.events = observableOf({});
    }
    RouterStub.prototype.navigateByUrl = function (url) {
        this.url = url;
    };
    return RouterStub;
}());
export { RouterStub };
//# sourceMappingURL=router-stub.js.map