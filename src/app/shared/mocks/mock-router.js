import { of as observableOf } from 'rxjs';
/**
 * Mock for [[RouterService]]
 */
var MockRouter = /** @class */ (function () {
    function MockRouter() {
        this.events = observableOf({});
        this.routerState = {
            snapshot: {
                url: '',
                root: {
                    queryParamMap: null
                }
            }
        };
        // noinspection TypeScriptUnresolvedFunction
        this.navigate = jasmine.createSpy('navigate');
        this.navigateByUrl = jasmine.createSpy('navigateByUrl');
    }
    MockRouter.prototype.setRoute = function (route) {
        this.routerState.snapshot.url = route;
    };
    MockRouter.prototype.setParams = function (paramsMap) {
        this.routerState.snapshot.root.queryParamMap = paramsMap;
    };
    MockRouter.prototype.createUrlTree = function (commands, navExtras) {
        if (navExtras === void 0) { navExtras = {}; }
        return {};
    };
    return MockRouter;
}());
export { MockRouter };
//# sourceMappingURL=mock-router.js.map