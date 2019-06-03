import { of as observableOf } from 'rxjs';
var HALEndpointServiceStub = /** @class */ (function () {
    function HALEndpointServiceStub(url) {
        this.url = url;
    }
    ;
    HALEndpointServiceStub.prototype.getEndpoint = function (path) {
        return observableOf(this.url + '/' + path);
    };
    return HALEndpointServiceStub;
}());
export { HALEndpointServiceStub };
//# sourceMappingURL=hal-endpoint-service-stub.js.map