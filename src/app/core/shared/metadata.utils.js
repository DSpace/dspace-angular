import { isEmpty, isNotUndefined, isUndefined } from '../../shared/empty.util';
import { MetadataValue } from './metadata.models';
import { groupBy, sortBy } from 'lodash';
/**
 * Utility class for working with DSpace object metadata.
 *
 * When specifying metadata keys, wildcards are supported, so `'*'` will match all keys, `'dc.date.*'` will
 * match all qualified dc dates, and so on. Exact keys will be evaluated (and matches returned) in the order
 * they are given.
 *
 * When multiple keys in a map match a given wildcard, they are evaluated in the order they are stored in
 * the map (alphanumeric if obtained from the REST api). If duplicate or overlapping keys are specified, the
 * first one takes precedence. For example, specifying `['dc.date', 'dc.*', '*']` will cause any `dc.date`
 * values to be evaluated (and returned, if matched) first, followed by any other `dc` metadata values,
 * followed by any other (non-dc) metadata values.
 */
var Metadata = /** @class */ (function () {
    function Metadata() {
    }
    /**
     * Gets all matching metadata in the map(s).
     *
     * @param {MetadataMapInterface|MetadataMapInterface[]} mapOrMaps The source map(s). When multiple maps are given, they will be
     * checked in order, and only values from the first with at least one match will be returned.
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {MetadataValue[]} the matching values or an empty array.
     */
    Metadata.all = function (mapOrMaps, keyOrKeys, filter) {
        var mdMaps = mapOrMaps instanceof Array ? mapOrMaps : [mapOrMaps];
        var matches = [];
        for (var _i = 0, mdMaps_1 = mdMaps; _i < mdMaps_1.length; _i++) {
            var mdMap = mdMaps_1[_i];
            for (var _a = 0, _b = Metadata.resolveKeys(mdMap, keyOrKeys); _a < _b.length; _a++) {
                var mdKey = _b[_a];
                var candidates = mdMap[mdKey];
                if (candidates) {
                    for (var _c = 0, candidates_1 = candidates; _c < candidates_1.length; _c++) {
                        var candidate = candidates_1[_c];
                        if (Metadata.valueMatches(candidate, filter)) {
                            matches.push(candidate);
                        }
                    }
                }
            }
            if (!isEmpty(matches)) {
                return matches;
            }
        }
        return matches;
    };
    /**
     * Like [[Metadata.all]], but only returns string values.
     *
     * @param {MetadataMapInterface|MetadataMapInterface[]} mapOrMaps The source map(s). When multiple maps are given, they will be
     * checked in order, and only values from the first with at least one match will be returned.
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {string[]} the matching string values or an empty array.
     */
    Metadata.allValues = function (mapOrMaps, keyOrKeys, filter) {
        return Metadata.all(mapOrMaps, keyOrKeys, filter).map(function (mdValue) { return mdValue.value; });
    };
    /**
     * Gets the first matching MetadataValue object in the map(s), or `undefined`.
     *
     * @param {MetadataMapInterface|MetadataMapInterface[]} mapOrMaps The source map(s).
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {MetadataValue} the first matching value, or `undefined`.
     */
    Metadata.first = function (mdMapOrMaps, keyOrKeys, filter) {
        var mdMaps = mdMapOrMaps instanceof Array ? mdMapOrMaps : [mdMapOrMaps];
        for (var _i = 0, mdMaps_2 = mdMaps; _i < mdMaps_2.length; _i++) {
            var mdMap = mdMaps_2[_i];
            for (var _a = 0, _b = Metadata.resolveKeys(mdMap, keyOrKeys); _a < _b.length; _a++) {
                var key = _b[_a];
                var values = mdMap[key];
                if (values) {
                    return values.find(function (value) { return Metadata.valueMatches(value, filter); });
                }
            }
        }
    };
    /**
     * Like [[Metadata.first]], but only returns a string value, or `undefined`.
     *
     * @param {MetadataMapInterface|MetadataMapInterface[]} mapOrMaps The source map(s).
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {string} the first matching string value, or `undefined`.
     */
    Metadata.firstValue = function (mdMapOrMaps, keyOrKeys, filter) {
        var value = Metadata.first(mdMapOrMaps, keyOrKeys, filter);
        return isUndefined(value) ? undefined : value.value;
    };
    /**
     * Checks for a matching metadata value in the given map(s).
     *
     * @param {MetadataMapInterface|MetadataMapInterface[]} mapOrMaps The source map(s).
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
     * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
     * @returns {boolean} whether a match is found.
     */
    Metadata.has = function (mdMapOrMaps, keyOrKeys, filter) {
        return isNotUndefined(Metadata.first(mdMapOrMaps, keyOrKeys, filter));
    };
    /**
     * Checks if a value matches a filter.
     *
     * @param {MetadataValue} mdValue the value to check.
     * @param {MetadataValueFilter} filter the filter to use.
     * @returns {boolean} whether the filter matches, or true if no filter is given.
     */
    Metadata.valueMatches = function (mdValue, filter) {
        if (!filter) {
            return true;
        }
        else if (filter.language && filter.language !== mdValue.language) {
            return false;
        }
        else if (filter.value) {
            var fValue = filter.value;
            var mValue = mdValue.value;
            if (filter.ignoreCase) {
                fValue = filter.value.toLowerCase();
                mValue = mdValue.value.toLowerCase();
            }
            if (filter.substring) {
                return mValue.includes(fValue);
            }
            else {
                return mValue === fValue;
            }
        }
        return true;
    };
    /**
     * Gets the list of keys in the map limited by, and in the order given by `keyOrKeys`.
     *
     * @param {MetadataMapInterface} mdMap The source map.
     * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
     */
    Metadata.resolveKeys = function (mdMap, keyOrKeys) {
        if (mdMap === void 0) { mdMap = {}; }
        var inputKeys = keyOrKeys instanceof Array ? keyOrKeys : [keyOrKeys];
        var outputKeys = [];
        for (var _i = 0, inputKeys_1 = inputKeys; _i < inputKeys_1.length; _i++) {
            var inputKey = inputKeys_1[_i];
            if (inputKey.includes('*')) {
                var inputKeyRegex = new RegExp('^' + inputKey.replace('.', '\.').replace('*', '.*') + '$');
                for (var _a = 0, _b = Object.keys(mdMap); _a < _b.length; _a++) {
                    var mapKey = _b[_a];
                    if (!outputKeys.includes(mapKey) && inputKeyRegex.test(mapKey)) {
                        outputKeys.push(mapKey);
                    }
                }
            }
            else if (mdMap.hasOwnProperty(inputKey) && !outputKeys.includes(inputKey)) {
                outputKeys.push(inputKey);
            }
        }
        return outputKeys;
    };
    /**
     * Creates an array of MetadatumViewModels from an existing MetadataMapInterface.
     *
     * @param {MetadataMapInterface} mdMap The source map.
     * @returns {MetadatumViewModel[]} List of metadata view models based on the source map.
     */
    Metadata.toViewModelList = function (mdMap) {
        var metadatumList = [];
        Object.keys(mdMap)
            .sort()
            .forEach(function (key) {
            var fields = mdMap[key].map(function (metadataValue, index) {
                return Object.assign({}, metadataValue, {
                    order: index,
                    key: key
                });
            });
            metadatumList = metadatumList.concat(fields);
        });
        return metadatumList;
    };
    /**
     * Creates an MetadataMapInterface from an existing array of MetadatumViewModels.
     *
     * @param {MetadatumViewModel[]} viewModelList The source list.
     * @returns {MetadataMapInterface} Map with metadata values based on the source list.
     */
    Metadata.toMetadataMap = function (viewModelList) {
        var metadataMap = {};
        var groupedList = groupBy(viewModelList, function (viewModel) { return viewModel.key; });
        Object.keys(groupedList)
            .sort()
            .forEach(function (key) {
            var orderedValues = sortBy(groupedList[key], ['order']);
            metadataMap[key] = orderedValues.map(function (value) {
                var val = Object.assign(new MetadataValue(), value);
                delete val.order;
                delete val.key;
                return val;
            });
        });
        return metadataMap;
    };
    return Metadata;
}());
export { Metadata };
//# sourceMappingURL=metadata.utils.js.map