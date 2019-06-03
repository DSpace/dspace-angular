import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { filter, find, flatMap, map } from 'rxjs/operators';
import { isNotEmpty, isNotUndefined } from '../../../empty.util';
/**
 * This component represents a badge with submitter information.
 */
var ItemSubmitterComponent = /** @class */ (function () {
    function ItemSubmitterComponent() {
    }
    /**
     * Initialize submitter object
     */
    ItemSubmitterComponent.prototype.ngOnInit = function () {
        this.submitter$ = this.object.workflowitem.pipe(filter(function (rd) { return (rd.hasSucceeded && isNotUndefined(rd.payload)); }), flatMap(function (rd) { return rd.payload.submitter; }), find(function (rd) { return rd.hasSucceeded && isNotEmpty(rd.payload); }), map(function (rd) { return rd.payload; }));
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItemSubmitterComponent.prototype, "object", void 0);
    ItemSubmitterComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-submitter',
            styleUrls: ['./item-submitter.component.scss'],
            templateUrl: './item-submitter.component.html'
        })
    ], ItemSubmitterComponent);
    return ItemSubmitterComponent;
}());
export { ItemSubmitterComponent };
//# sourceMappingURL=item-submitter.component.js.map