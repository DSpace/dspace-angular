import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { isNotEmpty } from '../empty.util';
import { SearchService } from '../../+search-page/search-service/search.service';
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
var SearchFormComponent = /** @class */ (function () {
    function SearchFormComponent(router, searchService) {
        this.router = router;
        this.searchService = searchService;
        /**
         * The currently selected scope object's UUID
         */
        this.scope = '';
    }
    /**
     * Updates the search when the form is submitted
     * @param data Values submitted using the form
     */
    SearchFormComponent.prototype.onSubmit = function (data) {
        this.updateSearch(data);
    };
    /**
     * Updates the search when the current scope has been changed
     * @param {string} scope The new scope
     */
    SearchFormComponent.prototype.onScopeChange = function (scope) {
        this.updateSearch({ scope: scope });
    };
    /**
     * Updates the search URL
     * @param data Updated parameters
     */
    SearchFormComponent.prototype.updateSearch = function (data) {
        this.router.navigate(this.getSearchLinkParts(), {
            queryParams: Object.assign({}, { page: 1 }, data),
            queryParamsHandling: 'merge'
        });
    };
    /**
     * For usage of the isNotEmpty function in the template
     */
    SearchFormComponent.prototype.isNotEmpty = function (object) {
        return isNotEmpty(object);
    };
    /**
     * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
     */
    SearchFormComponent.prototype.getSearchLink = function () {
        if (this.inPlaceSearch) {
            return './';
        }
        return this.searchService.getSearchLink();
    };
    /**
     * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
     */
    SearchFormComponent.prototype.getSearchLinkParts = function () {
        if (this.inPlaceSearch) {
            return [];
        }
        return this.getSearchLink().split('/');
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SearchFormComponent.prototype, "query", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchFormComponent.prototype, "inPlaceSearch", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], SearchFormComponent.prototype, "scope", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], SearchFormComponent.prototype, "currentUrl", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Array)
    ], SearchFormComponent.prototype, "scopes", void 0);
    SearchFormComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-form',
            styleUrls: ['./search-form.component.scss'],
            templateUrl: './search-form.component.html'
        })
        /**
         * Component that represents the search form
         */
        ,
        tslib_1.__metadata("design:paramtypes", [Router, SearchService])
    ], SearchFormComponent);
    return SearchFormComponent;
}());
export { SearchFormComponent };
//# sourceMappingURL=search-form.component.js.map