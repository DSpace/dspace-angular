import * as tslib_1 from "tslib";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
import { BrowseByMetadataPageComponent, browseParamsToOptions } from '../+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { BrowseService } from '../../core/browse/browse.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
var BrowseByTitlePageComponent = /** @class */ (function (_super) {
    tslib_1.__extends(BrowseByTitlePageComponent, _super);
    function BrowseByTitlePageComponent(route, browseService, dsoService, router) {
        var _this = _super.call(this, route, browseService, dsoService, router) || this;
        _this.route = route;
        _this.browseService = browseService;
        _this.dsoService = dsoService;
        _this.router = router;
        return _this;
    }
    BrowseByTitlePageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
        this.updatePage(new BrowseEntrySearchOptions(null, this.paginationConfig, this.sortConfig));
        this.subs.push(observableCombineLatest(this.route.params, this.route.queryParams, this.route.data, function (params, queryParams, data) {
            return Object.assign({}, params, queryParams, data);
        })
            .subscribe(function (params) {
            _this.metadata = params.metadata || _this.defaultMetadata;
            _this.updatePageWithItems(browseParamsToOptions(params, _this.paginationConfig, _this.sortConfig, _this.metadata), undefined);
            _this.updateParent(params.scope);
        }));
        this.updateStartsWithTextOptions();
    };
    BrowseByTitlePageComponent.prototype.ngOnDestroy = function () {
        this.subs.filter(function (sub) { return hasValue(sub); }).forEach(function (sub) { return sub.unsubscribe(); });
    };
    BrowseByTitlePageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-browse-by-title-page',
            styleUrls: ['../+browse-by-metadata-page/browse-by-metadata-page.component.scss'],
            templateUrl: '../+browse-by-metadata-page/browse-by-metadata-page.component.html'
        })
        /**
         * Component for browsing items by title (dc.title)
         */
        ,
        tslib_1.__metadata("design:paramtypes", [ActivatedRoute,
            BrowseService,
            DSpaceObjectDataService,
            Router])
    ], BrowseByTitlePageComponent);
    return BrowseByTitlePageComponent;
}(BrowseByMetadataPageComponent));
export { BrowseByTitlePageComponent };
//# sourceMappingURL=browse-by-title-page.component.js.map