import * as tslib_1 from "tslib";
import { DynamicInputModel, serializable } from '@ng-dynamic-forms/core';
import { Subject } from 'rxjs';
import { AuthorityOptions } from '../../../../../core/integration/models/authority-options.model';
import { hasValue } from '../../../../empty.util';
import { FormFieldMetadataValueObject } from '../../models/form-field-metadata-value.model';
var DsDynamicInputModel = /** @class */ (function (_super) {
    tslib_1.__extends(DsDynamicInputModel, _super);
    function DsDynamicInputModel(config, layout) {
        var _this = _super.call(this, config, layout) || this;
        _this.readOnly = config.readOnly;
        _this.value = config.value;
        _this.language = config.language;
        if (!_this.language) {
            // TypeAhead
            if (config.value instanceof FormFieldMetadataValueObject) {
                _this.language = config.value.language;
            }
            else if (Array.isArray(config.value)) {
                // Tag of Authority
                if (config.value[0].language) {
                    _this.language = config.value[0].language;
                }
            }
        }
        _this.languageCodes = config.languageCodes;
        _this.languageUpdates = new Subject();
        _this.languageUpdates.subscribe(function (lang) {
            _this.language = lang;
        });
        _this.authorityOptions = config.authorityOptions;
        return _this;
    }
    Object.defineProperty(DsDynamicInputModel.prototype, "hasAuthority", {
        get: function () {
            return this.authorityOptions && hasValue(this.authorityOptions.name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DsDynamicInputModel.prototype, "hasLanguages", {
        get: function () {
            if (this.languageCodes && this.languageCodes.length > 1) {
                return true;
            }
            else {
                return false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DsDynamicInputModel.prototype, "language", {
        get: function () {
            return this._language;
        },
        set: function (language) {
            this._language = language;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DsDynamicInputModel.prototype, "languageCodes", {
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
        tslib_1.__metadata("design:type", AuthorityOptions)
    ], DsDynamicInputModel.prototype, "authorityOptions", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Array)
    ], DsDynamicInputModel.prototype, "_languageCodes", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", String)
    ], DsDynamicInputModel.prototype, "_language", void 0);
    tslib_1.__decorate([
        serializable(),
        tslib_1.__metadata("design:type", Subject)
    ], DsDynamicInputModel.prototype, "languageUpdates", void 0);
    return DsDynamicInputModel;
}(DynamicInputModel));
export { DsDynamicInputModel };
//# sourceMappingURL=ds-dynamic-input.model.js.map