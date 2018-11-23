import {of as observableOf,  Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { RemoteData } from '../../core/data/remote-data';
import { RequestEntry } from '../../core/data/request.reducer';
import { hasValue } from '../empty.util';

export function getMockRemoteDataBuildService(toRemoteDataObservable$?: Observable<RemoteData<any>>): RemoteDataBuildService {
  return {
    toRemoteDataObservable: (requestEntry$: Observable<RequestEntry>, payload$: Observable<any>) => {

      if (hasValue(toRemoteDataObservable$)) {
        return toRemoteDataObservable$;
      } else {
        return payload$.pipe(map((payload) => ({
          payload
        } as RemoteData<any>)))
      }
    },
    buildSingle: (href$: string | Observable<string>) => observableOf(new RemoteData(false, false, true, undefined, {}))
  } as RemoteDataBuildService;

}
