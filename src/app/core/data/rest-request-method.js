/**
 * Represents a Request Method.
 *
 * I didn't reuse the RequestMethod enum in @angular/http because
 * it uses numbers. The string values here are more clear when
 * debugging.
 *
 * The ones commented out are still unsupported in the rest of the codebase
 */
export var RestRequestMethod;
(function (RestRequestMethod) {
    RestRequestMethod["GET"] = "GET";
    RestRequestMethod["POST"] = "POST";
    RestRequestMethod["PUT"] = "PUT";
    RestRequestMethod["DELETE"] = "DELETE";
    RestRequestMethod["OPTIONS"] = "OPTIONS";
    RestRequestMethod["HEAD"] = "HEAD";
    RestRequestMethod["PATCH"] = "PATCH";
})(RestRequestMethod || (RestRequestMethod = {}));
//# sourceMappingURL=rest-request-method.js.map