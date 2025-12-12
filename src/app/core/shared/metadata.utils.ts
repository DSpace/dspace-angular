import escape from 'lodash/escape';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import {
  isNotEmpty,
  isNotUndefined,
  isUndefined,
} from '../../shared/empty.util';
import {
  MetadataMapInterface,
  MetadataValue,
  MetadataValueFilter,
  MetadatumViewModel,
} from './metadata.models';

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
export class Metadata {

  /**
   * Gets all matching metadata in the map(s).
   *
   * @param metadata The metadata values.
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
   * @param hitHighlights The search hit highlights.
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   * @returns {MetadataValue[]} the matching values or an empty array.
   */
  public static all(metadata: MetadataMapInterface, keyOrKeys: string | string[], hitHighlights?: MetadataMapInterface, filter?: MetadataValueFilter, escapeHTML?: boolean): MetadataValue[] {
    const matches: MetadataValue[] = [];
    if (isNotEmpty(hitHighlights)) {
      for (const mdKey of Metadata.resolveKeys(hitHighlights, keyOrKeys)) {
        if (hitHighlights[mdKey]) {
          for (const candidate of hitHighlights[mdKey]) {
            if (Metadata.valueMatches(candidate as MetadataValue, filter)) {
              matches.push(candidate as MetadataValue);
            }
          }
        }
      }
      if (isNotEmpty(matches)) {
        return matches;
      }
    }
    for (const mdKey of Metadata.resolveKeys(metadata, keyOrKeys)) {
      if (metadata[mdKey]) {
        for (const candidate of metadata[mdKey]) {
          if (Metadata.valueMatches(candidate as MetadataValue, filter)) {
            if (escapeHTML) {
              matches.push(Object.assign(new MetadataValue(), candidate, {
                value: escape(candidate.value),
              }));
            } else {
              matches.push(candidate as MetadataValue);
            }
          }
        }
      }
    }
    return matches;
  }

  /**
   * Like [[Metadata.all]], but only returns string values.
   *
   * @param metadata The metadata values.
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
   * @param hitHighlights The search hit highlights.
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   * @returns {string[]} the matching string values or an empty array.
   */
  public static allValues(metadata: MetadataMapInterface, keyOrKeys: string | string[], hitHighlights?: MetadataMapInterface, filter?: MetadataValueFilter, escapeHTML?: boolean): string[] {
    return Metadata.all(metadata, keyOrKeys, hitHighlights, filter, escapeHTML).map((mdValue) => mdValue.value);
  }

  /**
   * Gets the first matching MetadataValue object in the map(s), or `undefined`.
   *
   * @param metadata The metadata values.
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
   * @param hitHighlights The search hit highlights.
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   * @returns {MetadataValue} the first matching value, or `undefined`.
   */
  public static first(metadata: MetadataMapInterface, keyOrKeys: string | string[], hitHighlights?: MetadataMapInterface, filter?: MetadataValueFilter, escapeHTML?: boolean): MetadataValue {
    if (isNotEmpty(hitHighlights)) {
      for (const key of Metadata.resolveKeys(hitHighlights, keyOrKeys)) {
        const values: MetadataValue[] = hitHighlights[key] as MetadataValue[];
        if (values) {
          return values.find((value: MetadataValue) => Metadata.valueMatches(value, filter));
        }
      }
    }
    for (const key of Metadata.resolveKeys(metadata, keyOrKeys)) {
      const values: MetadataValue[] = metadata[key] as MetadataValue[];
      if (values) {
        const result: MetadataValue = values.find((value: MetadataValue) => Metadata.valueMatches(value, filter));
        if (escapeHTML) {
          return Object.assign(new MetadataValue(), result, {
            value: escape(result.value),
          });
        }
        return result;
      }
    }
  }

  /**
   * Like [[Metadata.first]], but only returns a string value, or `undefined`.
   *
   * @param metadata The metadata values.
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
   * @param hitHighlights The search hit highlights.
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @param escapeHTML Whether the HTML is used inside a `[innerHTML]` attribute
   * @returns {string} the first matching string value, or `undefined`.
   */
  public static firstValue(metadata: MetadataMapInterface, keyOrKeys: string | string[], hitHighlights?: MetadataMapInterface, filter?: MetadataValueFilter, escapeHTML?: boolean): string {
    const value = Metadata.first(metadata, keyOrKeys, hitHighlights, filter, escapeHTML);
    return isUndefined(value) ? undefined : value.value;
  }

