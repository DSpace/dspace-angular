import * as tslib_1 from "tslib";
import { DynamicFormGroupModel, serializable } from '@ng-dynamic-forms/core';
import { Subject } from 'rxjs';
export var QUALDROP_GROUP_SUFFIX = '_QUALDROP_GROUP';
export var QUALDROP_METADATA_SUFFIX = '_QUALDROP_METADATA';
export var QUALDROP_VALUE_SUFFIX = '_QUALDROP_VALUE';
var DynamicQualdropModel = /** @class */ (function (_super) {
    tslib_1.__extends(DynamicQualdropModel, _super);
    function DynamicQualdropModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.hasLanguages = false;
        _this.isCustomGroup = true;
        _this.readOnly = config.readOnly;
        _this.language = config.language;
        _this.languageCodes = config.languageCodes;
        _this.languageUpdates = new Subject();
        _this.languageUpdates.subscribe(function (lang) {
            _this.language = lang;
        });
        return _this;
    }
    Object.defineProperty(DynamicQualdropModel.prototype, "value", {
        get: function () {
            return this.get(1).value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicQualdropModel.prototype, "qualdropId", {
        get: function () {
            return this.get(0).value.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicQualdropModel.prototype, "language", {
        get: function () {
            return this._language;
        },
        set: function (language) {
            this._language = language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DynamicQualdropModel.prototype, "languageCodes", {
        get: function () {
            return this._languageCodes;
        },
        set: function (languageCodes) {
            this._languageCodes = languageCodes;
            if (!this.language || this.language === null || this.language === '') {
                this.language = this.languageCodes ? this.languageCodes[0].code : null;
            }
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DynamicQualdropModel.prototype, "_language", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Array)
    ], DynamicQualdropModel.prototype, "_languageCodes", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Subject)
    ], DynamicQualdropModel.prototype, "languageUpdates", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Object)
    ], DynamicQualdropModel.prototype, "hasLanguages", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Boolean)
    ], DynamicQualdropModel.prototype, "readOnly", void 0);
    return DynamicQualdropModel;
}(DynamicFormGroupModel));
export { DynamicQualdropModel };
//# sourceMappingURL=ds-dynamic-qualdrop.model.js.map