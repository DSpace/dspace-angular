import { type } from './ngrx/type';
export var HostWindowActionTypes = {
    RESIZE: type('dspace/host-window/RESIZE')
};
var HostWindowResizeAction = /** @class */ (function () {
    function HostWindowResizeAction(width, height) {
        this.type = HostWindowActionTypes.RESIZE;
        this.payload = { width: width, height: height };
    }
    return HostWindowResizeAction;
}());
export { HostWindowResizeAction };
//# sourceMappingURL=host-window.actions.js.map