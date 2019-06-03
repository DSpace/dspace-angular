import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { BrowseEntry } from '../../../core/shared/browse-entry.model';
import { SetViewMode } from '../../view-mode';
var BrowseEntryListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(BrowseEntryListElementComponent, _super);
    function BrowseEntryListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrowseEntryListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-browse-entry-list-element',
            styleUrls: ['./browse-entry-list-element.component.scss'],
            templateUrl: './browse-entry-list-element.component.html'
        })
        /**
         * This component is automatically used to create a list view for BrowseEntry objects when used in ObjectCollectionComponent
         */
        ,
        renderElementsFor(BrowseEntry, SetViewMode.List)
    ], BrowseEntryListElementComponent);
    return BrowseEntryListElementComponent;
}(AbstractListableElementComponent));
export { BrowseEntryListElementComponent };
//# sourceMappingURL=browse-entry-list-element.component.js.map