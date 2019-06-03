import { of as observableOf } from 'rxjs';
// declare a stub service
var HostWindowServiceStub = /** @class */ (function () {
    function HostWindowServiceStub(width) {
        this.setWidth(width);
    }
    HostWindowServiceStub.prototype.setWidth = function (width) {
        this.width = width;
    };
    HostWindowServiceStub.prototype.isXs = function () {
        return observableOf(this.width < 576);
    };
    HostWindowServiceStub.prototype.isXsOrSm = function () {
        return this.isXs();
    };
    return HostWindowServiceStub;
}());
export { HostWindowServiceStub };
//# sourceMappingURL=host-window-service-stub.js.map