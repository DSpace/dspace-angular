import { of as observableOf } from 'rxjs';
import { AuthStatus } from '../../core/auth/models/auth-status.model';
import { AuthTokenInfo } from '../../core/auth/models/auth-token-info.model';
import { EPersonMock } from './eperson-mock';
import { RemoteData } from '../../core/data/remote-data';
var AuthServiceStub = /** @class */ (function () {
    function AuthServiceStub() {
        this.token = new AuthTokenInfo('token_test');
        this._tokenExpired = false;
        this.token.expires = Date.now() + (1000 * 60 * 60);
    }
    AuthServiceStub.prototype.authenticate = function (user, password) {
        if (user === 'user' && password === 'password') {
            var authStatus = new AuthStatus();
            authStatus.okay = true;
            authStatus.authenticated = true;
            authStatus.token = this.token;
            authStatus.eperson = observableOf(new RemoteData(false, false, true, undefined, EPersonMock));
            return observableOf(authStatus);
        }
        else {
            console.log('error');
            throw (new Error('Message Error test'));
        }
    };
    AuthServiceStub.prototype.authenticatedUser = function (token) {
        if (token.accessToken === 'token_test') {
            return observableOf(EPersonMock);
        }
        else {
            throw (new Error('Message Error test'));
        }
    };
    AuthServiceStub.prototype.buildAuthHeader = function (token) {
        return "Bearer " + token.accessToken;
    };
    AuthServiceStub.prototype.getToken = function () {
        return this.token;
    };
    AuthServiceStub.prototype.hasValidAuthenticationToken = function () {
        return observableOf(this.token);
    };
    AuthServiceStub.prototype.logout = function () {
        return observableOf(true);
    };
    AuthServiceStub.prototype.isTokenExpired = function (token) {
        return this._tokenExpired;
    };
    /**
     * This method is used to ease testing
     */
    AuthServiceStub.prototype.setTokenAsExpired = function () {
        this._tokenExpired = true;
    };
    /**
     * This method is used to ease testing
     */
    AuthServiceStub.prototype.setTokenAsNotExpired = function () {
        this._tokenExpired = false;
    };
    AuthServiceStub.prototype.isTokenExpiring = function () {
        return observableOf(false);
    };
    AuthServiceStub.prototype.refreshAuthenticationToken = function (token) {
        return observableOf(this.token);
    };
    AuthServiceStub.prototype.redirectToPreviousUrl = function () {
        return;
    };
    AuthServiceStub.prototype.removeToken = function () {
        return;
    };
    AuthServiceStub.prototype.setRedirectUrl = function (url) {
        return;
    };
    AuthServiceStub.prototype.storeToken = function (token) {
        return;
    };
    AuthServiceStub.prototype.isAuthenticated = function () {
        return observableOf(true);
    };
    return AuthServiceStub;
}());
export { AuthServiceStub };
//# sourceMappingURL=auth-service-stub.js.map