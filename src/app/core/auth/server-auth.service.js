import * as tslib_1 from "tslib";
import { map, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { isNotEmpty } from '../../shared/empty.util';
import { AuthService } from './auth.service';
import { CheckAuthenticationTokenAction } from './auth.actions';
/**
 * The auth service.
 */
var ServerAuthService = /** @class */ (function (_super) {
    tslib_1.__extends(ServerAuthService, _super);
    function ServerAuthService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Returns the authenticated user
     * @returns {User}
     */
    ServerAuthService.prototype.authenticatedUser = function (token) {
        var _this = this;
        // Determine if the user has an existing auth session on the server
        var options = Object.create({});
        var headers = new HttpHeaders();
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('Authorization', "Bearer " + token.accessToken);
        // NB this is used to pass server client IP check.
        var clientIp = this.req.get('x-forwarded-for') || this.req.connection.remoteAddress;
        headers = headers.append('X-Forwarded-For', clientIp);
        options.headers = headers;
        return this.authRequestService.getRequest('status', options).pipe(map(function (status) { return _this.rdbService.build(status); }), switchMap(function (status) {
            if (status.authenticated) {
                return status.eperson.pipe(map(function (eperson) { return eperson.payload; }));
            }
            else {
                throw (new Error('Not authenticated'));
            }
        }));
    };
    /**
     * Checks if token is present into browser storage and is valid. (NB Check is done only on SSR)
     */
    ServerAuthService.prototype.checkAuthenticationToken = function () {
        this.store.dispatch(new CheckAuthenticationTokenAction());
    };
    /**
     * Redirect to the route navigated before the login
     */
    ServerAuthService.prototype.redirectToPreviousUrl = function () {
        var _this = this;
        this.getRedirectUrl().pipe(take(1))
            .subscribe(function (redirectUrl) {
            if (isNotEmpty(redirectUrl)) {
                // override the route reuse strategy
                _this.router.routeReuseStrategy.shouldReuseRoute = function () {
                    return false;
                };
                _this.router.navigated = false;
                var url = decodeURIComponent(redirectUrl);
                _this.router.navigateByUrl(url);
            }
            else {
                _this.router.navigate(['/']);
            }
        });
    };
    ServerAuthService = tslib_1.__decorate([
        Injectable()
    ], ServerAuthService);
    return ServerAuthService;
}(AuthService));
export { ServerAuthService };
//# sourceMappingURL=server-auth.service.js.map