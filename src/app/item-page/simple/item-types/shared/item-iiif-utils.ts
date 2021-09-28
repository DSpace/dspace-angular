import { Item } from '../../../../core/shared/item.model';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { RouteService } from '../../../../core/services/route.service';

export const isIiifEnabled = (item: Item) => {
  return !!item.firstMetadataValue('dspace.iiif.enabled');

};

export const isIiifSearchEnabled = (item: Item) => {
  return !!item.firstMetadataValue('iiif.search.enabled');

};

export const getDSpaceQuery = (item: Item, routeService: RouteService): Observable<string> => {
  return routeService.getHistory().pipe(
    take(1),
    map(routes => routes[routes.length - 2 ]),
    filter(r => {
      return r.includes('/search');
    }),
    map(r => {
      const arr = r.split('&');
      const q = arr[1];
      const v = q.split('=');
      return v[1];
    })
  );
};
