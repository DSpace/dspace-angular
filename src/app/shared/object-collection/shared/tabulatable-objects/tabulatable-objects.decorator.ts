import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Context } from '../../../../core/shared/context.model';
import { hasNoValue, hasValue } from '../../../empty.util';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableObject } from '../listable-object.model';
import {
  DEFAULT_CONTEXT,
  DEFAULT_THEME,
  DEFAULT_VIEW_MODE,
  MatchRelevancy, resolveTheme
} from '../listable-object/listable-object.decorator';
import { PaginatedList } from '../../../../core/data/paginated-list.model';


const map = new Map();

/**
 * Decorator used for rendering a listable object
 * @param objectType The object type or entity type the component represents
 * @param viewMode The view mode the component represents
 * @param context The optional context the component represents
 * @param theme The optional theme for the component
 */
export function tabulatableObjectsComponent(objectsType: string | GenericConstructor<PaginatedList<ListableObject>>, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
    if (hasNoValue(objectsType)) {
      return;
    }
    if (hasNoValue(map.get(objectsType))) {
      map.set(objectsType, new Map());
    }
    if (hasNoValue(map.get(objectsType).get(viewMode))) {
      map.get(objectsType).set(viewMode, new Map());
    }
    if (hasNoValue(map.get(objectsType).get(viewMode).get(context))) {
      map.get(objectsType).get(viewMode).set(context, new Map());
    }
    map.get(objectsType).get(viewMode).get(context).set(theme, component);
  };
}

/**
 * Getter to retrieve the matching listable object component
 *
 * Looping over the provided types, it'll attempt to find the best match depending on the {@link MatchRelevancy} returned by getMatch()
 * The most relevant match between types is kept and eventually returned
 *
 * @param types The types of which one should match the listable component
 * @param viewMode The view mode that should match the components
 * @param context The context that should match the components
 * @param theme The theme that should match the components
 */
export function getTabulatableObjectsComponent(types: (string | GenericConstructor<ListableObject>)[], viewMode: ViewMode, context: Context = DEFAULT_CONTEXT, theme: string = DEFAULT_THEME) {
  let currentBestMatch: MatchRelevancy = null;
  for (const type of types) {
    const typeMap = map.get(PaginatedList<typeof type>);
    if (hasValue(typeMap)) {
      const match = getMatch(typeMap, [viewMode, context, theme], [DEFAULT_VIEW_MODE, DEFAULT_CONTEXT, DEFAULT_THEME]);
      if (hasNoValue(currentBestMatch) || currentBestMatch.isLessRelevantThan(match)) {
        currentBestMatch = match;
      }
    }
  }
  return hasValue(currentBestMatch) ? currentBestMatch.match : null;
}

/**
 * Find an object within a nested map, matching the provided keys as best as possible, falling back on defaults wherever
 * needed.
 *
 * Starting off with a Map, it loops over the provided keys, going deeper into the map until it finds a value
 * If at some point, no value is found, it'll attempt to use the default value for that index instead
 * If the default value exists, the index is stored in the "level"
 * If no default value exists, 1 is added to "relevancy"
 * See {@link MatchRelevancy} what these represent
 *
 * @param typeMap         a multi-dimensional map
 * @param keys            the keys of the multi-dimensional map to loop over. Each key represents a level within the map
 * @param defaults        the default values to use for each level, in case no value is found for the key at that index
 * @returns matchAndLevel a {@link MatchRelevancy} object containing the match and its level of relevancy
 */
function getMatch(typeMap: Map<any, any>, keys: any[], defaults: any[]): MatchRelevancy {
  let currentMap = typeMap;
  let level = -1;
  let relevancy = 0;
  for (let i = 0; i < keys.length; i++) {
    // If we're currently checking the theme, resolve it first to take extended themes into account
    let currentMatch = defaults[i] === DEFAULT_THEME ? resolveTheme(currentMap, keys[i]) : currentMap.get(keys[i]);
    if (hasNoValue(currentMatch)) {
      currentMatch = currentMap.get(defaults[i]);
      if (level === -1) {
        level = i;
      }
    } else {
      relevancy++;
    }
    if (hasValue(currentMatch)) {
      if (currentMatch instanceof Map) {
        currentMap = currentMatch as Map<any, any>;
      } else {
        return new MatchRelevancy(currentMatch, level > -1 ? level : i + 1, relevancy);
      }
    } else {
      return null;
    }
  }
  return null;
}
