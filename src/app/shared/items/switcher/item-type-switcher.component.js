import * as tslib_1 from "tslib";
import { Component, InjectionToken, Injector, Input } from '@angular/core';
import { hasValue } from '../../empty.util';
import { getComponentByItemType } from '../item-type-decorator';
export var ITEM = new InjectionToken('item');
var ItemTypeSwitcherComponent = /** @class */ (function () {
    function ItemTypeSwitcherComponent(injector) {
        this.injector = injector;
    }
    ItemTypeSwitcherComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.objectInjector = Injector.create({
            providers: [{ provide: ITEM, useFactory: function () { return _this.object; }, deps: [] }],
            parent: this.injector
        });
    };
    /**
     * Fetch the component depending on the item's relationship type
     * @returns {string}
     */
    ItemTypeSwitcherComponent.prototype.getComponent = function () {
        if (hasValue(this.object.representationType)) {
            var metadataRepresentation = this.object;
            return getComponentByItemType(metadataRepresentation.itemType, this.viewMode, metadataRepresentation.representationType);
        }
        var item;
        if (hasValue(this.object.indexableObject)) {
            var searchResult = this.object;
            item = searchResult.indexableObject;
        }
        else {
            item = this.object;
        }
        var type = item.firstMetadataValue('relationship.type');
        return getComponentByItemType(type, this.viewMode);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ItemTypeSwitcherComponent.prototype, "object", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ItemTypeSwitcherComponent.prototype, "viewMode", void 0);
    ItemTypeSwitcherComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-item-type-switcher',
            styleUrls: ['./item-type-switcher.component.scss'],
            templateUrl: './item-type-switcher.component.html'
        })
        /**
         * Component for determining what component to use depending on the item's relationship type (relationship.type)
         */
        ,
        tslib_1.__metadata("design:paramtypes", [Injector])
    ], ItemTypeSwitcherComponent);
    return ItemTypeSwitcherComponent;
}());
export { ItemTypeSwitcherComponent };
//# sourceMappingURL=item-type-switcher.component.js.map