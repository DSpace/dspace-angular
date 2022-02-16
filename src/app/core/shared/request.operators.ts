import { RequestService } from '../data/request.service';
import { Observable } from 'rxjs';
import { RestRequest } from '../data/request.models';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { RequestEntry, ResponseState } from '../data/request.reducer';
import { hasValue, hasValueOperator } from '../../shared/empty.util';

/**
 * This file contains custom RxJS operators that can be used in multiple places
 */

export const getRequestFromRequestHref = (requestService: RequestService) =>
  (source: Observable<string>): Observable<RequestEntry> =>
    source.pipe(
      mergeMap((href: string) => requestService.getByHref(href)),
      hasValueOperator()
    );
export const getRequestFromRequestUUID = (requestService: RequestService) =>
  (source: Observable<string>): Observable<RequestEntry> =>
    source.pipe(
      mergeMap((uuid: string) => requestService.getByUUID(uuid)),
      hasValueOperator()
    );
export const getResponseFromEntry = () =>
  (source: Observable<RequestEntry>): Observable<ResponseState> =>
    source.pipe(
      filter((entry: RequestEntry) => hasValue(entry) && hasValue(entry.response)),
      map((entry: RequestEntry) => entry.response)
    );
export const sendRequest = (requestService: RequestService) =>
  (source: Observable<RestRequest>): Observable<RestRequest> =>
    source.pipe(tap((request: RestRequest) => requestService.send(request)));
