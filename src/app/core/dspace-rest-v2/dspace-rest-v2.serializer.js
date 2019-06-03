import { Serialize, Deserialize } from 'cerialize';
/**
 * This Serializer turns responses from v2 of DSpace's REST API
 * to models and vice versa
 */
var DSpaceRESTv2Serializer = /** @class */ (function () {
    /**
     * Create a new DSpaceRESTv2Serializer instance
     *
     * @param modelType a class or interface to indicate
     * the kind of model this serializer should work with
     */
    function DSpaceRESTv2Serializer(modelType) {
        this.modelType = modelType;
    }
    /**
     * Convert a model in to the format expected by the backend
     *
     * @param model The model to serialize
     * @returns An object to send to the backend
     */
    DSpaceRESTv2Serializer.prototype.serialize = function (model) {
        return Serialize(model, this.modelType);
    };
    /**
     * Convert an array of models in to the format expected by the backend
     *
     * @param models The array of models to serialize
     * @returns An object to send to the backend
     */
    DSpaceRESTv2Serializer.prototype.serializeArray = function (models) {
        return Serialize(models, this.modelType);
    };
    /**
     * Convert a response from the backend in to a model.
     *
     * @param response An object returned by the backend
     * @returns a model of type T
     */
    DSpaceRESTv2Serializer.prototype.deserialize = function (response) {
        // TODO enable validation, once rest data stabilizes
        // new DSpaceRESTv2Validator(response).validate();
        if (Array.isArray(response)) {
            throw new Error('Expected a single model, use deserializeArray() instead');
        }
        var normalized = Object.assign({}, response, this.normalizeLinks(response._links));
        return Deserialize(normalized, this.modelType);
    };
    /**
     * Convert a response from the backend in to an array of models
     *
     * @param response An object returned by the backend
     * @returns an array of models of type T
     */
    DSpaceRESTv2Serializer.prototype.deserializeArray = function (response) {
        var _this = this;
        // TODO: enable validation, once rest data stabilizes
        // new DSpaceRESTv2Validator(response).validate();
        if (!Array.isArray(response)) {
            throw new Error('Expected an Array, use deserialize() instead');
        }
        var normalized = response.map(function (resource) {
            return Object.assign({}, resource, _this.normalizeLinks(resource._links));
        });
        return Deserialize(normalized, this.modelType);
    };
    DSpaceRESTv2Serializer.prototype.normalizeLinks = function (links) {
        var normalizedLinks = links;
        for (var link in normalizedLinks) {
            if (Array.isArray(normalizedLinks[link])) {
                normalizedLinks[link] = normalizedLinks[link].map(function (linkedResource) {
                    return linkedResource.href;
                });
            }
            else {
                normalizedLinks[link] = normalizedLinks[link].href;
            }
        }
        return normalizedLinks;
    };
    return DSpaceRESTv2Serializer;
}());
export { DSpaceRESTv2Serializer };
//# sourceMappingURL=dspace-rest-v2.serializer.js.map