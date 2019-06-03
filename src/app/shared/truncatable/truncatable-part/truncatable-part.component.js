import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { TruncatableService } from '../truncatable.service';
import { hasValue } from '../../empty.util';
var TruncatablePartComponent = /** @class */ (function () {
    function TruncatablePartComponent(service) {
        this.service = service;
        /**
         * Number of lines shown when the part is expanded. -1 indicates no limit
         */
        this.maxLines = -1;
        /**
         * True if the minimal height of the part should at least be as high as it's minimum amount of lines
         */
        this.fixedHeight = false;
    }
    /**
     * Initialize lines variable
     */
    TruncatablePartComponent.prototype.ngOnInit = function () {
        this.setLines();
    };
    /**
     * Subscribe to the current state to determine how much lines should be shown of this part
     */
    TruncatablePartComponent.prototype.setLines = function () {
        var _this = this;
        this.sub = this.service.isCollapsed(this.id).subscribe(function (collapsed) {
            if (collapsed) {
                _this.lines = _this.minLines.toString();
            }
            else {
                _this.lines = _this.maxLines < 0 ? 'none' : _this.maxLines.toString();
            }
        });
    };
    /**
     * Unsubscribe from the subscription
     */
    TruncatablePartComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.sub)) {
            this.sub.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], TruncatablePartComponent.prototype, "minLines", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], TruncatablePartComponent.prototype, "maxLines", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], TruncatablePartComponent.prototype, "id", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], TruncatablePartComponent.prototype, "type", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], TruncatablePartComponent.prototype, "fixedHeight", void 0);
    TruncatablePartComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-truncatable-part',
            templateUrl: './truncatable-part.component.html',
            styleUrls: ['./truncatable-part.component.scss']
        })
        /**
         * Component that truncates/clamps a piece of text
         * It needs a TruncatableComponent parent to identify it's current state
         */
        ,
        tslib_1.__metadata("design:paramtypes", [TruncatableService])
    ], TruncatablePartComponent);
    return TruncatablePartComponent;
}());
export { TruncatablePartComponent };
//# sourceMappingURL=truncatable-part.component.js.map