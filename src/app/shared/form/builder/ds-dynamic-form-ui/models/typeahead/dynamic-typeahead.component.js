import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { catchError, debounceTime, distinctUntilChanged, filter, map, merge, switchMap, tap } from 'rxjs/operators';
import { Observable, of as observableOf, Subject } from 'rxjs';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicTypeaheadModel } from './dynamic-typeahead.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { isEmpty, isNotEmpty } from '../../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../../models/form-field-metadata-value.model';
var DsDynamicTypeaheadComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicTypeaheadComponent, _super);
    function DsDynamicTypeaheadComponent(authorityService, cdr, layoutService, validationService) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.authorityService = authorityService;
        _this.cdr = cdr;
        _this.layoutService = layoutService;
        _this.validationService = validationService;
        _this.bindId = true;
        _this.blur = new EventEmitter();
        _this.change = new EventEmitter();
        _this.focus = new EventEmitter();
        _this.searching = false;
        _this.searchFailed = false;
        _this.hideSearchingWhenUnsubscribed$ = new Observable(function () { return function () { return _this.changeSearchingStatus(false); }; });
        _this.click$ = new Subject();
        _this.formatter = function (x) {
            return (typeof x === 'object') ? x.display : x;
        };
        _this.search = function (text$) {
            return text$.pipe(merge(_this.click$), debounceTime(300), distinctUntilChanged(), tap(function () { return _this.changeSearchingStatus(true); }), switchMap(function (term) {
                if (term === '' || term.length < _this.model.minChars) {
                    return observableOf({ list: [] });
                }
                else {
                    _this.searchOptions.query = term;
                    return _this.authorityService.getEntriesByName(_this.searchOptions).pipe(map(function (authorities) {
                        // @TODO Pagination for authority is not working, to refactor when it will be fixed
                        return {
                            list: authorities.payload,
                            pageInfo: authorities.pageInfo
                        };
                    }), tap(function () { return _this.searchFailed = false; }), catchError(function () {
                        _this.searchFailed = true;
                        return observableOf({ list: [] });
                    }));
                }
            }), map(function (results) { return results.list; }), tap(function () { return _this.changeSearchingStatus(false); }), merge(_this.hideSearchingWhenUnsubscribed$));
        };
        return _this;
    }
    DsDynamicTypeaheadComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentValue = this.model.value;
        this.searchOptions = new IntegrationSearchOptions(this.model.authorityOptions.scope, this.model.authorityOptions.name, this.model.authorityOptions.metadata);
        this.group.get(this.model.id).valueChanges.pipe(filter(function (value) { return _this.currentValue !== value; }))
            .subscribe(function (value) {
            _this.currentValue = value;
        });
    };
    DsDynamicTypeaheadComponent.prototype.changeSearchingStatus = function (status) {
        this.searching = status;
        this.cdr.detectChanges();
    };
    DsDynamicTypeaheadComponent.prototype.onInput = function (event) {
        if (!this.model.authorityOptions.closed && isNotEmpty(event.target.value)) {
            this.inputValue = new FormFieldMetadataValueObject(event.target.value);
            this.model.valueUpdates.next(this.inputValue);
        }
    };
    DsDynamicTypeaheadComponent.prototype.onBlur = function (event) {
        if (!this.model.authorityOptions.closed && isNotEmpty(this.inputValue)) {
            this.change.emit(this.inputValue);
            this.inputValue = null;
        }
        this.blur.emit(event);
    };
    DsDynamicTypeaheadComponent.prototype.onChange = function (event) {
        event.stopPropagation();
        if (isEmpty(this.currentValue)) {
            this.model.valueUpdates.next(null);
            this.change.emit(null);
        }
    };
    DsDynamicTypeaheadComponent.prototype.onFocus = function (event) {
        this.focus.emit(event);
    };
    DsDynamicTypeaheadComponent.prototype.onSelectItem = function (event) {
        this.inputValue = null;
        this.currentValue = event.item;
        this.model.valueUpdates.next(event.item);
        this.change.emit(event.item);
    };
    DsDynamicTypeaheadComponent.prototype.whenClickOnConfidenceNotAccepted = function (confidence) {
        if (!this.model.readOnly) {
            this.click$.next(this.formatter(this.currentValue));
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicTypeaheadComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicTypeaheadComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", DynamicTypeaheadModel)
    ], DsDynamicTypeaheadComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicTypeaheadComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicTypeaheadComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicTypeaheadComponent.prototype, "focus", void 0);
    DsDynamicTypeaheadComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-typeahead',
            styleUrls: ['./dynamic-typeahead.component.scss'],
            templateUrl: './dynamic-typeahead.component.html'
        }),
        tslib_1.__metadata("design:paramtypes", [AuthorityService,
            ChangeDetectorRef,
            DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDynamicTypeaheadComponent);
    return DsDynamicTypeaheadComponent;
}(DynamicFormControlComponent));
export { DsDynamicTypeaheadComponent };
//# sourceMappingURL=dynamic-typeahead.component.js.map