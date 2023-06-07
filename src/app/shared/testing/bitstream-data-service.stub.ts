import { Bitstream } from '../../core/shared/bitstream.model';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { NoContent } from '../../core/shared/NoContent.model';
import { RequestEntryState } from '../../core/data/request-entry-state.model';

export class BitstreamDataServiceStub {

  removeMultiple(_bitstreams: Bitstream[]): Observable<RemoteData<NoContent>> {
    return observableOf(new RemoteData(0, 0, 0, RequestEntryState.Success));
  }

}
