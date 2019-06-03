import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Metadata } from '../../../core/shared/metadata.utils';
var MyDSpaceResultListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(MyDSpaceResultListElementComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {ListableObject} listable
     * @param {number} index
     */
    function MyDSpaceResultListElementComponent(listable, index) {
        var _this = _super.call(this, listable) || this;
        _this.listable = listable;
        _this.index = index;
        _this.dso = _this.object.indexableObject;
        _this.dsoIndex = _this.index;
        return _this;
    }
    /**
     * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string[]} the matching string values or an empty array.
     */
    MyDSpaceResultListElementComponent.prototype.allMetadataValues = function (keyOrKeys) {
        return Metadata.allValues([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
    };
    /**
     * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string} the first matching string value, or `undefined`.
     */
    MyDSpaceResultListElementComponent.prototype.firstMetadataValue = function (keyOrKeys) {
        return Metadata.firstValue([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
    };
    MyDSpaceResultListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-my-dspace-result-list-element',
            template: ""
        }),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__param(1, Inject('indexElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object, Number])
    ], MyDSpaceResultListElementComponent);
    return MyDSpaceResultListElementComponent;
}(AbstractListableElementComponent));
export { MyDSpaceResultListElementComponent };
//# sourceMappingURL=my-dspace-result-list-element.component.js.map