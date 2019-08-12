import { Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { RemoteData } from '../../core/data/remote-data';
import { RequestEntry } from '../../core/data/request.reducer';
import { hasValue } from '../empty.util';
import { NormalizedObject } from '../../core/cache/models/normalized-object.model';
import { createSuccessfulRemoteDataObject$ } from '../testing/utils';

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
    buildSingle: (href$: string | Observable<string>) => createSuccessfulRemoteDataObject$({}),
    build: (normalized: NormalizedObject<any>) => Object.create({})
  } as RemoteDataBuildService;

}
