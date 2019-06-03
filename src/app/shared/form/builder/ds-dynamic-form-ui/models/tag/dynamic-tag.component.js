import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormControlComponent, DynamicFormLayoutService, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { of as observableOf, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, tap, switchMap, map, merge } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { isEqual } from 'lodash';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { DynamicTagModel } from './dynamic-tag.model';
import { IntegrationSearchOptions } from '../../../../../../core/integration/models/integration-options.model';
import { Chips } from '../../../../../chips/models/chips.model';
import { hasValue, isNotEmpty } from '../../../../../empty.util';
import { GLOBAL_CONFIG } from '../../../../../../../config';
var DsDynamicTagComponent = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicTagComponent, _super);
    function DsDynamicTagComponent(EnvConfig, authorityService, cdr, layoutService, validationService) {
        var _this = _super.call(this, layoutService, validationService) || this;
        _this.EnvConfig = EnvConfig;
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
        _this.hideSearchingWhenUnsubscribed = new Observable(function () { return function () { return _this.changeSearchingStatus(false); }; });
        _this.formatter = function (x) { return x.display; };
        _this.search = function (text$) {
            return text$.pipe(debounceTime(300), distinctUntilChanged(), tap(function () { return _this.changeSearchingStatus(true); }), switchMap(function (term) {
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
            }), map(function (results) { return results.list; }), tap(function () { return _this.changeSearchingStatus(false); }), merge(_this.hideSearchingWhenUnsubscribed));
        };
        return _this;
    }
    DsDynamicTagComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.hasAuthority = this.model.authorityOptions && hasValue(this.model.authorityOptions.name);
        if (this.hasAuthority) {
            this.searchOptions = new IntegrationSearchOptions(this.model.authorityOptions.scope, this.model.authorityOptions.name, this.model.authorityOptions.metadata);
        }
        this.chips = new Chips(this.model.value, 'display', null, this.EnvConfig.submission.icons.metadata);
        this.chips.chipsItems
            .subscribe(function (subItems) {
            var items = _this.chips.getChipsItems();
            // Does not emit change if model value is equal to the current value
            if (!isEqual(items, _this.model.value)) {
                _this.model.valueUpdates.next(items);
                _this.change.emit(event);
            }
        });
    };
    DsDynamicTagComponent.prototype.changeSearchingStatus = function (status) {
        this.searching = status;
        this.cdr.detectChanges();
    };
    DsDynamicTagComponent.prototype.onInput = function (event) {
        if (event.data) {
            this.group.markAsDirty();
        }
        this.cdr.detectChanges();
    };
    DsDynamicTagComponent.prototype.onBlur = function (event) {
        if (isNotEmpty(this.currentValue) && !this.instance.isPopupOpen()) {
            this.addTagsToChips();
        }
        this.blur.emit(event);
    };
    DsDynamicTagComponent.prototype.onFocus = function (event) {
        this.focus.emit(event);
    };
    DsDynamicTagComponent.prototype.onSelectItem = function (event) {
        var _this = this;
        this.chips.add(event.item);
        // this.group.controls[this.model.id].setValue(this.model.value);
        this.updateModel(event);
        setTimeout(function () {
            // Reset the input text after x ms, mandatory or the formatter overwrite it
            _this.currentValue = null;
            _this.cdr.detectChanges();
        }, 50);
    };
    DsDynamicTagComponent.prototype.updateModel = function (event) {
        this.model.valueUpdates.next(this.chips.getChipsItems());
        this.change.emit(event);
    };
    DsDynamicTagComponent.prototype.onKeyUp = function (event) {
        if (event.keyCode === 13 || event.keyCode === 188) {
            event.preventDefault();
            // Key: Enter or ',' or ';'
            this.addTagsToChips();
            event.stopPropagation();
        }
    };
    DsDynamicTagComponent.prototype.preventEventsPropagation = function (event) {
        event.stopPropagation();
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    };
    DsDynamicTagComponent.prototype.addTagsToChips = function () {
        var _this = this;
        if (hasValue(this.currentValue) && (!this.hasAuthority || !this.model.authorityOptions.closed)) {
            var res = [];
            res = this.currentValue.split(',');
            var res1_1 = [];
            res.forEach(function (item) {
                item.split(';').forEach(function (i) {
                    res1_1.push(i);
                });
            });
            res1_1.forEach(function (c) {
                c = c.trim();
                if (c.length > 0) {
                    _this.chips.add(c);
                }
            });
            // this.currentValue = '';
            setTimeout(function () {
                // Reset the input text after x ms, mandatory or the formatter overwrite it
                _this.currentValue = null;
                _this.cdr.detectChanges();
            }, 50);
            this.updateModel(event);
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], DsDynamicTagComponent.prototype, "bindId", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", FormGroup)
    ], DsDynamicTagComponent.prototype, "group", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", DynamicTagModel)
    ], DsDynamicTagComponent.prototype, "model", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicTagComponent.prototype, "blur", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicTagComponent.prototype, "change", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], DsDynamicTagComponent.prototype, "focus", void 0);
    tslib_1.__decorate([
        ViewChild('instance'),
        tslib_1.__metadata("design:type", NgbTypeahead)
    ], DsDynamicTagComponent.prototype, "instance", void 0);
    DsDynamicTagComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-dynamic-tag',
            styleUrls: ['./dynamic-tag.component.scss'],
            templateUrl: './dynamic-tag.component.html'
        }),
        tslib_1.__param(0, Inject(GLOBAL_CONFIG)),
        tslib_1.__metadata("design:paramtypes", [Object, AuthorityService,
            ChangeDetectorRef,
            DynamicFormLayoutService,
            DynamicFormValidationService])
    ], DsDynamicTagComponent);
    return DsDynamicTagComponent;
}(DynamicFormControlComponent));
export { DsDynamicTagComponent };
//# sourceMappingURL=dynamic-tag.component.js.map