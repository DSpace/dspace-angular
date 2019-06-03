import { Metadata } from './metadata.utils';
import { isUndefined } from '../../shared/empty.util';
import { hasNoValue } from '../../shared/empty.util';
/**
 * An abstract model class for a DSpaceObject.
 */
var DSpaceObject = /** @class */ (function () {
    function DSpaceObject() {
    }
    Object.defineProperty(DSpaceObject.prototype, "name", {
        /**
         * The name for this DSpaceObject
         */
        get: function () {
            return (isUndefined(this._name)) ? this.firstMetadataValue('dc.title') : this._name;
        },
        /**
         * The name for this DSpaceObject
         */
        set: function (name) {
            this._name = name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DSpaceObject.prototype, "metadataAsList", {
        /**
         * Retrieve the current metadata as a list of MetadatumViewModels
         */
        get: function () {
            return Metadata.toViewModelList(this.metadata);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets all matching metadata in this DSpaceObject.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {MetadataValue[]} the matching values or an empty array.
     */
    DSpaceObject.prototype.allMetadata = function (keyOrKeys, valueFilter) {
        return Metadata.all(this.metadata, keyOrKeys, valueFilter);
    };
    /**
     * Like [[allMetadata]], but only returns string values.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {string[]} the matching string values or an empty array.
     */
    DSpaceObject.prototype.allMetadataValues = function (keyOrKeys, valueFilter) {
        return Metadata.allValues(this.metadata, keyOrKeys, valueFilter);
    };
    /**
     * Gets the first matching MetadataValue object in this DSpaceObject, or `undefined`.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {MetadataValue} the first matching value, or `undefined`.
     */
    DSpaceObject.prototype.firstMetadata = function (keyOrKeys, valueFilter) {
        return Metadata.first(this.metadata, keyOrKeys, valueFilter);
    };
    /**
     * Like [[firstMetadata]], but only returns a string value, or `undefined`.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {string} the first matching string value, or `undefined`.
     */
    DSpaceObject.prototype.firstMetadataValue = function (keyOrKeys, valueFilter) {
        return Metadata.firstValue(this.metadata, keyOrKeys, valueFilter);
    };
    /**
     * Checks for a matching metadata value in this DSpaceObject.
     *
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see [[Metadata]].
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {boolean} whether a match is found.
     */
    DSpaceObject.prototype.hasMetadata = function (keyOrKeys, valueFilter) {
        return Metadata.has(this.metadata, keyOrKeys, valueFilter);
    };
    /**
     * Find metadata on a specific field and order all of them using their "place" property.
     * @param key
     */
    DSpaceObject.prototype.findMetadataSortedByPlace = function (key) {
        return this.allMetadata([key]).sort(function (a, b) {
            if (hasNoValue(a.place) && hasNoValue(b.place)) {
                return 0;
            }
            if (hasNoValue(a.place)) {
                return -1;
            }
            if (hasNoValue(b.place)) {
                return 1;
            }
            return a.place - b.place;
        });
    };
    return DSpaceObject;
}());
export { DSpaceObject };
//# sourceMappingURL=dspace-object.model.js.map