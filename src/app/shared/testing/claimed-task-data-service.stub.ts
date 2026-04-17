import {
  EMPTY,
  Observable,
} from 'rxjs';

import { RemoteData } from '../../core/data/remote-data';
import { ClaimedTask } from '../../core/tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '../../core/tasks/models/process-task-response';

export class ClaimedTaskDataServiceStub {

  public submitTask(_scopeId: string, _body: any): Observable<ProcessTaskResponse> {
    return EMPTY;
  }

  public findByItem(_uuid: string): Observable<RemoteData<ClaimedTask>> {
    return EMPTY;
  }

}
