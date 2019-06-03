import { NotificationOptions } from '../notifications/models/notification-options.model';
var NotificationsServiceStub = /** @class */ (function () {
    function NotificationsServiceStub() {
        this.success = jasmine.createSpy('success');
        this.error = jasmine.createSpy('error');
        this.info = jasmine.createSpy('info');
        this.warning = jasmine.createSpy('warning');
        this.remove = jasmine.createSpy('remove');
        this.removeAll = jasmine.createSpy('removeAll');
    }
    NotificationsServiceStub.prototype.getDefaultOptions = function () {
        return new NotificationOptions();
    };
    return NotificationsServiceStub;
}());
export { NotificationsServiceStub };
//# sourceMappingURL=notifications-service-stub.js.map