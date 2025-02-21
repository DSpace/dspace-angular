import {
  EMPTY,
  Observable,
} from 'rxjs';

import { RemoteData } from '../../data';
import { ClaimedTask } from '../../tasks';
import { ProcessTaskResponse } from '../../tasks';

export class ClaimedTaskDataServiceStub {

  public submitTask(_scopeId: string, _body: any): Observable<ProcessTaskResponse> {
    return EMPTY;
  }

  public findByItem(_uuid: string): Observable<RemoteData<ClaimedTask>> {
    return EMPTY;
  }

}
