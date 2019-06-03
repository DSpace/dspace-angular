import { InjectionToken } from '@angular/core';
export var NativeWindowService = new InjectionToken('NativeWindowService');
var NativeWindowRef = /** @class */ (function () {
    function NativeWindowRef() {
    }
    Object.defineProperty(NativeWindowRef.prototype, "nativeWindow", {
        get: function () {
            if (typeof window !== 'undefined') {
                return window;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    return NativeWindowRef;
}());
export { NativeWindowRef };
export function NativeWindowFactory() {
    return new NativeWindowRef();
}
//# sourceMappingURL=window.service.js.map