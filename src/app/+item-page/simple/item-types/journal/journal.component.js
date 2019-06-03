import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';
var JournalComponent = /** @class */ (function (_super) {
    tslib_1.__extends(JournalComponent, _super);
    function JournalComponent(item, ids) {
        var _this = _super.call(this, item) || this;
        _this.item = item;
        _this.ids = ids;
        return _this;
    }
    JournalComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (isNotEmpty(this.resolvedRelsAndTypes$)) {
            this.volumes$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isVolumeOfJournal'), relationsToItems(this.item.id, this.ids));
        }
    };
    JournalComponent = tslib_1.__decorate([
        rendersItemType('Journal', ItemViewMode.Full),
        Component({
            selector: 'ds-journal',
            styleUrls: ['./journal.component.scss'],
            templateUrl: './journal.component.html'
        })
        /**
         * The component for displaying metadata and relations of an item of the type Journal
         */
        ,
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Item,
            ItemDataService])
    ], JournalComponent);
    return JournalComponent;
}(ItemComponent));
export { JournalComponent };
//# sourceMappingURL=journal.component.js.map