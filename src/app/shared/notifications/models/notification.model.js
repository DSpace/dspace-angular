import { NotificationOptions } from './notification-options.model';
import { isEmpty } from '../../empty.util';
var Notification = /** @class */ (function () {
    function Notification(id, type, title, content, options, html) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.content = content;
        this.options = isEmpty(options) ? new NotificationOptions() : options;
        this.html = html;
    }
    return Notification;
}());
export { Notification };
//# sourceMappingURL=notification.model.js.map