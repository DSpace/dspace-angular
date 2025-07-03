import {
  Observable,
  of,
} from 'rxjs';

import { RemoteData } from '../../core/data/remote-data';
import { RequestEntryState } from '../../core/data/request-entry-state.model';
import { Bitstream } from '../../core/shared/bitstream.model';
import { NoContent } from '../../core/shared/NoContent.model';

export class BitstreamDataServiceStub {

  removeMultiple(_bitstreams: Bitstream[]): Observable<RemoteData<NoContent>> {
    return of(new RemoteData(0, 0, 0, RequestEntryState.Success));
  }

}
