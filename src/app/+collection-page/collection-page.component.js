import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, flatMap, map, startWith, switchMap, take } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../+search-page/paginated-search-options.model';
import { SearchService } from '../+search-page/search-service/search.service';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { MetadataService } from '../core/metadata/metadata.service';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { getSucceededRemoteData, redirectToPageNotFoundOn404, toDSpaceObjectListRD } from '../core/shared/operators';
import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
var CollectionPageComponent = /** @class */ (function () {
    function CollectionPageComponent(collectionDataService, searchService, metadata, route, router) {
        this.collectionDataService = collectionDataService;
        this.searchService = searchService;
        this.metadata = metadata;
        this.route = route;
        this.router = router;
        this.paginationConfig = new PaginationComponentOptions();
        this.paginationConfig.id = 'collection-page-pagination';
        this.paginationConfig.pageSize = 5;
        this.paginationConfig.currentPage = 1;
        this.sortConfig = new SortOptions('dc.date.accessioned', SortDirection.DESC);
    }
    CollectionPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.collectionRD$ = this.route.data.pipe(map(function (data) { return data.collection; }), redirectToPageNotFoundOn404(this.router), take(1));
        this.logoRD$ = this.collectionRD$.pipe(map(function (rd) { return rd.payload; }), filter(function (collection) { return hasValue(collection); }), flatMap(function (collection) { return collection.logo; }));
        this.paginationChanges$ = new BehaviorSubject({
            paginationConfig: this.paginationConfig,
            sortConfig: this.sortConfig
        });
        this.itemRD$ = this.paginationChanges$.pipe(switchMap(function (dto) { return _this.collectionRD$.pipe(getSucceededRemoteData(), map(function (rd) { return rd.payload.id; }), switchMap(function (id) {
            return _this.searchService.search(new PaginatedSearchOptions({
                scope: id,
                pagination: dto.paginationConfig,
                sort: dto.sortConfig,
                dsoType: DSpaceObjectType.ITEM
            })).pipe(toDSpaceObjectListRD());
        }), startWith(undefined) // Make sure switching pages shows loading component
        ); }));
        this.route.queryParams.pipe(take(1)).subscribe(function (params) {
            _this.metadata.processRemoteData(_this.collectionRD$);
            _this.onPaginationChange(params);
        });
    };
    CollectionPageComponent.prototype.isNotEmpty = function (object) {
        return isNotEmpty(object);
    };
    CollectionPageComponent.prototype.onPaginationChange = function (event) {
        this.paginationConfig.currentPage = +event.page || this.paginationConfig.currentPage;
        this.paginationConfig.pageSize = +event.pageSize || this.paginationConfig.pageSize;
        this.sortConfig.direction = event.sortDirection || this.sortConfig.direction;
        this.sortConfig.field = event.sortField || this.sortConfig.field;
        this.paginationChanges$.next({
            paginationConfig: this.paginationConfig,
            sortConfig: this.sortConfig
        });
    };
    CollectionPageComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-collection-page',
            styleUrls: ['./collection-page.component.scss'],
            templateUrl: './collection-page.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
            animations: [
                fadeIn,
                fadeInOut
            ]
        }),
        tslib_1.__metadata("design:paramtypes", [CollectionDataService,
            SearchService,
            MetadataService,
            ActivatedRoute,
            Router])
    ], CollectionPageComponent);
    return CollectionPageComponent;
}());
export { CollectionPageComponent };
//# sourceMappingURL=collection-page.component.js.map