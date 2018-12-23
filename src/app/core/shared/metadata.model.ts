import { isEmpty } from '../../shared/empty.util';
import { MetadataMap, MetadataValue, MetadataValueFilter } from './metadata.interfaces';

/**
 * Static utility methods for working with DSpace metadata.
 */
export class Metadata {

  /**
   * Gets all matching metadata.
   *
   * @param {MetadataMap|MetadataMap[]} mapOrMaps The source map(s). Values will only be returned from one map --
   * the first with at least one match.
   * @param {string|string[]} keyOrKeys The metadata key(s) in scope. Wildcards are supported, so `'*'` will
   * match all keys, `'dc.date.*'` will match all qualified dc dates, and so on. Exact keys will be evaluated
   * (and matches returned) in the order they are given in the parameter. When multiple keys match a wildcard,
   * they are evaluated in the order they are stored in the map (alphanumeric if obtained from the REST api).
   * If duplicate or overlapping keys are specified, the first one takes precedence. For example, specifying
   * `['dc.date', 'dc.*', '*']` will cause any `dc.date` values to be evaluated (and returned, if matched)
   * first, followed by any other `dc` metadata values, followed by any other (non-dc) metadata values.
   * @param {MetadataValueFilter} filter The value filter to use.
   * @returns {MetadataValue[]} the matching values or an empty array.
   */
  public static all(mapOrMaps: MetadataMap | MetadataMap[], keyOrKeys: string | string[],
                    filter?: MetadataValueFilter): MetadataValue[] {
    const mdMaps: MetadataMap[] = mapOrMaps instanceof Array ? mapOrMaps : [ mapOrMaps ];
    const matches: MetadataValue[] = [];
    for (const mdMap of mdMaps) {
      for (const mdKey of Metadata.resolveKeys(mdMap, keyOrKeys)) {
        const candidates = mdMap[mdKey];
        if (candidates) {
          for (const candidate of candidates) {
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
  }

  /** Like `all`, but only returns string values. */
  public static allValues(mapOrMaps: MetadataMap | MetadataMap[], keyOrKeys: string | string[],
                          filter?: MetadataValueFilter): string[] {
    return Metadata.all(mapOrMaps, keyOrKeys, filter).map((mdValue) => mdValue.value);
  }

  /** Gets the first matching MetadataValue object in a map, or `undefined`. */
  public static first(mdMapOrMaps: MetadataMap | MetadataMap[], keyOrKeys: string | string[],
                      filter?: MetadataValueFilter): MetadataValue {
    const mdMaps: MetadataMap[] = mdMapOrMaps instanceof Array ? mdMapOrMaps : [ mdMapOrMaps ];
    for (const mdMap of mdMaps) {
      for (const key of Metadata.resolveKeys(mdMap, keyOrKeys)) {
        const values: MetadataValue[] = mdMap[key];
        if (values) {
          return values.find((value: MetadataValue) => Metadata.valueMatches(value, filter));
        }
      }
    }
  }

  /** Like `first`, but only returns a string value, or `undefined`. */
  public static firstValue(mdMapOrMaps: MetadataMap | MetadataMap[], keyOrKeys: string | string[],
                           filter?: MetadataValueFilter): string {
    const value = Metadata.first(mdMapOrMaps, keyOrKeys, filter);
    return value === undefined ? undefined : value.value;
  }

  /** Checks the given map for a matching value. */
  public static has(mdMapOrMaps: MetadataMap | MetadataMap[], keyOrKeys: string | string[],
                    filter?: MetadataValueFilter): boolean {
    return Metadata.first(mdMapOrMaps, keyOrKeys, filter) !== undefined;
  }

  /** Checks if a value matches a filter. */
  public static valueMatches(mdValue: MetadataValue, filter: MetadataValueFilter) {
    if (!filter) {
      return true;
    } else if (filter.language && filter.language !== mdValue.language) {
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

  /** Gets the list of keys in the map limited by, and in the order given by `keyOrKeys` */
  private static resolveKeys(mdMap: MetadataMap, keyOrKeys: string | string[]): string[] {
    const inputKeys: string[] = keyOrKeys instanceof Array ? keyOrKeys : [ keyOrKeys ];
    const outputKeys: string[] = [];
    for (const inputKey of inputKeys) {
      if (inputKey.includes('*')) {
        const inputKeyRegex = new RegExp('^' + inputKey.replace('.', '\.').replace('*', '.*') + '$');
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
}
