import * as tslib_1 from "tslib";
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { DEFAULT_ITEM_TYPE, ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';
var PublicationComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PublicationComponent, _super);
    function PublicationComponent(item, ids) {
        var _this = _super.call(this, item) || this;
        _this.item = item;
        _this.ids = ids;
        return _this;
    }
    PublicationComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.resolvedRelsAndTypes$) {
            this.authors$ = this.buildRepresentations('Person', 'dc.contributor.author', this.ids);
            this.projects$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isProjectOfPublication'), relationsToItems(this.item.id, this.ids));
            this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isOrgUnitOfPublication'), relationsToItems(this.item.id, this.ids));
            this.journalIssues$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isJournalIssueOfPublication'), relationsToItems(this.item.id, this.ids));
        }
    };
    PublicationComponent = tslib_1.__decorate([
        rendersItemType('Publication', ItemViewMode.Full),
        rendersItemType(DEFAULT_ITEM_TYPE, ItemViewMode.Full),
        Component({
            selector: 'ds-publication',
            styleUrls: ['./publication.component.scss'],
            templateUrl: './publication.component.html',
            changeDetection: ChangeDetectionStrategy.OnPush,
        }),
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Item,
            ItemDataService])
    ], PublicationComponent);
    return PublicationComponent;
}(ItemComponent));
export { PublicationComponent };
//# sourceMappingURL=publication.component.js.map