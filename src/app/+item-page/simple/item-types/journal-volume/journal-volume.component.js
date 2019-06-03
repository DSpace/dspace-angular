import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';
var JournalVolumeComponent = /** @class */ (function (_super) {
    tslib_1.__extends(JournalVolumeComponent, _super);
    function JournalVolumeComponent(item, ids) {
        var _this = _super.call(this, item) || this;
        _this.item = item;
        _this.ids = ids;
        return _this;
    }
    JournalVolumeComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (isNotEmpty(this.resolvedRelsAndTypes$)) {
            this.journals$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isJournalOfVolume'), relationsToItems(this.item.id, this.ids));
            this.issues$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isIssueOfJournalVolume'), relationsToItems(this.item.id, this.ids));
        }
    };
    JournalVolumeComponent = tslib_1.__decorate([
        rendersItemType('JournalVolume', ItemViewMode.Full),
        Component({
            selector: 'ds-journal-volume',
            styleUrls: ['./journal-volume.component.scss'],
            templateUrl: './journal-volume.component.html'
        })
        /**
         * The component for displaying metadata and relations of an item of the type Journal Volume
         */
        ,
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Item,
            ItemDataService])
    ], JournalVolumeComponent);
    return JournalVolumeComponent;
}(ItemComponent));
export { JournalVolumeComponent };
//# sourceMappingURL=journal-volume.component.js.map