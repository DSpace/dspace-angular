import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
/**
 * Pipe that allows to iterate over an object and to access to entry key and value :
 *
 * <div *ngFor="let obj of objs | dsObjNgFor">
 *  {{obj.key}} - {{obj.value}}
 * </div>
 *
 */
var ObjNgFor = /** @class */ (function () {
    function ObjNgFor() {
    }
    ObjNgFor.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        return Object.keys(value).map(function (key) { return Object.assign({ key: key }, { value: value[key] }); });
    };
    ObjNgFor = tslib_1.__decorate([
        Pipe({
            name: 'dsObjNgFor'
        })
    ], ObjNgFor);
    return ObjNgFor;
}());
export { ObjNgFor };
//# sourceMappingURL=object-ngfor.pipe.js.map