import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { renderFilterType } from '../search-filter-type-decorator';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { FILTER_CONFIG, IN_PLACE_SEARCH } from '../search-filter.service';
var SearchFacetFilterWrapperComponent = /** @class */ (function () {
    function SearchFacetFilterWrapperComponent(injector) {
        this.injector = injector;
    }
    /**
     * Initialize and add the filter config to the injector
     */
    SearchFacetFilterWrapperComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchFilter = this.getSearchFilter();
        this.objectInjector = Injector.create({
            providers: [
                { provide: FILTER_CONFIG, useFactory: function () { return (_this.filterConfig); }, deps: [] },
                { provide: IN_PLACE_SEARCH, useFactory: function () { return (_this.inPlaceSearch); }, deps: [] }
            ],
            parent: this.injector
        });
    };
    /**
     * Find the correct component based on the filter config's type
     */
    SearchFacetFilterWrapperComponent.prototype.getSearchFilter = function () {
        var type = this.filterConfig.type;
        return renderFilterType(type);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", SearchFilterConfig)
    ], SearchFacetFilterWrapperComponent.prototype, "filterConfig", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchFacetFilterWrapperComponent.prototype, "inPlaceSearch", void 0);
    SearchFacetFilterWrapperComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-facet-filter-wrapper',
            templateUrl: './search-facet-filter-wrapper.component.html'
        })
        /**
         * Wrapper component that renders a specific facet filter based on the filter config's type
         */
        ,
        tslib_1.__metadata("design:paramtypes", [Injector])
    ], SearchFacetFilterWrapperComponent);
    return SearchFacetFilterWrapperComponent;
}());
export { SearchFacetFilterWrapperComponent };
//# sourceMappingURL=search-facet-filter-wrapper.component.js.map