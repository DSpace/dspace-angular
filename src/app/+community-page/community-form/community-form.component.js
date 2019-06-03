import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { DynamicInputModel, DynamicTextAreaModel } from '@ng-dynamic-forms/core';
import { Community } from '../../core/shared/community.model';
import { ResourceType } from '../../core/shared/resource-type';
import { ComColFormComponent } from '../../shared/comcol-forms/comcol-form/comcol-form.component';
/**
 * Form used for creating and editing communities
 */
var CommunityFormComponent = /** @class */ (function (_super) {
    tslib_1.__extends(CommunityFormComponent, _super);
    function CommunityFormComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * @type {Community} A new community when a community is being created, an existing Input community when a community is being edited
         */
        _this.dso = new Community();
        /**
         * @type {ResourceType.Community} This is a community-type form
         */
        _this.type = ResourceType.Community;
        /**
         * The dynamic form fields used for creating/editing a community
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
        ];
        return _this;
    }
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Community)
    ], CommunityFormComponent.prototype, "dso", void 0);
    CommunityFormComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-community-form',
            styleUrls: ['../../shared/comcol-forms/comcol-form/comcol-form.component.scss'],
            templateUrl: '../../shared/comcol-forms/comcol-form/comcol-form.component.html'
        })
    ], CommunityFormComponent);
    return CommunityFormComponent;
}(ComColFormComponent));
export { CommunityFormComponent };
//# sourceMappingURL=community-form.component.js.map