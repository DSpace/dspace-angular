import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { TruncatableService } from '../../truncatable/truncatable.service';
import { Metadata } from '../../../core/shared/metadata.utils';
var SearchResultGridElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SearchResultGridElementComponent, _super);
    function SearchResultGridElementComponent(listableObject, truncatableService) {
        var _this = _super.call(this, listableObject) || this;
        _this.listableObject = listableObject;
        _this.truncatableService = truncatableService;
        _this.dso = _this.object.indexableObject;
        return _this;
    }
    /**
     * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string[]} the matching string values or an empty array.
     */
    SearchResultGridElementComponent.prototype.allMetadataValues = function (keyOrKeys) {
        return Metadata.allValues([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
    };
    /**
     * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string} the first matching string value, or `undefined`.
     */
    SearchResultGridElementComponent.prototype.firstMetadataValue = function (keyOrKeys) {
        return Metadata.firstValue([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
    };
    SearchResultGridElementComponent.prototype.isCollapsed = function () {
        return this.truncatableService.isCollapsed(this.dso.id);
    };
    SearchResultGridElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-result-grid-element',
            template: ""
        }),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object, TruncatableService])
    ], SearchResultGridElementComponent);
    return SearchResultGridElementComponent;
}(AbstractListableElementComponent));
export { SearchResultGridElementComponent };
//# sourceMappingURL=search-result-grid-element.component.js.map