import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { SetViewMode } from '../../view-mode';
import { rendersDSOType } from '../../object-collection/shared/dso-element-decorator';
var WrapperListElementComponent = /** @class */ (function () {
    function WrapperListElementComponent(injector) {
        this.injector = injector;
    }
    WrapperListElementComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.objectInjector = Injector.create({
            providers: [
                { provide: 'objectElementProvider', useFactory: function () { return (_this.object); }, deps: [] },
                { provide: 'indexElementProvider', useFactory: function () { return (_this.index); }, deps: [] }
            ],
            parent: this.injector
        });
    };
    WrapperListElementComponent.prototype.getListElement = function () {
        var f = this.object.constructor;
        return rendersDSOType(f, SetViewMode.List);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], WrapperListElementComponent.prototype, "object", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], WrapperListElementComponent.prototype, "index", void 0);
    WrapperListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-wrapper-list-element',
            styleUrls: ['./wrapper-list-element.component.scss'],
            templateUrl: './wrapper-list-element.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Injector])
    ], WrapperListElementComponent);
    return WrapperListElementComponent;
}());
export { WrapperListElementComponent };
//# sourceMappingURL=wrapper-list-element.component.js.map