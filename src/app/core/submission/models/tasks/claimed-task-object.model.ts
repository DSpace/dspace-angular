import { TaskObject } from './task-object.model';
import { RemoteData } from '../../../data/remote-data';
import { Observable } from 'rxjs/Observable';
import { Workflowitem } from '../workflowitem.model';
import { CacheableObject } from '../../../cache/object-cache.reducer';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { ListableObject } from '../../../../shared/object-collection/shared/listable-object.model';

export class ClaimedTask extends DSpaceObject implements CacheableObject, ListableObject {

  /**
   * The workflow step
   */
  step: string;

  /**
   * The task action type
   */
  action: string;

  workflowitem: Observable<RemoteData<Workflowitem[]>> | Workflowitem[];
}
