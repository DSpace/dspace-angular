import { isObject, uniqueId } from 'lodash';
import { hasValue, isNotEmpty } from '../../empty.util';
import { ConfidenceType } from '../../../core/integration/models/confidence-type';
var ChipsItem = /** @class */ (function () {
    function ChipsItem(item, fieldToDisplay, objToDisplay, icons, editMode) {
        if (fieldToDisplay === void 0) { fieldToDisplay = 'display'; }
        this.id = uniqueId();
        this._item = item;
        this.fieldToDisplay = fieldToDisplay;
        this.objToDisplay = objToDisplay;
        this.setDisplayText();
        this.editMode = editMode || false;
        this.icons = icons || [];
    }
    Object.defineProperty(ChipsItem.prototype, "item", {
        get: function () {
            return this._item;
        },
        set: function (item) {
            this._item = item;
        },
        enumerable: true,
        configurable: true
    });
    ChipsItem.prototype.isNestedItem = function () {
        return (isNotEmpty(this.item)
            && isObject(this.item)
            && isNotEmpty(this.objToDisplay)
            && this.item[this.objToDisplay]);
    };
    ChipsItem.prototype.hasIcons = function () {
        return isNotEmpty(this.icons);
    };
    ChipsItem.prototype.hasVisibleIcons = function () {
        if (isNotEmpty(this.icons)) {
            var hasVisible = false;
            // check if it has at least one visible icon
            for (var _i = 0, _a = this.icons; _i < _a.length; _i++) {
                var icon = _a[_i];
                if (this._item.hasOwnProperty(icon.metadata)
                    && (((typeof this._item[icon.metadata] === 'string') && hasValue(this._item[icon.metadata]))
                        || this._item[icon.metadata].hasValue())
                    && !this._item[icon.metadata].hasPlaceholder()) {
                    if ((icon.visibleWhenAuthorityEmpty
                        || this._item[icon.metadata].confidence !== ConfidenceType.CF_UNSET)
                        && isNotEmpty(icon.style)) {
                        hasVisible = true;
                        break;
                    }
                }
            }
            return hasVisible;
        }
        else {
            return false;
        }
    };
    ChipsItem.prototype.setEditMode = function () {
        this.editMode = true;
    };
    ChipsItem.prototype.updateIcons = function (icons) {
        this.icons = icons;
    };
    ChipsItem.prototype.updateItem = function (item) {
        this._item = item;
        this.setDisplayText();
    };
    ChipsItem.prototype.unsetEditMode = function () {
        this.editMode = false;
    };
    ChipsItem.prototype.setDisplayText = function () {
        var value = this._item;
        if (isObject(this._item)) {
            // Check If displayField is in an internal object
            var obj = this.objToDisplay ? this._item[this.objToDisplay] : this._item;
            if (isObject(obj) && obj) {
                value = obj[this.fieldToDisplay] || obj.value;
            }
            else {
                value = obj;
            }
        }
        this.display = value;
    };
    return ChipsItem;
}());
export { ChipsItem };
//# sourceMappingURL=chips-item.model.js.map