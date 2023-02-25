import { Bundle } from '../../../../core/shared/bundle.model';
import { EMPTY, Observable } from 'rxjs';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload
} from '../../../../core/shared/operators';
import { expand, filter, map, switchMap, take } from 'rxjs/operators';
import { PaginatedList } from '../../../../core/data/paginated-list.model';
import { hasNoValue, hasValue } from '../../../../shared/empty.util';
import { RemoteData } from '../../../../core/data/remote-data';
import { Item } from '../../../../core/shared/item.model';

export function getItemBundles(item$: Observable<Item>): Observable<PaginatedList<Bundle>> {
  return item$.pipe(
      switchMap((item: Item) => item.bundles.pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
      ))
    );
}

export function getItemHref(item: Item): string {
  return item._links.self.href;
}

export function getItem(bitstreamRD$: Observable<RemoteData<Bitstream>>): Observable<Item> {
  return bitstreamRD$.pipe(
    getFirstSucceededRemoteData(),
    getRemoteDataPayload(),
    switchMap((bitstream: Bitstream) => bitstream.bundle.pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      switchMap((bundle: Bundle) => bundle.item.pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload())
      ))));
}
export function checkForExistingAnnotation(bundle: Bundle, annotationFileTitle: string): Observable<Bitstream> {
  return bundle.bitstreams.pipe(
    getFirstCompletedRemoteData(),
    getRemoteDataPayload(),
    expand((paginatedList: PaginatedList<Bitstream>) => {
      if (hasNoValue(paginatedList.next)) {
        // If there's no next page, stop.
        return EMPTY;
      } else {
        // Otherwise retrieve the next page
        return this.bitstreamService.findListByHref(
          paginatedList.next,
          {},
          true,
          true,
        ).pipe(
          getFirstCompletedRemoteData(),
          getRemoteDataPayload(),
          map((next: PaginatedList<Bitstream>) => {
            if (hasValue(next)) {
              return next;
            } else {
              return EMPTY;
            }
          })
        )
      }
    }),
    switchMap((paginatedList: PaginatedList<Bitstream>) => {
      if (hasValue(paginatedList.page)) {
        return paginatedList.page;
      }
    }),
    //tap((bitstream: Bitstream) => console.log(bitstream)),
    filter((bitstream: Bitstream) => bitstream.metadata['dc.title'][0].value === annotationFileTitle),
    //tap((bitstream: Bitstream) => console.log('found bitstream in annotation bundle')),
    take(1)
  );
}

export function getAnnotationFileName(uuid: string): string {
  return uuid + '.json';
}
