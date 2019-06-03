import { of as observableOf } from 'rxjs';
import { AuthStatus } from '../../core/auth/models/auth-status.model';
import { AuthTokenInfo } from '../../core/auth/models/auth-token-info.model';
import { isNotEmpty } from '../empty.util';
import { EPersonMock } from './eperson-mock';
import { RemoteData } from '../../core/data/remote-data';
var AuthRequestServiceStub = /** @class */ (function () {
    function AuthRequestServiceStub() {
        this.mockUser = EPersonMock;
        this.mockTokenInfo = new AuthTokenInfo('test_token');
    }
    AuthRequestServiceStub.prototype.postToEndpoint = function (method, body, options) {
        var authStatusStub = new AuthStatus();
        if (isNotEmpty(body)) {
            var parsedBody = this.parseQueryString(body);
            authStatusStub.okay = true;
            if (parsedBody.user === 'user' && parsedBody.password === 'password') {
                authStatusStub.authenticated = true;
                authStatusStub.token = this.mockTokenInfo;
            }
            else {
                authStatusStub.authenticated = false;
            }
        }
        else {
            var token = options.headers.lazyUpdate[1].value;
            if (this.validateToken(token)) {
                authStatusStub.authenticated = true;
                authStatusStub.token = this.mockTokenInfo;
                authStatusStub.eperson = observableOf(new RemoteData(false, false, true, undefined, this.mockUser));
            }
            else {
                authStatusStub.authenticated = false;
            }
        }
        return observableOf(authStatusStub);
    };
    AuthRequestServiceStub.prototype.getRequest = function (method, options) {
        var authStatusStub = new AuthStatus();
        switch (method) {
            case 'logout':
                authStatusStub.authenticated = false;
                break;
            case 'status':
                var token = options.headers.lazyUpdate[1].value;
                if (this.validateToken(token)) {
                    authStatusStub.authenticated = true;
                    authStatusStub.token = this.mockTokenInfo;
                    authStatusStub.eperson = observableOf(new RemoteData(false, false, true, undefined, this.mockUser));
                }
                else {
                    authStatusStub.authenticated = false;
                }
                break;
        }
        return observableOf(authStatusStub);
    };
    AuthRequestServiceStub.prototype.validateToken = function (token) {
        return (token === 'Bearer test_token');
    };
    AuthRequestServiceStub.prototype.parseQueryString = function (query) {
        var obj = Object.create({});
        var vars = query.split('&');
        for (var _i = 0, vars_1 = vars; _i < vars_1.length; _i++) {
            var param = vars_1[_i];
            var pair = param.split('=');
            obj[pair[0]] = pair[1];
        }
        return obj;
    };
    return AuthRequestServiceStub;
}());
export { AuthRequestServiceStub };
//# sourceMappingURL=auth-request-service-stub.js.map