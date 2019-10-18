import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../data/remote-data';
import { PaginatedList } from '../data/paginated-list';
import { Bitstream } from './bitstream.model';
import { map } from 'rxjs/operators';
import { hasValue, hasValueOperator } from '../../shared/empty.util';

/**
 * Operator for turning the current page of bitstreams into an array
 */
export const toBitstreamsArray = () =>
  (source: Observable<RemoteData<PaginatedList<Bitstream>>>): Observable<Bitstream[]> =>
    source.pipe(
      hasValueOperator(),
      map((bitstreamRD: RemoteData<PaginatedList<Bitstream>>) => bitstreamRD.payload.page.filter((bitstream: Bitstream) => hasValue(bitstream)))
    );
