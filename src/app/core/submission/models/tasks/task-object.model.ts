import { CacheableObject } from '../../../cache/object-cache.reducer';
import { DSpaceObject } from '../../../shared/dspace-object.model';
import { ListableObject } from '../../../../shared/object-collection/shared/listable-object.model';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../data/remote-data';
import { Workflowitem } from '../workflowitem.model';

export class TaskObject extends DSpaceObject implements CacheableObject, ListableObject {

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
