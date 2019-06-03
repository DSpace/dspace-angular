import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { getJSON, remove, set } from 'js-cookie';
import { CookieService } from './cookie.service';
var ClientCookieService = /** @class */ (function (_super) {
    tslib_1.__extends(ClientCookieService, _super);
    function ClientCookieService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientCookieService.prototype.set = function (name, value, options) {
        set(name, value, options);
        this.updateSource();
    };
    ClientCookieService.prototype.remove = function (name, options) {
        remove(name, options);
        this.updateSource();
    };
    ClientCookieService.prototype.get = function (name) {
        return getJSON(name);
    };
    ClientCookieService.prototype.getAll = function () {
        return getJSON();
    };
    ClientCookieService = tslib_1.__decorate([
        Injectable()
    ], ClientCookieService);
    return ClientCookieService;
}(CookieService));
export { ClientCookieService };
//# sourceMappingURL=client-cookie.service.js.map