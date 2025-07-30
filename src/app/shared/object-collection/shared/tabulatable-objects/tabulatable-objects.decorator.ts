import { TABULATABLE_OBJECTS_COMPONENT_MAP } from '../../../../../decorator-registries/tabulatable-objects-component-registry';
import { Context } from '../../../../core/shared/context.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import {
  hasNoValue,
  hasValue,
} from '../../../empty.util';
import { ListableObject } from '../listable-object.model';
import {
  DEFAULT_CONTEXT,
  DEFAULT_THEME,
  DEFAULT_VIEW_MODE,
  getMatch,
  MatchRelevancy,
} from '../listable-object/listable-object.decorator';

/**
 * Decorator used for rendering tabulatable objects
 * @param objectsType The object type or entity type the component represents
 * @param viewMode The view mode the component represents
 * @param context The optional context the component represents
 * @param theme The optional theme for the component
 */
export function tabulatableObjectsComponent(objectsType: string | GenericConstructor<ListableObject>, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT, theme = DEFAULT_THEME) {
  return function decorator(component: any) {
  };
}

/**
 * Getter to retrieve the matching tabulatable objects component
 *
 * Looping over the provided types, it'll attempt to find the best match depending on the {@link MatchRelevancy} returned by getMatch()
 * The most relevant match between types is kept and eventually returned
 *
 * @param types The types of which one should match the tabulatable component
 * @param viewMode The view mode that should match the components
 * @param context The context that should match the components
 * @param theme The theme that should match the components
 */
export function getTabulatableObjectsComponent(types: (string | GenericConstructor<ListableObject>)[], viewMode: ViewMode, context: Context = DEFAULT_CONTEXT, theme: string = DEFAULT_THEME, registry = TABULATABLE_OBJECTS_COMPONENT_MAP) {
  let currentBestMatch: MatchRelevancy = null;
  for (const type of types) {
    const typeMap = registry.get(type);
    if (hasValue(typeMap)) {
      const match = getMatch(typeMap, [viewMode, context, theme], [DEFAULT_VIEW_MODE, DEFAULT_CONTEXT, DEFAULT_THEME]);
      if (hasNoValue(currentBestMatch) || (hasValue(match) && currentBestMatch.isLessRelevantThan(match))) {
        currentBestMatch = match;
      }
    }
  }
  return hasValue(currentBestMatch) ? currentBestMatch.match() : undefined;
}
