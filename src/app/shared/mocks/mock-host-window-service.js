import { of as observableOf } from 'rxjs';
// declare a stub service
var MockHostWindowService = /** @class */ (function () {
    function MockHostWindowService(width) {
        this.setWidth(width);
    }
    MockHostWindowService.prototype.setWidth = function (width) {
        this.width = width;
    };
    MockHostWindowService.prototype.isXs = function () {
        return observableOf(this.width < 576);
    };
    MockHostWindowService.prototype.isSm = function () {
        return observableOf(this.width < 768);
    };
    return MockHostWindowService;
}());
export { MockHostWindowService };
//# sourceMappingURL=mock-host-window-service.js.map