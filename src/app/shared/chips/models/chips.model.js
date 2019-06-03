import { findIndex, isEqual, isObject } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { ChipsItem } from './chips-item.model';
import { hasValue, isNotEmpty } from '../../empty.util';
import { PLACEHOLDER_PARENT_METADATA } from '../../form/builder/ds-dynamic-form-ui/models/relation-group/dynamic-relation-group.model';
import { FormFieldMetadataValueObject } from '../../form/builder/models/form-field-metadata-value.model';
import { AuthorityValue } from '../../../core/integration/models/authority.value';
var Chips = /** @class */ (function () {
    function Chips(items, displayField, displayObj, iconsConfig) {
        if (items === void 0) { items = []; }
        if (displayField === void 0) { displayField = 'display'; }
        this.displayField = displayField;
        this.displayObj = displayObj;
        this.iconsConfig = iconsConfig || [];
        if (Array.isArray(items)) {
            this.setInitialItems(items);
        }
    }
    Chips.prototype.add = function (item) {
        var icons = this.getChipsIcons(item);
        var chipsItem = new ChipsItem(item, this.displayField, this.displayObj, icons);
        var duplicatedIndex = findIndex(this._items, { display: chipsItem.display.trim() });
        if (duplicatedIndex === -1 || !isEqual(item, this.getChipByIndex(duplicatedIndex).item)) {
            this._items.push(chipsItem);
            this.chipsItems.next(this._items);
        }
    };
    Chips.prototype.getChipById = function (id) {
        var index = findIndex(this._items, { id: id });
        return this.getChipByIndex(index);
    };
    Chips.prototype.getChipByIndex = function (index) {
        if (this._items.length > 0 && this._items[index]) {
            return this._items[index];
        }
        else {
            return null;
        }
    };
    Chips.prototype.getChips = function () {
        return this._items;
    };
    /**
     * To use to get items before to store it
     * @returns {any[]}
     */
    Chips.prototype.getChipsItems = function () {
        var out = [];
        this._items.forEach(function (item) {
            out.push(item.item);
        });
        return out;
    };
    Chips.prototype.hasItems = function () {
        return this._items.length > 0;
    };
    Chips.prototype.hasPlaceholder = function (value) {
        if (isObject(value)) {
            return value.value === PLACEHOLDER_PARENT_METADATA;
        }
        else {
            return value === PLACEHOLDER_PARENT_METADATA;
        }
    };
    Chips.prototype.remove = function (chipsItem) {
        var index = findIndex(this._items, { id: chipsItem.id });
        this._items.splice(index, 1);
        this.chipsItems.next(this._items);
    };
    Chips.prototype.update = function (id, item) {
        var chipsItemTarget = this.getChipById(id);
        var icons = this.getChipsIcons(item);
        chipsItemTarget.updateItem(item);
        chipsItemTarget.updateIcons(icons);
        chipsItemTarget.unsetEditMode();
        this.chipsItems.next(this._items);
    };
    Chips.prototype.updateOrder = function () {
        this.chipsItems.next(this._items);
    };
    Chips.prototype.getChipsIcons = function (item) {
        var _this = this;
        var icons = [];
        if (typeof item === 'string' || item instanceof FormFieldMetadataValueObject || item instanceof AuthorityValue) {
            return icons;
        }
        var defaultConfigIndex = findIndex(this.iconsConfig, { name: 'default' });
        var defaultConfig = (defaultConfigIndex !== -1) ? this.iconsConfig[defaultConfigIndex] : undefined;
        var config;
        var configIndex;
        var value;
        Object.keys(item)
            .forEach(function (metadata) {
            value = item[metadata];
            configIndex = findIndex(_this.iconsConfig, { name: metadata });
            config = (configIndex !== -1) ? _this.iconsConfig[configIndex] : defaultConfig;
            if (hasValue(value) && isNotEmpty(config) && !_this.hasPlaceholder(value)) {
                var icon = void 0;
                var visibleWhenAuthorityEmpty = _this.displayObj !== metadata;
                // Set icon
                icon = {
                    metadata: metadata,
                    visibleWhenAuthorityEmpty: visibleWhenAuthorityEmpty,
                    style: config.style
                };
                icons.push(icon);
            }
        });
        return icons;
    };
    /**
     * Sets initial items, used in edit mode
     */
    Chips.prototype.setInitialItems = function (items) {
        var _this = this;
        this._items = [];
        items.forEach(function (item) {
            var icons = _this.getChipsIcons(item);
            var chipsItem = new ChipsItem(item, _this.displayField, _this.displayObj, icons);
            _this._items.push(chipsItem);
        });
        this.chipsItems = new BehaviorSubject(this._items);
    };
    return Chips;
}());
export { Chips };
//# sourceMappingURL=chips.model.js.map