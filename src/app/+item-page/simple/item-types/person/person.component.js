import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';
var PersonComponent = /** @class */ (function (_super) {
    tslib_1.__extends(PersonComponent, _super);
    function PersonComponent(item, ids, fixedFilterService) {
        var _this = _super.call(this, item) || this;
        _this.item = item;
        _this.ids = ids;
        _this.fixedFilterService = fixedFilterService;
        return _this;
    }
    PersonComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (isNotEmpty(this.resolvedRelsAndTypes$)) {
            this.publications$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isPublicationOfAuthor'), relationsToItems(this.item.id, this.ids));
            this.projects$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isProjectOfPerson'), relationsToItems(this.item.id, this.ids));
            this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isOrgUnitOfPerson'), relationsToItems(this.item.id, this.ids));
            this.fixedFilterQuery = this.fixedFilterService.getQueryByRelations('isAuthorOfPublication', this.item.id);
            this.fixedFilter$ = observableOf('publication');
        }
    };
    PersonComponent = tslib_1.__decorate([
        rendersItemType('Person', ItemViewMode.Full),
        Component({
            selector: 'ds-person',
            styleUrls: ['./person.component.scss'],
            templateUrl: './person.component.html'
        })
        /**
         * The component for displaying metadata and relations of an item of the type Person
         */
        ,
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Item,
            ItemDataService,
            SearchFixedFilterService])
    ], PersonComponent);
    return PersonComponent;
}(ItemComponent));
export { PersonComponent };
//# sourceMappingURL=person.component.js.map