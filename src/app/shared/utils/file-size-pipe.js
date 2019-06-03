import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
 */
var FileSizePipe = /** @class */ (function () {
    function FileSizePipe() {
        this.units = [
            'bytes',
            'KiB',
            'MiB',
            'GiB',
            'TiB',
            'PiB'
        ];
    }
    FileSizePipe.prototype.transform = function (bytes, precision) {
        if (bytes === void 0) { bytes = 0; }
        if (precision === void 0) { precision = 2; }
        var result;
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) {
            result = '?';
        }
        else {
            var unit = 0;
            while (bytes >= 1024) {
                bytes /= 1024;
                unit++;
            }
            result = bytes.toFixed(+precision) + ' ' + this.units[unit];
        }
        return result;
    };
    FileSizePipe = tslib_1.__decorate([
        Pipe({ name: 'dsFileSize' })
    ], FileSizePipe);
    return FileSizePipe;
}());
export { FileSizePipe };
//# sourceMappingURL=file-size-pipe.js.map