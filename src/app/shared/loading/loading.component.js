import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { hasValue } from '../empty.util';
var LoadingComponent = /** @class */ (function () {
    function LoadingComponent(translate) {
        this.translate = translate;
        this.showMessage = true;
    }
    LoadingComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.message === undefined) {
            this.subscription = this.translate.get('loading.default').subscribe(function (message) {
                _this.message = message;
            });
        }
    };
    LoadingComponent.prototype.ngOnDestroy = function () {
        if (hasValue(this.subscription)) {
            this.subscription.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], LoadingComponent.prototype, "message", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], LoadingComponent.prototype, "showMessage", void 0);
    LoadingComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-loading',
            styleUrls: ['./loading.component.scss'],
            templateUrl: './loading.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [TranslateService])
    ], LoadingComponent);
    return LoadingComponent;
}());
export { LoadingComponent };
//# sourceMappingURL=loading.component.js.map