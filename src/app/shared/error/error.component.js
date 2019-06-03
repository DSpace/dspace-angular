import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
var ErrorComponent = /** @class */ (function () {
    function ErrorComponent(translate) {
        this.translate = translate;
        this.message = 'Error...';
    }
    ErrorComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.message === undefined) {
            this.subscription = this.translate.get('error.default').subscribe(function (message) {
                _this.message = message;
            });
        }
    };
    ErrorComponent.prototype.ngOnDestroy = function () {
        if (this.subscription !== undefined) {
            this.subscription.unsubscribe();
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ErrorComponent.prototype, "message", void 0);
    ErrorComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-error',
            styleUrls: ['./error.component.scss'],
            templateUrl: './error.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [TranslateService])
    ], ErrorComponent);
    return ErrorComponent;
}());
export { ErrorComponent };
//# sourceMappingURL=error.component.js.map