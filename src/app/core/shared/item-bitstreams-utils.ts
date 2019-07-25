import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { Bitstream } from './bitstream.model';
import { map } from 'rxjs/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { getSucceededRemoteData } from './operators';

export const toBitstreamsArray = () =>
  (source: Observable<RemoteData<PaginatedList<Bitstream>>>): Observable<Bitstream[]> =>
    source.pipe(
      getSucceededRemoteData(),
      map((bitstreamRD: RemoteData<PaginatedList<Bitstream>>) => bitstreamRD.payload.page)
    );

export const getBundleNames = () =>
  (source: Observable<RemoteData<PaginatedList<Bitstream>>>): Observable<string[]> =>
    source.pipe(
      toBitstreamsArray(),
      map((bitstreams: Bitstream[]) => {
        const result = [];
        bitstreams.forEach((bitstream: Bitstream) => {
          if (result.indexOf(bitstream.bundleName) < 0) {
            result.push(bitstream.bundleName);
          }
        });
        return result;
      })
    );

export const filterByBundleName = (bundleName: string) =>
  (source: Observable<RemoteData<PaginatedList<Bitstream>>>): Observable<Bitstream[]> =>
    source.pipe(
      toBitstreamsArray(),
      map((bitstreams: Bitstream[]) =>
        bitstreams.filter((bitstream: Bitstream) => bitstream.bundleName === bundleName)
      )
    );

export const toBundleMap = () =>
  (source: Observable<RemoteData<PaginatedList<Bitstream>>>): Observable<Map<string, Bitstream[]>> =>
    observableCombineLatest(source.pipe(toBitstreamsArray()), source.pipe(getBundleNames())).pipe(
      map(([bitstreams, bundleNames]) => {
        const bundleMap = new Map();
        bundleNames.forEach((bundleName: string) => {
          bundleMap.set(bundleName, bitstreams.filter((bitstream: Bitstream) => bitstream.bundleName === bundleName));
        });
        return bundleMap;
      })
    );
