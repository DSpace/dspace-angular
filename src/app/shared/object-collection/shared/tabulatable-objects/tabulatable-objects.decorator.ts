import { AdminNotifySearchResult } from '@dspace/core/coar-notify/notify-info/models/admin-notify-message-search-result.model';
import { Context } from '@dspace/core/shared/context.model';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils/empty.util';

import { AdminNotifySearchResultComponent } from '../../../../admin/admin-notify-dashboard/admin-notify-search-result/admin-notify-search-result.component';
import { TabulatableResultListElementsComponent } from '../../../object-list/search-result-list-element/tabulatable-search-result/tabulatable-result-list-elements.component';
import {
  DEFAULT_CONTEXT,
  DEFAULT_THEME,
  DEFAULT_VIEW_MODE,
  getMatch,
  MatchRelevancy,
} from '../listable-object/listable-object.decorator';

type TabulatableComponentType = typeof TabulatableResultListElementsComponent;

export const TABUTABLE_DECORATOR_MAP =
  new Map<string | GenericConstructor<ListableObject>, Map<ViewMode, Map<Context, Map<string, TabulatableComponentType>>>>([
    [AdminNotifySearchResult, new Map([
      [ViewMode.Table, new Map([
        [Context.CoarNotify, new Map([[DEFAULT_THEME, AdminNotifySearchResultComponent as any]])],
      ])],
    ])],
  ]);

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
export function getTabulatableObjectsComponent(types: (string | GenericConstructor<ListableObject>)[], viewMode: ViewMode, context: Context = DEFAULT_CONTEXT, theme: string = DEFAULT_THEME) {
  let currentBestMatch: MatchRelevancy = null;
  for (const type of types) {
    const typeMap = TABUTABLE_DECORATOR_MAP.get(type);

    if (hasValue(typeMap)) {
      const match = getMatch(typeMap, [viewMode, context, theme], [DEFAULT_VIEW_MODE, DEFAULT_CONTEXT, DEFAULT_THEME]);
      if (hasNoValue(currentBestMatch) || currentBestMatch.isLessRelevantThan(match)) {
        currentBestMatch = match;
      }
    }
  }
  return hasValue(currentBestMatch) ? currentBestMatch.match : null;
}
