import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
var ConsolePipe = /** @class */ (function () {
    function ConsolePipe() {
    }
    ConsolePipe.prototype.transform = function (value) {
        console.log(value);
        return '';
    };
    ConsolePipe = tslib_1.__decorate([
        Pipe({
            name: 'dsConsole'
        })
    ], ConsolePipe);
    return ConsolePipe;
}());
export { ConsolePipe };
//# sourceMappingURL=console.pipe.js.map