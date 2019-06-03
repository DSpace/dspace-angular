import { default as decode } from 'jwt-decode';
export var TOKENITEM = 'dsAuthInfo';
var AuthTokenInfo = /** @class */ (function () {
    function AuthTokenInfo(token) {
        this.accessToken = token.replace('Bearer ', '');
        try {
            var tokenClaims = decode(this.accessToken);
            // exp claim is in seconds, convert it se to milliseconds
            this.expires = tokenClaims.exp * 1000;
        }
        catch (err) {
            this.expires = 0;
        }
    }
    return AuthTokenInfo;
}());
export { AuthTokenInfo };
//# sourceMappingURL=auth-token-info.model.js.map