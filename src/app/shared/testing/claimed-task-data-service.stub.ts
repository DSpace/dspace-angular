import { Observable, EMPTY } from 'rxjs';
import { ProcessTaskResponse } from '../../core/tasks/models/process-task-response';

export class ClaimedTaskDataServiceStub {

  public submitTask(_scopeId: string, _body: any): Observable<ProcessTaskResponse> {
    return EMPTY;
  }

}
