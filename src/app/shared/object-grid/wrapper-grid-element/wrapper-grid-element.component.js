import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { SetViewMode } from '../../view-mode';
import { rendersDSOType } from '../../object-collection/shared/dso-element-decorator';
var WrapperGridElementComponent = /** @class */ (function () {
    function WrapperGridElementComponent(injector) {
        this.injector = injector;
    }
    WrapperGridElementComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.objectInjector = Injector.create({
            providers: [{ provide: 'objectElementProvider', useFactory: function () { return (_this.object); }, deps: [] }],
            parent: this.injector
        });
    };
    WrapperGridElementComponent.prototype.getGridElement = function () {
        var f = this.object.constructor;
        return rendersDSOType(f, SetViewMode.Grid);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], WrapperGridElementComponent.prototype, "object", void 0);
    WrapperGridElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-wrapper-grid-element',
            styleUrls: ['./wrapper-grid-element.component.scss'],
            templateUrl: './wrapper-grid-element.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Injector])
    ], WrapperGridElementComponent);
    return WrapperGridElementComponent;
}());
export { WrapperGridElementComponent };
//# sourceMappingURL=wrapper-grid-element.component.js.map