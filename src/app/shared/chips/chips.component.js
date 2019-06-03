import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, } from '@angular/core';
import { isObject } from 'lodash';
import { Chips } from './models/chips.model';
import { UploaderService } from '../uploader/uploader.service';
import { TranslateService } from '@ngx-translate/core';
var ChipsComponent = /** @class */ (function () {
    function ChipsComponent(cdr, uploaderService, translate) {
        this.cdr = cdr;
        this.uploaderService = uploaderService;
        this.translate = translate;
        this.editable = true;
        this.showIcons = false;
        this.selected = new EventEmitter();
        this.remove = new EventEmitter();
        this.change = new EventEmitter();
        this.dragged = -1;
        this.options = {
            animation: 300,
            chosenClass: 'm-0',
            dragClass: 'm-0',
            filter: '.chips-sort-ignore',
            ghostClass: 'm-0'
        };
    }
    ChipsComponent.prototype.ngOnChanges = function (changes) {
        if (changes.chips && !changes.chips.isFirstChange()) {
            this.chips = changes.chips.currentValue;
        }
    };
    ChipsComponent.prototype.chipsSelected = function (event, index) {
        event.preventDefault();
        if (this.editable) {
            this.chips.getChips().forEach(function (item, i) {
                if (i === index) {
                    item.setEditMode();
                }
                else {
                    item.unsetEditMode();
                }
            });
            this.selected.emit(index);
        }
    };
    ChipsComponent.prototype.removeChips = function (event, index) {
        event.preventDefault();
        event.stopPropagation();
        // Can't remove if this element is in editMode
        if (!this.chips.getChipByIndex(index).editMode) {
            this.chips.remove(this.chips.getChipByIndex(index));
        }
    };
    ChipsComponent.prototype.onDragStart = function (index) {
        this.uploaderService.overrideDragOverPage();
        this.dragged = index;
    };
    ChipsComponent.prototype.onDragEnd = function (event) {
        this.uploaderService.allowDragOverPage();
        this.dragged = -1;
        this.chips.updateOrder();
    };
    ChipsComponent.prototype.showTooltip = function (tooltip, index, field) {
        var _this = this;
        tooltip.close();
        var chipsItem = this.chips.getChipByIndex(index);
        var textToDisplay = [];
        if (!chipsItem.editMode && this.dragged === -1) {
            if (field) {
                if (isObject(chipsItem.item[field])) {
                    textToDisplay.push(chipsItem.item[field].display);
                    if (chipsItem.item[field].hasOtherInformation()) {
                        Object.keys(chipsItem.item[field].otherInformation)
                            .forEach(function (otherField) {
                            _this.translate.get('form.other-information.' + otherField)
                                .subscribe(function (label) {
                                textToDisplay.push(label + ': ' + chipsItem.item[field].otherInformation[otherField]);
                            });
                        });
                    }
                }
                else {
                    textToDisplay.push(chipsItem.item[field]);
                }
            }
            else {
                textToDisplay.push(chipsItem.display);
            }
            this.cdr.detectChanges();
            if (!chipsItem.hasIcons() || !chipsItem.hasVisibleIcons() || field) {
                this.tipText = textToDisplay;
                tooltip.open();
            }
        }
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Chips)
    ], ChipsComponent.prototype, "chips", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], ChipsComponent.prototype, "wrapperClass", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ChipsComponent.prototype, "editable", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ChipsComponent.prototype, "showIcons", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ChipsComponent.prototype, "selected", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ChipsComponent.prototype, "remove", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], ChipsComponent.prototype, "change", void 0);
    ChipsComponent = tslib_1.__decorate([
        Component({
            selector: 'ds-chips',
            styleUrls: ['./chips.component.scss'],
            templateUrl: './chips.component.html',
        }),
        tslib_1.__metadata("design:paramtypes", [ChangeDetectorRef,
            UploaderService,
            TranslateService])
    ], ChipsComponent);
    return ChipsComponent;
}());
export { ChipsComponent };
//# sourceMappingURL=chips.component.js.map