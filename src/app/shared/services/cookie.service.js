import * as tslib_1 from "tslib";
import { Inject, Injectable } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Subject } from 'rxjs';
var CookieService = /** @class */ (function () {
    function CookieService(req) {
        this.req = req;
        this.cookieSource = new Subject();
        this.cookies$ = this.cookieSource.asObservable();
    }
    CookieService.prototype.updateSource = function () {
        this.cookieSource.next(this.getAll());
    };
    CookieService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(REQUEST)),
        tslib_1.__metadata("design:paramtypes", [Object])
    ], CookieService);
    return CookieService;
}());
export { CookieService };
//# sourceMappingURL=cookie.service.js.map