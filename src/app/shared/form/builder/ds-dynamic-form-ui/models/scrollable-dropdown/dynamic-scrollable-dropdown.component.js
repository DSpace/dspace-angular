import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicScrollableDropdownModel } from './dynamic-scrollable-dropdown.model';
import { PageInfo } from '../../../../../../core/shared/page-info.model';
import { isNull, isUndefined } from '../../../../../empty.util';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../../../../../core/integration/integration-data';
var DsDynamicScrollableDropdownComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicScrollableDropdownComponent, _super);
    function DsDynamicScrollableDropdownComponent(authorityService, cdr, layoutService, validationService) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.authorityService = authorityService;
        _this.cdr = cdr;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.bindId = true;
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.loading = false;
        _this.inputFormatter = function (x) { return x.display || x.value; };
        return _this;
    }
    DsDynamicScrollableDropdownComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.searchOptions = new IntegrationSearchOptions(this.model.authorityOptions.scope, this.model.authorityOptions.name, this.model.authorityOptions.metadata, '', this.model.maxOptions, 1);
        this.authorityService.getEntriesByName(this.searchOptions).pipe(catchError(function () {
            var emptyResult = new IntegrationData(new PageInfo(), []);
            return observableOf(emptyResult);
        }), first())
            .subscribe(function (object) {
            _this.optionsList = object.payload;
            if (_this.model.value) {
                _this.setCurrentValue(_this.model.value);
            }
            _this.pageInfo = object.pageInfo;
            _this.cdr.detectChanges();
        });
    };
    DsDynamicScrollableDropdownComponent.prototype.openDropdown = function (sdRef) {
        if (!this.model.readOnly) {
            sdRef.open();
        }
    };
    DsDynamicScrollableDropdownComponent.prototype.onScroll = function () {
        var _this = this;
        if (!this.loading && this.pageInfo.currentPage <= this.pageInfo.totalPages) {
            this.loading = true;
            this.searchOptions.currentPage++;
            this.authorityService.getEntriesByName(this.searchOptions).pipe(catchError(function () {
                var emptyResult = new IntegrationData(new PageInfo(), []);
                return observableOf(emptyResult);
            }), tap(function () { return _this.loading = false; }))
                .subscribe(function (object) {
                _this.optionsList = _this.optionsList.concat(object.payload);
                _this.pageInfo = object.pageInfo;
                _this.cdr.detectChanges();
            });
        }
    };
    DsDynamicScrollableDropdownComponent.prototype.onBlur = function (event) {
        this.blur.emit(event);
    };
    DsDynamicScrollableDropdownComponent.prototype.onFocus = function (event) {
        this.focus.emit(event);
    };
    DsDynamicScrollableDropdownComponent.prototype.onSelect = function (event) {
        this.group.markAsDirty();
        this.model.valueUpdates.next(event);
        this.change.emit(event);
        this.setCurrentValue(event);
    };
    DsDynamicScrollableDropdownComponent.prototype.onToggle = function (sdRef) {
        if (sdRef.isOpen()) {
            this.focus.emit(event);
        }
        else {
            this.blur.emit(event);
        }
    };
    DsDynamicScrollableDropdownComponent.prototype.setCurrentValue = function (value) {
        var result;
        if (isUndefined(value) || isNull(value)) {
            result = '';
        }
        else if (typeof value === 'string') {
            result = value;
        }
        else {
            for (var _i = 0, _a = this.optionsList; _i < _a.length; _i++) {
                var item = _a[_i];
                if (value.value === item.value) {
                    result = this.inputFormatter(item);
                    break;
                }
            }
        }
        this.currentValue = observableOf(result);
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicScrollableDropdownComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicScrollableDropdownComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", DynamicScrollableDropdownModel)
    ], DsDynamicScrollableDropdownComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicScrollableDropdownComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicScrollableDropdownComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicScrollableDropdownComponent.prototype, "focus", void 0);
    DsDynamicScrollableDropdownComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-scrollable-dropdown',
            styleUrls: ['./dynamic-scrollable-dropdown.component.scss'],
            templateUrl: './dynamic-scrollable-dropdown.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [AuthorityService,
            ChangeDetectorRef,
            DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDynamicScrollableDropdownComponent);
    return DsDynamicScrollableDropdownComponent;
}(DynamicFormControlComponent));
export { DsDynamicScrollableDropdownComponent };
//# sourceMappingURL=dynamic-scrollable-dropdown.component.js.map