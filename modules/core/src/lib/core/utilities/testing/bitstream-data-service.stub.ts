import {
  Observable,
  of as observableOf,
} from 'rxjs';

import {
  RemoteData,
  RequestEntryState,
} from '../../data';
import {
  Bitstream,
  NoContent,
} from '../../shared';

export class BitstreamDataServiceStub {

  removeMultiple(_bitstreams: Bitstream[]): Observable<RemoteData<NoContent>> {
    return observableOf(new RemoteData(0, 0, 0, RequestEntryState.Success));
  }

}
