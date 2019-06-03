import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { hasValue } from '../../empty.util';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { TruncatableService } from '../../truncatable/truncatable.service';
import { Metadata } from '../../../core/shared/metadata.utils';
var SearchResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SearchResultListElementComponent, _super);
    function SearchResultListElementComponent(listable, truncatableService) {
        var _this = _super.call(this, listable) || this;
        _this.listable = listable;
        _this.truncatableService = truncatableService;
        if (hasValue(_this.object)) {
            _this.dso = _this.object.indexableObject;
        }
        return _this;
    }
    /**
     * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string[]} the matching string values or an empty array.
     */
    SearchResultListElementComponent.prototype.allMetadataValues = function (keyOrKeys) {
        return Metadata.allValues([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
    };
    /**
     * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string} the first matching string value, or `undefined`.
     */
    SearchResultListElementComponent.prototype.firstMetadataValue = function (keyOrKeys) {
        return Metadata.firstValue([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
    };
    SearchResultListElementComponent.prototype.isCollapsed = function () {
        return this.truncatableService.isCollapsed(this.dso.id);
    };
    SearchResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-search-result-list-element',
            template: ""
        }),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object, TruncatableService])
    ], SearchResultListElementComponent);
    return SearchResultListElementComponent;
}(AbstractListableElementComponent));
export { SearchResultListElementComponent };
//# sourceMappingURL=search-result-list-element.component.js.map