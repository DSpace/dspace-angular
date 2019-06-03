import { of as observableOf } from 'rxjs';
import { IntegrationData } from '../../core/integration/integration-data';
import { PageInfo } from '../../core/shared/page-info.model';
import { AuthorityValue } from '../../core/integration/models/authority.value';
var AuthorityServiceStub = /** @class */ (function () {
    function AuthorityServiceStub() {
        this._payload = [
            Object.assign(new AuthorityValue(), { id: 1, display: 'one', value: 1 }),
            Object.assign(new AuthorityValue(), { id: 2, display: 'two', value: 2 }),
        ];
    }
    AuthorityServiceStub.prototype.setNewPayload = function (payload) {
        this._payload = payload;
    };
    AuthorityServiceStub.prototype.getEntriesByName = function (options) {
        return observableOf(new IntegrationData(new PageInfo(), this._payload));
    };
    return AuthorityServiceStub;
}());
export { AuthorityServiceStub };
//# sourceMappingURL=authority-service-stub.js.map