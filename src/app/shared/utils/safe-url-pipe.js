import * as tslib_1 from "tslib";
import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * This pipe explicitly escapes the sanitization of a URL,
 * only use this when you are sure the URL is indeed safe
 */
var SafeUrlPipe = /** @class */ (function () {
    function SafeUrlPipe(domSanitizer) {
        this.domSanitizer = domSanitizer;
    }
    SafeUrlPipe.prototype.transform = function (url) {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    };
    SafeUrlPipe = tslib_1.__decorate([
        Pipe({ name: 'dsSafeUrl' }),
        tslib_1.__metadata("design:paramtypes", [DomSanitizer])
    ], SafeUrlPipe);
    return SafeUrlPipe;
}());
export { SafeUrlPipe };
//# sourceMappingURL=safe-url-pipe.js.map