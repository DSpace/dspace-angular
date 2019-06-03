import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { MyDspaceItemStatusType } from './my-dspace-item-status-type';
/**
 * This component represents a badge with mydspace item status
 */
var MyDSpaceItemStatusComponent = /** @class */ (function () {
    function MyDSpaceItemStatusComponent() {
    }
    /**
     * Initialize badge content and class
     */
    MyDSpaceItemStatusComponent.prototype.ngOnInit = function () {
        this.badgeContent = this.status;
        this.badgeClass = 'text-light badge ';
        switch (this.status) {
            case MyDspaceItemStatusType.VALIDATION:
                this.badgeClass += 'badge-warning';
                break;
            case MyDspaceItemStatusType.WAITING_CONTROLLER:
                this.badgeClass += 'badge-info';
                break;
            case MyDspaceItemStatusType.WORKSPACE:
                this.badgeClass += 'badge-primary';
                break;
            case MyDspaceItemStatusType.ARCHIVED:
                this.badgeClass += 'badge-success';
                break;
            case MyDspaceItemStatusType.WORKFLOW:
                this.badgeClass += 'badge-info';
                break;
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], MyDSpaceItemStatusComponent.prototype, "status", void 0);
    MyDSpaceItemStatusComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-mydspace-item-status',
            styleUrls: ['./my-dspace-item-status.component.scss'],
            templateUrl: './my-dspace-item-status.component.html'
        })
    ], MyDSpaceItemStatusComponent);
    return MyDSpaceItemStatusComponent;
}());
export { MyDSpaceItemStatusComponent };
//# sourceMappingURL=my-dspace-item-status.component.js.map