import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';
var JournalIssueComponent = /** @class */ (function (_super) {
    tslib_1.__extends(JournalIssueComponent, _super);
    function JournalIssueComponent(item, ids) {
        var _this = _super.call(this, item) || this;
        _this.item = item;
        _this.ids = ids;
        return _this;
    }
    JournalIssueComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (isNotEmpty(this.resolvedRelsAndTypes$)) {
            this.volumes$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isJournalVolumeOfIssue'), relationsToItems(this.item.id, this.ids));
            this.publications$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isPublicationOfJournalIssue'), relationsToItems(this.item.id, this.ids));
        }
    };
    JournalIssueComponent = tslib_1.__decorate([
        rendersItemType('JournalIssue', ItemViewMode.Full),
        Component({
            selector: 'ds-journal-issue',
            styleUrls: ['./journal-issue.component.scss'],
            templateUrl: './journal-issue.component.html'
        })
        /**
         * The component for displaying metadata and relations of an item of the type Journal Issue
         */
        ,
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Item,
            ItemDataService])
    ], JournalIssueComponent);
    return JournalIssueComponent;
}(ItemComponent));
export { JournalIssueComponent };
//# sourceMappingURL=journal-issue.component.js.map