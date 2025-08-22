import {
  Observable,
  of,
} from 'rxjs';

import { RemoteData } from '../data/remote-data';
import { RequestEntryState } from '../data/request-entry-state.model';
import { Bitstream } from '../shared/bitstream.model';
import { NoContent } from '../shared/NoContent.model';

export class BitstreamDataServiceStub {

  removeMultiple(_bitstreams: Bitstream[]): Observable<RemoteData<NoContent>> {
    return of(new RemoteData(0, 0, 0, RequestEntryState.Success));
  }

}
