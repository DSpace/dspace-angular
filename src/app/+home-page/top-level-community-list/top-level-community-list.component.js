import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { fadeInOut } from '../../shared/animations/fade';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { take } from 'rxjs/operators';
/**
 * this component renders the Top-Level Community list
 */
var TopLevelCommunityListComponent = /** @class */ (function () {
    function TopLevelCommunityListComponent(cds) {
        this.cds = cds;
        /**
         * A list of remote data objects of all top communities
         */
        this.communitiesRD$ = new BehaviorSubject({});
        this.config = new PaginationComponentOptions();
        this.config.id = 'top-level-pagination';
        this.config.pageSize = 5;
        this.config.currentPage = 1;
        this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    }
    TopLevelCommunityListComponent.prototype.ngOnInit = function () {
        this.updatePage();
    };
    /**
     * Called when one of the pagination settings is changed
     * @param event The new pagination data
     */
    TopLevelCommunityListComponent.prototype.onPaginationChange = function (event) {
        this.config.currentPage = event.page;
        this.config.pageSize = event.pageSize;
        this.sortConfig.field = event.sortField;
        this.sortConfig.direction = event.sortDirection;
        this.updatePage();
    };
    /**
     * Update the list of top communities
     */
    TopLevelCommunityListComponent.prototype.updatePage = function () {
        var _this = this;
        this.cds.findTop({
            currentPage: this.config.currentPage,
            elementsPerPage: this.config.pageSize,
            sort: { field: this.sortConfig.field, direction: this.sortConfig.direction }
        }).pipe(take(1)).subscribe(function (results) {
            _this.communitiesRD$.next(results);
        });
    };
    TopLevelCommunityListComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-top-level-community-list',
            styleUrls: ['./top-level-community-list.component.scss'],
            templateUrl: './top-level-community-list.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [fadeInOut]
        }),
        tslib_1.__metadata("design:paramtypes", [CommunityDataService])
    ], TopLevelCommunityListComponent);
    return TopLevelCommunityListComponent;
}());
export { TopLevelCommunityListComponent };
//# sourceMappingURL=top-level-community-list.component.js.map