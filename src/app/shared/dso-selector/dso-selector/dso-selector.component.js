import * as tslib_1 from "tslib";
import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, startWith, switchMap } from 'rxjs/operators';
import { SearchService } from '../../../+search-page/search-service/search.service';
import { PaginatedSearchOptions } from '../../../+search-page/paginated-search-options.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
var DSOSelectorComponent = /** @class */ (function () {
    function DSOSelectorComponent(searchService) {
        this.searchService = searchService;
        /**
         * Emits the selected Object when a user selects it in the list
         */
        this.onSelect = new EventEmitter();
        /**
         * Input form control to query the list
         */
        this.input = new FormControl();
        /**
         * Default pagination for this feature
         */
        this.defaultPagination = { id: 'dso-selector', currentPage: 1, pageSize: 5 };
        /**
         * Time to wait before sending a search request to the server when a user types something
         */
        this.debounceTime = 500;
    }
    /**
     * Fills the listEntries$ variable with search results based on the input field's current value
     * The search will always start with the initial currentDSOId value
     */
    DSOSelectorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.input.setValue(this.currentDSOId);
        this.listEntries$ = this.input.valueChanges
            .pipe(debounceTime(this.debounceTime), startWith(this.currentDSOId), switchMap(function (query) {
            return _this.searchService.search(new PaginatedSearchOptions({
                query: query,
                dsoType: _this.type,
                pagination: _this.defaultPagination
            }));
        }));
    };
    /**
     * Set focus on the first list element when there is only one result
     */
    DSOSelectorComponent.prototype.selectSingleResult = function () {
        if (this.listElements.length > 0) {
            this.listElements.first.nativeElement.click();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DSOSelectorComponent.prototype, "currentDSOId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], DSOSelectorComponent.prototype, "type", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DSOSelectorComponent.prototype, "onSelect", void 0);
    tslib_1.__decorate([
        ViewChildren('listEntryElement'),
        tslib_1.__metadata("design:type", QueryList)
    ], DSOSelectorComponent.prototype, "listElements", void 0);
    DSOSelectorComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dso-selector',
            // styleUrls: ['./dso-selector.component.scss'],
            templateUrl: './dso-selector.component.html'
        })
        /**
         * Component to render a list of DSO's of which one can be selected
         * The user can search the list by using the input field
         */
        ,
        tslib_1.__metadata("design:paramtypes", [SearchService])
    ], DSOSelectorComponent);
    return DSOSelectorComponent;
}());
export { DSOSelectorComponent };
//# sourceMappingURL=dso-selector.component.js.map