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
  return getBooleanValue(item.firstMetadataValue('dspace.iiif.enabled'));

};

export const isIiifSearchEnabled = (item: Item) => {
  return getBooleanValue(item.firstMetadataValue('iiif.search.enabled'));

};

/**
 * Accepts string input metadata value and returns boolean. If undefined input
 * returns false.
 * @param input metadata value
 */
function getBooleanValue(input: string): boolean {
  if (hasValue(input)) {
    return input.toLowerCase() === 'true' || input.toLowerCase() === 'yes';
  }
  return false;
}

/**
 * Checks to see if previous route was a dspace search. If
 * it was, the search term is extracted and passed
 * to the mirador viewer component.
 * @param routeService
 */
export const getDSpaceQuery = (routeService: RouteService): Observable<string> => {

  return routeService.getPreviousUrl().pipe(
    map(r => new DefaultUrlSerializer().parse(r)),
    filter(r => {
      return r.queryParamMap.keys.includes('query');
    }),
    map((url: UrlTree) => {
      return url.queryParamMap.get('query');
    }),
    take(1),
  );
};
