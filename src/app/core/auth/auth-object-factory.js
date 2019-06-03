import { AuthType } from './auth-type';
import { NormalizedAuthStatus } from './models/normalized-auth-status.model';
import { NormalizedEPerson } from '../eperson/models/normalized-eperson.model';
import { NormalizedGroup } from '../eperson/models/normalized-group.model';
var AuthObjectFactory = /** @class */ (function () {
    function AuthObjectFactory() {
    }
    AuthObjectFactory.getConstructor = function (type) {
        switch (type) {
            case AuthType.EPerson: {
                return NormalizedEPerson;
            }
            case AuthType.Group: {
                return NormalizedGroup;
            }
            case AuthType.Status: {
                return NormalizedAuthStatus;
            }
            default: {
                return undefined;
            }
        }
    };
    return AuthObjectFactory;
}());
export { AuthObjectFactory };
//# sourceMappingURL=auth-object-factory.js.map