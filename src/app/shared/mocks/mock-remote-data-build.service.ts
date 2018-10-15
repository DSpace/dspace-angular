import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { RemoteData } from '../../core/data/remote-data';
import { RequestEntry } from '../../core/data/request.reducer';
import { hasValue } from '../empty.util';
import { NormalizedObject } from '../../core/cache/models/normalized-object.model';

export function getMockRemoteDataBuildService(toRemoteDataObservable$?: Observable<RemoteData<any>>): RemoteDataBuildService {
  return {
    toRemoteDataObservable: (requestEntry$: Observable<RequestEntry>, responseCache$: Observable<ResponseCacheEntry>, payload$: Observable<any>) => {

      if (hasValue(toRemoteDataObservable$)) {
        return toRemoteDataObservable$;
      } else {
        return payload$.pipe(map((payload) => ({
          payload
        } as RemoteData<any>)))
      }
    },
    buildSingle: (href$: string | Observable<string>) => Observable.of(new RemoteData(false, false, true, undefined, {}))
  } as RemoteDataBuildService;

}
