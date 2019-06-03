import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
var ServerCookieService = /** @class */ (function (_super) {
    tslib_1.__extends(ServerCookieService, _super);
    function ServerCookieService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServerCookieService.prototype.set = function (name, value, options) {
        return;
    };
    ServerCookieService.prototype.remove = function (name, options) {
        return;
    };
    ServerCookieService.prototype.get = function (name) {
        try {
            return JSON.parse(this.req.cookies[name]);
        }
        catch (err) {
            return this.req ? this.req.cookies[name] : undefined;
        }
    };
    ServerCookieService.prototype.getAll = function () {
        if (this.req) {
            return this.req.cookies;
        }
    };
    ServerCookieService = tslib_1.__decorate([
        Injectable()
    ], ServerCookieService);
    return ServerCookieService;
}(CookieService));
export { ServerCookieService };
//# sourceMappingURL=server-cookie.service.js.map