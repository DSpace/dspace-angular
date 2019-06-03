import { Validator } from 'jsonschema';
import schema from './dspace-rest-v2.schema.json';
/**
 * Verifies a document is a valid response from
 * a DSpace REST API v2
 */
var DSpaceRESTv2Validator = /** @class */ (function () {
    function DSpaceRESTv2Validator(document) {
        this.document = document;
    }
    /**
     * Throws an exception if this.document isn't a valid response from
     * a DSpace REST API v2. Succeeds otherwise.
     */
    DSpaceRESTv2Validator.prototype.validate = function () {
        var validator = new Validator();
        var result = validator.validate(this.document, schema);
        if (!result.valid) {
            if (result.errors && result.errors.length > 0) {
                var message = result.errors
                    .map(function (error) { return error.message; })
                    .join('\n');
                throw new Error(message);
            }
            else {
                throw new Error('JSON API validation failed for an unknown reason');
            }
        }
    };
    return DSpaceRESTv2Validator;
}());
export { DSpaceRESTv2Validator };
//# sourceMappingURL=dspace-rest-v2.validator.js.map