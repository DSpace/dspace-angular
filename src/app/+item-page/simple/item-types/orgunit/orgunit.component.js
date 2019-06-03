import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';
var OrgunitComponent = /** @class */ (function (_super) {
    tslib_1.__extends(OrgunitComponent, _super);
    function OrgunitComponent(item, ids) {
        var _this = _super.call(this, item) || this;
        _this.item = item;
        _this.ids = ids;
        return _this;
    }
    OrgunitComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (isNotEmpty(this.resolvedRelsAndTypes$)) {
            this.people$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isPersonOfOrgUnit'), relationsToItems(this.item.id, this.ids));
            this.projects$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isProjectOfOrgUnit'), relationsToItems(this.item.id, this.ids));
            this.publications$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isPublicationOfOrgUnit'), relationsToItems(this.item.id, this.ids));
        }
    };
    OrgunitComponent = tslib_1.__decorate([
        rendersItemType('OrgUnit', ItemViewMode.Full),
        Component({
            selector: 'ds-orgunit',
            styleUrls: ['./orgunit.component.scss'],
            templateUrl: './orgunit.component.html'
        })
        /**
         * The component for displaying metadata and relations of an item of the type Organisation Unit
         */
        ,
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Item,
            ItemDataService])
    ], OrgunitComponent);
    return OrgunitComponent;
}(ItemComponent));
export { OrgunitComponent };
//# sourceMappingURL=orgunit.component.js.map