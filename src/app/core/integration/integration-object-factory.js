import { IntegrationType } from './intergration-type';
import { NormalizedAuthorityValue } from './models/normalized-authority-value.model';
var IntegrationObjectFactory = /** @class */ (function () {
    function IntegrationObjectFactory() {
    }
    IntegrationObjectFactory.getConstructor = function (type) {
        switch (type) {
            case IntegrationType.Authority: {
                return NormalizedAuthorityValue;
            }
            default: {
                return undefined;
            }
        }
    };
    return IntegrationObjectFactory;
}());
export { IntegrationObjectFactory };
//# sourceMappingURL=integration-object-factory.js.map