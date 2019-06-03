import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { Collection } from '../../../core/shared/collection.model';
import { renderElementsFor } from '../../object-collection/shared/dso-element-decorator';
import { SetViewMode } from '../../view-mode';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';
var CollectionListElementComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionListElementComponent, _super);
    function CollectionListElementComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollectionListElementComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-collection-list-element',
            styleUrls: ['./collection-list-element.component.scss'],
            templateUrl: './collection-list-element.component.html'
        }),
        renderElementsFor(Collection, SetViewMode.List)
    ], CollectionListElementComponent);
    return CollectionListElementComponent;
}(AbstractListableElementComponent));
export { CollectionListElementComponent };
//# sourceMappingURL=collection-list-element.component.js.map