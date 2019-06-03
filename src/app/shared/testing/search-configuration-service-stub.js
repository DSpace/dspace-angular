import { BehaviorSubject, of as observableOf } from 'rxjs';
var SearchConfigurationServiceStub = /** @class */ (function () {
    function SearchConfigurationServiceStub() {
        this.searchOptions = new BehaviorSubject({});
        this.paginatedSearchOptions = new BehaviorSubject({});
    }
    SearchConfigurationServiceStub.prototype.getCurrentFrontendFilters = function () {
        return observableOf([]);
    };
    SearchConfigurationServiceStub.prototype.getCurrentScope = function (a) {
        return observableOf('test-id');
    };
    SearchConfigurationServiceStub.prototype.getCurrentConfiguration = function (a) {
        return observableOf(a);
    };
    return SearchConfigurationServiceStub;
}());
export { SearchConfigurationServiceStub };
//# sourceMappingURL=search-configuration-service-stub.js.map