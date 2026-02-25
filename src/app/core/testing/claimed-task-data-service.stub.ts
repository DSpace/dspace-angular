import {
  EMPTY,
  Observable,
} from 'rxjs';

import { RemoteData } from '../data/remote-data';
import { ClaimedTask } from '../tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '../tasks/models/process-task-response';

export class ClaimedTaskDataServiceStub {

  public submitTask(_scopeId: string, _body: any): Observable<ProcessTaskResponse> {
    return EMPTY;
  }

  public findByItem(_uuid: string): Observable<RemoteData<ClaimedTask>> {
    return EMPTY;
  }

}
