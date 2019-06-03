import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Community } from '../../../core/shared/community.model';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { SetViewMode } from '../../view-mode';
var CommunityListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CommunityListElementComponent, _super);
    function CommunityListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CommunityListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-community-list-element',
            styleUrls: ['./community-list-element.component.scss'],
            templateUrl: './community-list-element.component.html'
        }),
        renderElementsFor(Community, SetViewMode.List)
    ], CommunityListElementComponent);
    return CommunityListElementComponent;
}(AbstractListableElementComponent));
export { CommunityListElementComponent };
//# sourceMappingURL=community-list-element.component.js.map