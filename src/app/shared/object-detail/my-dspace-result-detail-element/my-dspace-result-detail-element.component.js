import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { Metadata } from '../../../core/shared/metadata.utils';
var MyDSpaceResultDetailElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(MyDSpaceResultDetailElementComponent, _super);
    /**
     * Initialize instance variables
     *
     * @param {ListableObject} detailable
     */
    function MyDSpaceResultDetailElementComponent(detailable) {
        var _this = _super.call(this, detailable) || this;
        _this.detailable = detailable;
        _this.dso = _this.object.indexableObject;
        return _this;
    }
    /**
     * Gets all matching metadata string values from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string[]} the matching string values or an empty array.
     */
    MyDSpaceResultDetailElementComponent.prototype.allMetadataValues = function (keyOrKeys) {
        return Metadata.allValues([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
    };
    /**
     * Gets the first matching metadata string value from hitHighlights or dso metadata, preferring hitHighlights.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @returns {string} the first matching string value, or `undefined`.
     */
    MyDSpaceResultDetailElementComponent.prototype.firstMetadataValue = function (keyOrKeys) {
        return Metadata.firstValue([this.object.hitHighlights, this.dso.metadata], keyOrKeys);
    };
    MyDSpaceResultDetailElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-my-dspace-result-detail-element',
            template: ""
        }),
        tslib_1.__param(0, Inject('objectElementProvider')),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], MyDSpaceResultDetailElementComponent);
    return MyDSpaceResultDetailElementComponent;
}(AbstractListableElementComponent));
export { MyDSpaceResultDetailElementComponent };
//# sourceMappingURL=my-dspace-result-detail-element.component.js.map