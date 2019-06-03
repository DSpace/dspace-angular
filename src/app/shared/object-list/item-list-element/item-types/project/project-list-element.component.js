import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ItemViewMode, rendersItemType } from '../../../../items/item-type-decorator';
import { TypedItemSearchResultListElementComponent } from '../typed-item-search-result-list-element.component';
var ProjectListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(ProjectListElementComponent, _super);
    /**
     * The component for displaying a list element for an item of the type Project
     */
    function ProjectListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProjectListElementComponent = tslib_1.__decorate([
        rendersItemType('Project', ItemViewMode.Element),
        Component({
            selector: 'ds-project-list-element',
            styleUrls: ['./project-list-element.component.scss'],
            templateUrl: './project-list-element.component.html'
        })
        /**
         * The component for displaying a list element for an item of the type Project
         */
    ], ProjectListElementComponent);
    return ProjectListElementComponent;
}(TypedItemSearchResultListElementComponent));
export { ProjectListElementComponent };
//# sourceMappingURL=project-list-element.component.js.map