import * as tslib_1 from "tslib";
import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
import { SEARCH_CONFIG_SERVICE } from '../../+my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../search-service/search-configuration.service';
import { SearchService } from '../search-service/search.service';
var SearchSwitchConfigurationComponent = /** @class */ (function () {
    function SearchSwitchConfigurationComponent(router, searchService, searchConfigService) {
        this.router = router;
        this.searchService = searchService;
        this.searchConfigService = searchConfigService;
        /**
         * The list of available configuration options
         */
        this.configurationList = [];
    }
    /**
     * Init current configuration
     */
    SearchSwitchConfigurationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchConfigService.getCurrentConfiguration('default')
            .subscribe(function (currentConfiguration) { return _this.selectedOption = currentConfiguration; });
    };
    /**
     * Init current configuration
     */
    SearchSwitchConfigurationComponent.prototype.onSelect = function () {
        var navigationExtras = {
            queryParams: { configuration: this.selectedOption },
        };
        this.router.navigate([this.searchService.getSearchLink()], navigationExtras);
    };
    /**
     * Define the select 'compareWith' method to tell Angular how to compare the values
     *
     * @param item1
     * @param item2
     */
    SearchSwitchConfigurationComponent.prototype.compare = function (item1, item2) {
        return item1 === item2;
    };
    /**
     * Make sure the subscription is unsubscribed from when this component is destroyed
     */
    SearchSwitchConfigurationComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], SearchSwitchConfigurationComponent.prototype, "configurationList", void 0);
    SearchSwitchConfigurationComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-switch-configuration',
            styleUrls: ['./search-switch-configuration.component.scss'],
            templateUrl: './search-switch-configuration.component.html',
        })
        /**
         * Represents a select that allow to switch over available search configurations
         */
        ,
        tslib_1.__param(2, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__metadata("design:paramtypes", [Router,
            SearchService,
            SearchConfigurationService])
    ], SearchSwitchConfigurationComponent);
    return SearchSwitchConfigurationComponent;
}());
export { SearchSwitchConfigurationComponent };
//# sourceMappingURL=search-switch-configuration.component.js.map