  /**
   * Checks for a matching metadata value in the given map(s).
   *
   * @param metadata The metadata values.
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
   * @param hitHighlights The search hit highlights.
   * @param {MetadataValueFilter} filter The value filter to use. If unspecified, no filtering will be done.
   * @returns {boolean} whether a match is found.
   */
  public static has(metadata: MetadataMapInterface, keyOrKeys: string | string[], hitHighlights?: MetadataMapInterface, filter?: MetadataValueFilter): boolean {
    return isNotUndefined(Metadata.first(metadata, keyOrKeys, hitHighlights, filter));
  }

  /**
   * Checks if a value matches a filter.
   *
   * @param {MetadataValue} mdValue the value to check.
   * @param {MetadataValueFilter} filter the filter to use.
   * @returns {boolean} whether the filter matches, or true if no filter is given.
   */
  public static valueMatches(mdValue: MetadataValue, filter: MetadataValueFilter) {
    if (!filter) {
      return true;
    } else if (filter.language && filter.language !== mdValue.language) {
      return false;
    } else if (filter.authority && filter.authority !== mdValue.authority) {
      return false;
    } else if (filter.value) {
      let fValue = filter.value;
      let mValue = mdValue.value;
      if (filter.ignoreCase) {
        fValue = filter.value.toLowerCase();
        mValue = mdValue.value.toLowerCase();
      }
      if (filter.substring) {
        return mValue.includes(fValue);
      } else {
        return mValue === fValue;
      }
    }
    return true;
  }

  /**
   * Gets the list of keys in the map limited by, and in the order given by `keyOrKeys`.
   *
   * @param {MetadataMapInterface} mdMap The source map.
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported; see above.
   */
  private static resolveKeys(mdMap: MetadataMapInterface = {}, keyOrKeys: string | string[]): string[] {
    const inputKeys: string[] = keyOrKeys instanceof Array ? keyOrKeys : [keyOrKeys];
    const outputKeys: string[] = [];
    for (const inputKey of inputKeys) {
      if (inputKey.includes('*')) {
        const inputKeyRegex = new RegExp('^' + inputKey.replace(/\\/g, '\\\\').replace(/\./g, '\\.').replace(/\*/g, '.*') + '$');
        for (const mapKey of Object.keys(mdMap)) {
          if (!outputKeys.includes(mapKey) && inputKeyRegex.test(mapKey)) {
            outputKeys.push(mapKey);
          }
        }
      } else if (mdMap.hasOwnProperty(inputKey) && !outputKeys.includes(inputKey)) {
        outputKeys.push(inputKey);
      }
    }
    return outputKeys;
  }

  /**
   * Creates an array of MetadatumViewModels from an existing MetadataMapInterface.
   *
   * @param {MetadataMapInterface} mdMap The source map.
   * @returns {MetadatumViewModel[]} List of metadata view models based on the source map.
   */
  public static toViewModelList(mdMap: MetadataMapInterface): MetadatumViewModel[] {
    let metadatumList: MetadatumViewModel[] = [];
    Object.keys(mdMap)
      .sort()
      .forEach((key: string) => {
        const fields = mdMap[key].map(
          (metadataValue: MetadataValue, index: number) =>
            Object.assign(
              {},
              metadataValue,
              {
                order: index,
                key,
              }));
        metadatumList = [...metadatumList, ...fields];
      });
    return metadatumList;
  }

  /**
   * Creates an MetadataMapInterface from an existing array of MetadatumViewModels.
   *
   * @param {MetadatumViewModel[]} viewModelList The source list.
   * @returns {MetadataMapInterface} Map with metadata values based on the source list.
   */
  public static toMetadataMap(viewModelList: MetadatumViewModel[]): MetadataMapInterface {
    const metadataMap: MetadataMapInterface = {};
    const groupedList = groupBy(viewModelList, (viewModel) => viewModel.key);
    Object.keys(groupedList)
      .sort()
      .forEach((key: string) => {
        const orderedValues = sortBy(groupedList[key], ['order']);
        metadataMap[key] = orderedValues.map((value: MetadatumViewModel) => {
          const val = Object.assign(new MetadataValue(), value);
          delete (val as any).order;
          delete (val as any).key;
          return val;
        },
        );
      });
    return metadataMap;
  }

  /**
   * Set the first value of a metadata by field key
   * Creates a new MetadataValue if the field doesn't exist yet
   * @param mdMap   The map to add/change values in
   * @param key     The metadata field
   * @param value   The value to add
   */
  public static setFirstValue(mdMap: MetadataMapInterface, key: string, value: string) {
    if (isNotEmpty(mdMap[key])) {
      mdMap[key][0].value = value;
    } else {
      mdMap[key] = [Object.assign(new MetadataValue(), { value: value })];
    }
  }
}
