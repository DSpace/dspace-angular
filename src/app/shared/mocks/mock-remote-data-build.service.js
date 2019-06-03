import { of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { hasValue } from '../empty.util';
export function getMockRemoteDataBuildService(toRemoteDataObservable$) {
    return {
        toRemoteDataObservable: function (requestEntry$, payload$) {
            if (hasValue(toRemoteDataObservable$)) {
                return toRemoteDataObservable$;
            }
            else {
                return payload$.pipe(map(function (payload) { return ({
                    payload: payload
                }); }));
            }
        },
        buildSingle: function (href$) { return observableOf(new RemoteData(false, false, true, undefined, {})); },
        build: function (normalized) { return Object.create({}); }
    };
}
//# sourceMappingURL=mock-remote-data-build.service.js.map