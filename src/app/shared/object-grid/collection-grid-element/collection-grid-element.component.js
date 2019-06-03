import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Collection } from '../../../core/shared/collection.model';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { SetViewMode } from '../../view-mode';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
var CollectionGridElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionGridElementComponent, _super);
    function CollectionGridElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollectionGridElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-collection-grid-element',
            styleUrls: ['./collection-grid-element.component.scss'],
            templateUrl: './collection-grid-element.component.html'
        }),
        renderElementsFor(Collection, SetViewMode.Grid)
    ], CollectionGridElementComponent);
    return CollectionGridElementComponent;
}(AbstractListableElementComponent));
export { CollectionGridElementComponent };
//# sourceMappingURL=collection-grid-element.component.js.map