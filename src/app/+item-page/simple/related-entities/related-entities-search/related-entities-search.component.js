import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';
import { isNotEmpty } from '../../../../shared/empty.util';
import { of } from 'rxjs/internal/observable/of';
var RelatedEntitiesSearchComponent = /** @class */ (function () {
    function RelatedEntitiesSearchComponent(fixedFilterService) {
        this.fixedFilterService = fixedFilterService;
        /**
         * Whether or not the search bar and title should be displayed (defaults to true)
         * @type {boolean}
         */
        this.searchEnabled = true;
        /**
         * The ratio of the sidebar's width compared to the search results (1-12) (defaults to 4)
         * @type {number}
         */
        this.sideBarWidth = 4;
    }
    RelatedEntitiesSearchComponent.prototype.ngOnInit = function () {
        if (isNotEmpty(this.relationType) && isNotEmpty(this.item)) {
            this.fixedFilter = this.fixedFilterService.getFilterByRelation(this.relationType, this.item.id);
        }
        if (isNotEmpty(this.relationEntityType)) {
            this.fixedFilter$ = of(this.relationEntityType);
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], RelatedEntitiesSearchComponent.prototype, "relationType", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Item)
    ], RelatedEntitiesSearchComponent.prototype, "item", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], RelatedEntitiesSearchComponent.prototype, "relationEntityType", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], RelatedEntitiesSearchComponent.prototype, "searchEnabled", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], RelatedEntitiesSearchComponent.prototype, "sideBarWidth", void 0);
    RelatedEntitiesSearchComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-related-entities-search',
            templateUrl: './related-entities-search.component.html'
        })
        /**
         * A component to show related items as search results.
         * Related items can be facetted, or queried using an
         * optional search box.
         */
        ,
        tslib_1.__metadata("design:paramtypes", [SearchFixedFilterService])
    ], RelatedEntitiesSearchComponent);
    return RelatedEntitiesSearchComponent;
}());
export { RelatedEntitiesSearchComponent };
//# sourceMappingURL=related-entities-search.component.js.map