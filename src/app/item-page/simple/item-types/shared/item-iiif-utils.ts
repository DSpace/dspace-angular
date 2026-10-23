import {
  DefaultUrlSerializer,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  filter,
  map,
  take,
} from 'rxjs/operators';

import { RouteService } from '../../../../core/services/route.service';
import { Item } from '../../../../core/shared/item.model';
import { hasValue } from '../../../../shared/empty.util';

export const isIiifEnabled = (item: Item) => {
  return String(item.firstMetadataValue('dspace.iiif.enabled')?.valueOf?.() || '').trim().toLowerCase() === 'true';

};

export const isIiifSearchEnabled = (item: Item) => {
  return String(item.firstMetadataValue('iiif.search.enabled')?.valueOf?.() || '').trim().toLowerCase() === 'true';

};

/**
 * Checks to see if previous route was a dspace search. If
 * it was, the search term is extracted and subsequently passed
 * to the mirador viewer component.
 * @param item the dspace object
 * @param routeService
 */
export const getDSpaceQuery = (item: Item, routeService: RouteService): Observable<string> => {

  return routeService.getPreviousUrl().pipe(
    filter(r => {
      return r.includes('/search');
    }),
    map((r: string) => {
      const url: UrlTree = new DefaultUrlSerializer().parse(r);
      const queryParamMap = url.queryParamMap;
      const unprefixedQuery = queryParamMap.get('query');
      if (hasValue(unprefixedQuery)) {
        return unprefixedQuery;
      }
      const prefixedKey = queryParamMap.keys.find((key: string) => key.endsWith('.query'));
      return hasValue(prefixedKey) ? queryParamMap.get(prefixedKey) : null;
    }),
    take(1),
  );
};
