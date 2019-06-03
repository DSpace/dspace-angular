import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Community } from '../../../core/shared/community.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { SetViewMode } from '../../view-mode';
var CommunityGridElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CommunityGridElementComponent, _super);
    function CommunityGridElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommunityGridElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-community-grid-element',
            styleUrls: ['./community-grid-element.component.scss'],
            templateUrl: './community-grid-element.component.html'
        }),
        renderElementsFor(Community, SetViewMode.Grid)
    ], CommunityGridElementComponent);
    return CommunityGridElementComponent;
}(AbstractListableElementComponent));
export { CommunityGridElementComponent };
//# sourceMappingURL=community-grid-element.component.js.map