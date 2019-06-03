import * as tslib_1 from "tslib";
import * as uuidv4 from 'uuid/v4';
import { autoserialize, Serialize, Deserialize } from 'cerialize';
import { hasValue } from '../../shared/empty.util';
/* tslint:disable:max-classes-per-file */
var VIRTUAL_METADATA_PREFIX = 'virtual::';
/** A map of metadata keys to an ordered list of MetadataValue objects. */
var MetadataMap = /** @class */ (function () {
    function MetadataMap() {
    }
    return MetadataMap;
}());
export { MetadataMap };
/** A single metadata value and its properties. */
var MetadataValue = /** @class */ (function () {
    function MetadataValue() {
        /** The uuid. */
        this.uuid = uuidv4();
    }
    Object.defineProperty(MetadataValue.prototype, "isVirtual", {
        /**
         * Returns true if this Metadatum's authority key starts with 'virtual::'
         */
        get: function () {
            return hasValue(this.authority) && this.authority.startsWith(VIRTUAL_METADATA_PREFIX);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MetadataValue.prototype, "virtualValue", {
        /**
         * If this is a virtual Metadatum, it returns everything in the authority key after 'virtual::'.
         * Returns undefined otherwise.
         */
        get: function () {
            if (this.isVirtual) {
                return this.authority.substring(this.authority.indexOf(VIRTUAL_METADATA_PREFIX) + VIRTUAL_METADATA_PREFIX.length);
            }
            else {
                return undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataValue.prototype, "language", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataValue.prototype, "value", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], MetadataValue.prototype, "place", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", String)
    ], MetadataValue.prototype, "authority", void 0);
    tslib_1.__decorate([
        autoserialize,
        tslib_1.__metadata("design:type", Number)
    ], MetadataValue.prototype, "confidence", void 0);
    return MetadataValue;
}());
export { MetadataValue };
var MetadatumViewModel = /** @class */ (function () {
    function MetadatumViewModel() {
        /** The uuid. */
        this.uuid = uuidv4();
    }
    return MetadatumViewModel;
}());
export { MetadatumViewModel };
/** Serializer used for MetadataMaps.
 * This is necessary because Cerialize has trouble instantiating the MetadataValues using their constructor
 * when they are inside arrays which also represent the values in a map.
 */
export var MetadataMapSerializer = {
    Serialize: function (map) {
        var json = {};
        Object.keys(map).forEach(function (key) {
            json[key] = Serialize(map[key], MetadataValue);
        });
        return json;
    },
    Deserialize: function (json) {
        var metadataMap = {};
        Object.keys(json).forEach(function (key) {
            metadataMap[key] = Deserialize(json[key], MetadataValue);
        });
        return metadataMap;
    }
};
/* tslint:enable:max-classes-per-file */
//# sourceMappingURL=metadata.models.js.map