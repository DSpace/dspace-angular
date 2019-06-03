import * as tslib_1 from "tslib";
import { Component, Injector, Input } from '@angular/core';
import { rendersDSOType } from '../../object-collection/shared/dso-element-decorator';
import { SetViewMode } from '../../view-mode';
/**
 * This component renders a wrapper for an object in the detail view.
 */
var WrapperDetailElementComponent = /** @class */ (function () {
    /**
     * Initialize instance variables
     *
     * @param {Injector} injector
     */
    function WrapperDetailElementComponent(injector) {
        this.injector = injector;
    }
    /**
     * Initialize injector
     */
    WrapperDetailElementComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.objectInjector = Injector.create({
            providers: [{ provide: 'objectElementProvider', useFactory: function () { return (_this.object); }, deps: [] }],
            parent: this.injector
        });
    };
    /**
     * Return class name for the object to inject
     */
    WrapperDetailElementComponent.prototype.getDetailElement = function () {
        var f = this.object.constructor;
        return rendersDSOType(f, SetViewMode.Detail);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], WrapperDetailElementComponent.prototype, "object", void 0);
    WrapperDetailElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-wrapper-detail-element',
            styleUrls: ['./wrapper-detail-element.component.scss'],
            templateUrl: './wrapper-detail-element.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [Injector])
    ], WrapperDetailElementComponent);
    return WrapperDetailElementComponent;
}());
export { WrapperDetailElementComponent };
//# sourceMappingURL=wrapper-detail-element.component.js.map