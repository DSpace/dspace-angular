import { NotificationAnimationsType } from './notification-animations-type';
var NotificationOptions = /** @class */ (function () {
    function NotificationOptions(timeOut, clickToClose, animate) {
        if (timeOut === void 0) { timeOut = 5000; }
        if (clickToClose === void 0) { clickToClose = true; }
        if (animate === void 0) { animate = NotificationAnimationsType.Scale; }
        this.timeOut = timeOut;
        this.clickToClose = clickToClose;
        this.animate = animate;
    }
    return NotificationOptions;
}());
export { NotificationOptions };
//# sourceMappingURL=notification-options.model.js.map