import * as tslib_1 from "tslib";
import { Component, Inject } from '@angular/core';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemViewMode, rendersItemType } from '../../../../shared/items/item-type-decorator';
import { ITEM } from '../../../../shared/items/switcher/item-type-switcher.component';
import { isNotEmpty } from '../../../../shared/empty.util';
import { ItemComponent } from '../shared/item.component';
import { filterRelationsByTypeLabel, relationsToItems } from '../shared/item-relationships-utils';
var ProjectComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ProjectComponent, _super);
    function ProjectComponent(item, ids) {
        var _this = _super.call(this, item) || this;
        _this.item = item;
        _this.ids = ids;
        return _this;
    }
    ProjectComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (isNotEmpty(this.resolvedRelsAndTypes$)) {
            this.contributors$ = this.buildRepresentations('OrgUnit', 'project.contributor.other', this.ids);
            this.people$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isPersonOfProject'), relationsToItems(this.item.id, this.ids));
            this.publications$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isPublicationOfProject'), relationsToItems(this.item.id, this.ids));
            this.orgUnits$ = this.resolvedRelsAndTypes$.pipe(filterRelationsByTypeLabel('isOrgUnitOfProject'), relationsToItems(this.item.id, this.ids));
        }
    };
    ProjectComponent = tslib_1.__decorate([
        rendersItemType('Project', ItemViewMode.Full),
        Component({
            selector: 'ds-project',
            styleUrls: ['./project.component.scss'],
            templateUrl: './project.component.html'
        })
        /**
         * The component for displaying metadata and relations of an item of the type Project
         */
        ,
        tslib_1.__param(0, Inject(ITEM)),
        tslib_1.__metadata("design:paramtypes", [Item,
            ItemDataService])
    ], ProjectComponent);
    return ProjectComponent;
}(ItemComponent));
export { ProjectComponent };
//# sourceMappingURL=project.component.js.map