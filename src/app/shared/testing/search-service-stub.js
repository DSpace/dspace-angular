import { of as observableOf, BehaviorSubject } from 'rxjs';
import { SetViewMode } from '../view-mode';
var SearchServiceStub = /** @class */ (function () {
    function SearchServiceStub(searchLink) {
        if (searchLink === void 0) { searchLink = '/search'; }
        this.searchLink = searchLink;
        this.subject = new BehaviorSubject(this.testViewMode);
        this.viewMode = this.subject.asObservable();
        this.setViewMode(SetViewMode.List);
    }
    SearchServiceStub.prototype.getViewMode = function () {
        return this.viewMode;
    };
    SearchServiceStub.prototype.setViewMode = function (viewMode) {
        this.testViewMode = viewMode;
    };
    SearchServiceStub.prototype.getFacetValuesFor = function () {
        return null;
    };
    Object.defineProperty(SearchServiceStub.prototype, "testViewMode", {
        get: function () {
            return this._viewMode;
        },
        set: function (viewMode) {
            this._viewMode = viewMode;
            this.subject.next(viewMode);
        },
        enumerable: true,
        configurable: true
    });
    SearchServiceStub.prototype.getSearchLink = function () {
        return this.searchLink;
    };
    SearchServiceStub.prototype.getFilterLabels = function () {
        return observableOf([]);
    };
    SearchServiceStub.prototype.search = function () {
        return observableOf({});
    };
    return SearchServiceStub;
}());
export { SearchServiceStub };
//# sourceMappingURL=search-service-stub.js.map