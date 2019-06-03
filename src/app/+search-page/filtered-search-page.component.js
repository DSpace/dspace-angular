import * as tslib_1 from "tslib";
import { HostWindowService } from '../shared/host-window.service';
import { SearchService } from './search-service/search.service';
import { SearchSidebarService } from './search-sidebar/search-sidebar.service';
import { SearchPageComponent } from './search-page.component';
import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { pushInOut } from '../shared/animations/push';
import { RouteService } from '../shared/services/route.service';
import { SearchConfigurationService } from './search-service/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../+my-dspace-page/my-dspace-page.component';
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
var FilteredSearchPageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(FilteredSearchPageComponent, _super);
    function FilteredSearchPageComponent(service, sidebarService, windowService, searchConfigService, routeService) {
        var _this = _super.call(this, service, sidebarService, windowService, searchConfigService, routeService) || this;
        _this.service = service;
        _this.sidebarService = sidebarService;
        _this.windowService = windowService;
        _this.searchConfigService = searchConfigService;
        _this.routeService = routeService;
        return _this;
    }
    /**
     * Get the current paginated search options after updating the fixed filter using the fixedFilterQuery input
     * This is to make sure the fixed filter is included in the paginated search options, as it is not part of any
     * query or route parameters
     * @returns {Observable<PaginatedSearchOptions>}
     */
    FilteredSearchPageComponent.prototype.getSearchOptions = function () {
        this.searchConfigService.updateFixedFilter(this.fixedFilterQuery);
        return this.searchConfigService.paginatedSearchOptions;
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], FilteredSearchPageComponent.prototype, "fixedFilterQuery", void 0);
    FilteredSearchPageComponent = tslib_1.__decorate([
        Component({ selector: 'ds-filtered-search-page',
            styleUrls: ['./search-page.component.scss'],
            templateUrl: './search-page.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [pushInOut],
            providers: [
                {
                    provide: SEARCH_CONFIG_SERVICE,
                    useClass: SearchConfigurationService
                }
            ]
        }),
        tslib_1.__param(3, Inject(SEARCH_CONFIG_SERVICE)),
        tslib_1.__metadata("design:paramtypes", [SearchService,
            SearchSidebarService,
            HostWindowService,
            SearchConfigurationService,
            RouteService])
    ], FilteredSearchPageComponent);
    return FilteredSearchPageComponent;
}(SearchPageComponent));
export { FilteredSearchPageComponent };
//# sourceMappingURL=filtered-search-page.component.js.map