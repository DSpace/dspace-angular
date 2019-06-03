import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { findKey } from 'lodash';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicCheckboxModel, DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
var DsDynamicListComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicListComponent, _super);
    function DsDynamicListComponent(authorityService, cdr, formBuilderService, layoutService, validationService) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.authorityService = authorityService;
        _this.cdr = cdr;
        _this.formBuilderService = formBuilderService;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.bindId = true;
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.items = [];
        return _this;
    }
    DsDynamicListComponent.prototype.ngOnInit = function () {
        if (this.hasAuthorityOptions()) {
            // TODO Replace max elements 1000 with a paginated request when pagination bug is resolved
            this.searchOptions = new IntegrationSearchOptions(this.model.authorityOptions.scope, this.model.authorityOptions.name, this.model.authorityOptions.metadata, '', 1000, // Max elements
            1); // Current Page
            this.setOptionsFromAuthority();
        }
    };
    DsDynamicListComponent.prototype.onBlur = function (event) {
        this.blur.emit(event);
    };
    DsDynamicListComponent.prototype.onFocus = function (event) {
        this.focus.emit(event);
    };
    DsDynamicListComponent.prototype.onChange = function (event) {
        var target = event.target;
        if (this.model.repeatable) {
            // Target tabindex coincide with the array index of the value into the authority list
            var authorityValue_1 = this.optionsList[target.tabIndex];
            if (target.checked) {
                this.model.valueUpdates.next(authorityValue_1);
            }
            else {
                var newValue_1 = [];
                this.model.value
                    .filter(function (item) { return item.value !== authorityValue_1.value; })
                    .forEach(function (item) { return newValue_1.push(item); });
                this.model.valueUpdates.next(newValue_1);
            }
        }
        else {
            this.model.valueUpdates.next(this.optionsList[target.value]);
        }
        this.change.emit(event);
    };
    DsDynamicListComponent.prototype.setOptionsFromAuthority = function () {
        var _this = this;
        if (this.model.authorityOptions.name && this.model.authorityOptions.name.length > 0) {
            var listGroup_1 = this.group.controls[this.model.id];
            this.authorityService.getEntriesByName(this.searchOptions).subscribe(function (authorities) {
                var groupCounter = 0;
                var itemsPerGroup = 0;
                var tempList = [];
                _this.optionsList = authorities.payload;
                // Make a list of available options (checkbox/radio) and split in groups of 'model.groupLength'
                authorities.payload.forEach(function (option, key) {
                    var value = option.id || option.value;
                    var checked = isNotEmpty(findKey(_this.model.value, function (v) { return v.value === option.value; }));
                    var item = {
                        id: value,
                        label: option.display,
                        value: checked,
                        index: key
                    };
                    if (_this.model.repeatable) {
                        _this.formBuilderService.addFormGroupControl(listGroup_1, _this.model, new DynamicCheckboxModel(item));
                    }
                    else {
                        _this.model.options.push({
                            label: item.label,
                            value: option
                        });
                    }
                    tempList.push(item);
                    itemsPerGroup++;
                    _this.items[groupCounter] = tempList;
                    if (itemsPerGroup === _this.model.groupLength) {
                        groupCounter++;
                        itemsPerGroup = 0;
                        tempList = [];
                    }
                });
                _this.cdr.markForCheck();
            });
        }
    };
    DsDynamicListComponent.prototype.hasAuthorityOptions = function () {
        return (hasValue(this.model.authorityOptions.scope)
            && hasValue(this.model.authorityOptions.name)
            && hasValue(this.model.authorityOptions.metadata));
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicListComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicListComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicListComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicListComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicListComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicListComponent.prototype, "focus", void 0);
    DsDynamicListComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-list',
            styleUrls: ['./dynamic-list.component.scss'],
            templateUrl: './dynamic-list.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [AuthorityService,
            ChangeDetectorRef,
            FormBuilderService,
            DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDynamicListComponent);
    return DsDynamicListComponent;
}(DynamicFormControlComponent));
export { DsDynamicListComponent };
//# sourceMappingURL=dynamic-list.component.js.map