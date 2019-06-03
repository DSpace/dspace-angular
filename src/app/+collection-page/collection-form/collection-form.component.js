import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { DynamicInputModel, DynamicTextAreaModel } from '@ng-dynamic-forms/core';
import { ResourceType } from '../../core/shared/resource-type';
import { Collection } from '../../core/shared/collection.model';
import { ComColFormComponent } from '../../shared/comcol-forms/comcol-form/comcol-form.component';
/**
 * Form used for creating and editing collections
 */
var CollectionFormComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CollectionFormComponent, _super);
    function CollectionFormComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @type {Collection} A new collection when a collection is being created, an existing Input collection when a collection is being edited
         */
        _this.dso = new Collection();
        /**
         * @type {ResourceType.Collection} This is a collection-type form
         */
        _this.type = ResourceType.Collection;
        /**
         * The dynamic form fields used for creating/editing a collection
         * @type {(DynamicInputModel | DynamicTextAreaModel)[]}
         */
        _this.formModel = [
            new DynamicInputModel({
                id: 'title',
                name: 'dc.title',
                required: true,
                validators: {
                    required: null
                },
                errorMessages: {
                    required: 'Please enter a name for this title'
                },
            }),
            new DynamicTextAreaModel({
                id: 'description',
                name: 'dc.description',
            }),
            new DynamicTextAreaModel({
                id: 'abstract',
                name: 'dc.description.abstract',
            }),
            new DynamicTextAreaModel({
                id: 'rights',
                name: 'dc.rights',
            }),
            new DynamicTextAreaModel({
                id: 'tableofcontents',
                name: 'dc.description.tableofcontents',
            }),
            new DynamicTextAreaModel({
                id: 'license',
                name: 'dc.rights.license',
            }),
            new DynamicTextAreaModel({
                id: 'provenance',
                name: 'dc.description.provenance',
            }),
        ];
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Collection)
    ], CollectionFormComponent.prototype, "dso", void 0);
    CollectionFormComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-collection-form',
            styleUrls: ['../../shared/comcol-forms/comcol-form/comcol-form.component.scss'],
            templateUrl: '../../shared/comcol-forms/comcol-form/comcol-form.component.html'
        })
    ], CollectionFormComponent);
    return CollectionFormComponent;
}(ComColFormComponent));
export { CollectionFormComponent };
//# sourceMappingURL=collection-form.component.js.map